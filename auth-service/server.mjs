import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { createServer } from "node:http";

const STATE_TTL_MS = 10 * 60 * 1000;
const RELAY_TTL_MS = 2 * 60 * 1000;
const MAX_BODY_BYTES = 8192;
const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";

const htmlEscape = (value) =>
  value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

const setHeaders = (response) => {
  response.setHeader("Cache-Control", "no-store");
  response.setHeader("Pragma", "no-cache");
  response.setHeader("Referrer-Policy", "no-referrer");
  response.setHeader("X-Content-Type-Options", "nosniff");
  response.setHeader("Content-Security-Policy", "default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'");
};

const sendJson = (response, status, value) => {
  setHeaders(response);
  response.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(value));
};

const sendError = (response, status, message) => {
  sendJson(response, status, { error: message });
};

const readJson = async (request) => {
  const chunks = [];
  let length = 0;
  for await (const chunk of request) {
    length += chunk.length;
    if (length > MAX_BODY_BYTES) {
      const error = new Error("Request body is too large");
      error.status = 413;
      throw error;
    }
    chunks.push(chunk);
  }
  if (!request.headers["content-type"]?.startsWith("application/json")) {
    const error = new Error("Expected JSON");
    error.status = 415;
    throw error;
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    const error = new Error("Invalid JSON");
    error.status = 400;
    throw error;
  }
};

const isString = (value, minLength = 1, maxLength = 4096) =>
  typeof value === "string" && value.length >= minLength && value.length <= maxLength;

const isBase64Url = (value, minLength = 43, maxLength = 128) =>
  isString(value, minLength, maxLength) && /^[A-Za-z0-9_-]+$/.test(value);

const secureStringEqual = (first, second) => {
  const firstBuffer = Buffer.from(first);
  const secondBuffer = Buffer.from(second);
  return firstBuffer.length === secondBuffer.length && timingSafeEqual(firstBuffer, secondBuffer);
};

const createVerifierChallenge = (verifier) =>
  createHash("sha256").update(verifier).digest("base64url");

const getClientAddress = (request) => {
  const peer = request.socket.remoteAddress ?? "unknown";
  if (peer !== "127.0.0.1" && peer !== "::1" && peer !== "::ffff:127.0.0.1") {
    return peer;
  }
  const forwarded = request.headers["x-forwarded-for"];
  return typeof forwarded === "string" ? forwarded.split(",")[0].trim() : peer;
};

export const createAuthServer = ({
  clientId = process.env.GOOGLE_CLIENT_ID,
  clientSecret = process.env.GOOGLE_CLIENT_SECRET,
  publicBaseUrl = process.env.PUBLIC_BASE_URL ?? "https://auth.lahirux.dev:8443",
  fetchImpl = fetch,
  now = Date.now,
} = {}) => {
  const baseUrl = new URL(publicBaseUrl);
  if (baseUrl.protocol !== "https:" && baseUrl.hostname !== "localhost") {
    throw new Error("PUBLIC_BASE_URL must use HTTPS");
  }
  baseUrl.pathname = "/";
  baseUrl.search = "";
  baseUrl.hash = "";
  const redirectUri = new URL("/google/callback", baseUrl).toString();
  const pendingStates = new Map();
  const relayCodes = new Map();
  const rateLimits = new Map();

  const hasCredentials = () => isString(clientId) && isString(clientSecret);

  const rateLimited = (request, limit, windowMs) => {
    const currentTime = now();
    const address = getClientAddress(request);
    let entry = rateLimits.get(address);
    if (!entry || entry.resetAt <= currentTime) {
      entry = { count: 0, resetAt: currentTime + windowMs };
      rateLimits.set(address, entry);
    }
    entry.count += 1;
    return entry.count > limit;
  };

  const prune = () => {
    const currentTime = now();
    for (const [key, value] of pendingStates) {
      if (value.expiresAt <= currentTime) pendingStates.delete(key);
    }
    for (const [key, value] of relayCodes) {
      if (value.expiresAt <= currentTime) relayCodes.delete(key);
    }
    for (const [key, value] of rateLimits) {
      if (value.resetAt <= currentTime) rateLimits.delete(key);
    }
  };

  const exchangeWithGoogle = async (form) => {
    const response = await fetchImpl(GOOGLE_TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(form),
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) return undefined;
    const result = await response.json();
    if (!isString(result.access_token) || !Number.isFinite(result.expires_in)) {
      return undefined;
    }
    return result;
  };

  const server = createServer(async (request, response) => {
    setHeaders(response);
    try {
      prune();
      const url = new URL(request.url ?? "/", baseUrl);

      if (request.method === "GET" && url.pathname === "/healthz") {
        return sendJson(response, 200, { ok: true, oauthConfigured: hasCredentials() });
      }

      if (request.method === "GET" && url.pathname === "/google/start") {
        if (rateLimited(request, 20, 60_000)) {
          return sendError(response, 429, "Too many authorization attempts");
        }
        if (!hasCredentials()) {
          return sendError(response, 503, "Google OAuth is not configured");
        }
        const state = url.searchParams.get("state") ?? "";
        const challenge = url.searchParams.get("code_challenge") ?? "";
        if (!isBase64Url(state) || !isBase64Url(challenge, 43, 43)) {
          return sendError(response, 400, "Invalid authorization request");
        }

        pendingStates.set(state, {
          challenge,
          expiresAt: now() + STATE_TTL_MS,
        });
        const authorizeUrl = new URL(GOOGLE_AUTH_URL);
        authorizeUrl.search = new URLSearchParams({
          client_id: clientId,
          redirect_uri: redirectUri,
          response_type: "code",
          scope: "https://www.googleapis.com/auth/drive.file",
          access_type: "offline",
          prompt: "consent",
          state,
          code_challenge: challenge,
          code_challenge_method: "S256",
        }).toString();
        response.writeHead(302, { Location: authorizeUrl.toString() });
        return response.end();
      }

      if (request.method === "GET" && url.pathname === "/google/callback") {
        const state = url.searchParams.get("state") ?? "";
        const pending = pendingStates.get(state);
        pendingStates.delete(state);

        const callbackUrl = new URL("obsidian://remotely-sync-cb-googledrive");
        const googleError = url.searchParams.get("error");
        const googleCode = url.searchParams.get("code");
        if (!pending || pending.expiresAt <= now()) {
          callbackUrl.searchParams.set("error", "invalid_state");
        } else if (googleError) {
          callbackUrl.searchParams.set("error", "authorization_denied");
          callbackUrl.searchParams.set("state", state);
        } else if (!isString(googleCode)) {
          callbackUrl.searchParams.set("error", "missing_code");
          callbackUrl.searchParams.set("state", state);
        } else {
          const relayCode = randomBytes(32).toString("base64url");
          relayCodes.set(relayCode, {
            state,
            googleCode,
            challenge: pending.challenge,
            expiresAt: now() + RELAY_TTL_MS,
          });
          callbackUrl.searchParams.set("code", relayCode);
          callbackUrl.searchParams.set("state", state);
        }

        const callback = callbackUrl.toString();
        const authorizationFailed = callbackUrl.searchParams.has("error");
        setHeaders(response);
        response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        return response.end(
          `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Return to Remotely Sync</title><body><main><h1>Return to Remotely Sync</h1><p>${authorizationFailed ? "Authorization could not be completed." : "Authorization is complete."} Use the link below to return to the plugin.</p><p><a href="${htmlEscape(callback)}">Open Remotely Sync</a></p></main></body></html>`
        );
      }

      if (request.method === "POST" && url.pathname === "/google/exchange") {
        if (rateLimited(request, 60, 60_000)) {
          return sendError(response, 429, "Too many requests");
        }
        if (!hasCredentials()) {
          return sendError(response, 503, "Google OAuth is not configured");
        }
        const body = await readJson(request);
        if (
          !isBase64Url(body.code) ||
          !isBase64Url(body.state) ||
          !isBase64Url(body.code_verifier)
        ) {
          return sendError(response, 400, "Invalid authorization exchange");
        }
        const relay = relayCodes.get(body.code);
        if (
          !relay ||
          relay.expiresAt <= now() ||
          !secureStringEqual(relay.state, body.state) ||
          !secureStringEqual(relay.challenge, createVerifierChallenge(body.code_verifier))
        ) {
          return sendError(response, 400, "Authorization code is invalid or expired");
        }
        relayCodes.delete(body.code);

        const tokens = await exchangeWithGoogle({
          client_id: clientId,
          client_secret: clientSecret,
          code: relay.googleCode,
          code_verifier: body.code_verifier,
          grant_type: "authorization_code",
          redirect_uri: redirectUri,
        });
        if (!tokens) {
          return sendError(response, 502, "Google token exchange failed");
        }
        const tokenResponse = {
          access_token: tokens.access_token,
          expires_in: tokens.expires_in,
          scope: tokens.scope,
          token_type: tokens.token_type,
        };
        if (isString(tokens.refresh_token, 1, 8192)) {
          tokenResponse.refresh_token = tokens.refresh_token;
        }
        return sendJson(response, 200, tokenResponse);
      }

      if (request.method === "POST" && url.pathname === "/google/refresh") {
        if (rateLimited(request, 120, 60_000)) {
          return sendError(response, 429, "Too many requests");
        }
        if (!hasCredentials()) {
          return sendError(response, 503, "Google OAuth is not configured");
        }
        const body = await readJson(request);
        if (!isString(body.refresh_token, 1, 8192)) {
          return sendError(response, 400, "Invalid refresh request");
        }
        const tokens = await exchangeWithGoogle({
          client_id: clientId,
          client_secret: clientSecret,
          grant_type: "refresh_token",
          refresh_token: body.refresh_token,
        });
        if (!tokens) {
          return sendError(response, 502, "Google token refresh failed");
        }
        return sendJson(response, 200, {
          access_token: tokens.access_token,
          expires_in: tokens.expires_in,
          scope: tokens.scope,
          token_type: tokens.token_type,
        });
      }

      sendError(response, 404, "Not found");
    } catch (error) {
      if (response.headersSent) {
        response.destroy();
        return;
      }
      const status = Number.isInteger(error?.status) ? error.status : 500;
      if (status >= 500) console.error("OAuth request failed");
      sendError(response, status, status >= 500 ? "OAuth request failed" : error.message);
    }
  });

  return server;
};

if (import.meta.url === `file://${process.argv[1]}`) {
  const server = createAuthServer();
  const port = Number.parseInt(process.env.PORT ?? "3080", 10);
  const host = process.env.HOST ?? "127.0.0.1";
  server.listen(port, host, () => {
    console.log(`Google OAuth service listening on ${host}:${port}`);
  });
}

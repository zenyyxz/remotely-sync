import assert from "node:assert/strict";
import { createHash, randomBytes } from "node:crypto";
import { once } from "node:events";
import test from "node:test";
import { createAuthServer } from "./server.mjs";

const clientId = "test-client-id";
const clientSecret = "test-client-secret";
const baseUrl = "https://auth.example.test:8443";

const startServer = async (fetchImpl) => {
  const server = createAuthServer({
    clientId,
    clientSecret,
    publicBaseUrl: baseUrl,
    fetchImpl,
  });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const address = server.address();
  return {
    server,
    url: `http://127.0.0.1:${address.port}`,
  };
};

const createPkce = () => {
  const verifier = randomBytes(32).toString("base64url");
  const state = randomBytes(32).toString("base64url");
  const challenge = createHash("sha256").update(verifier).digest("base64url");
  return { verifier, state, challenge };
};

test("authorization uses PKCE and exchanges its relay code only once", async () => {
  let tokenRequest;
  const { server, url } = await startServer(async (requestUrl, options) => {
    tokenRequest = { requestUrl, options };
    return Response.json({
      access_token: "access-token",
      expires_in: 3600,
      refresh_token: "refresh-token",
      scope: "drive.file",
      token_type: "Bearer",
    });
  });
  try {
    const { verifier, state, challenge } = createPkce();
    const startResponse = await fetch(
      `${url}/google/start?${new URLSearchParams({ state, code_challenge: challenge })}`,
      { redirect: "manual" }
    );
    assert.equal(startResponse.status, 302);
    const authorizeUrl = new URL(startResponse.headers.get("location"));
    assert.equal(authorizeUrl.searchParams.get("code_challenge"), challenge);
    assert.equal(authorizeUrl.searchParams.get("code_challenge_method"), "S256");
    assert.equal(authorizeUrl.searchParams.get("redirect_uri"), `${baseUrl}/google/callback`);

    const callback = await fetch(
      `${url}/google/callback?${new URLSearchParams({ code: "google-code", state })}`
    );
    const callbackHtml = await callback.text();
    const relayCode = decodeURIComponent(callbackHtml.match(/href="([^"]+)"/)[1])
      .split("code=")[1]
      .split("&")[0];

    const exchangeResponse = await fetch(`${url}/google/exchange`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: relayCode,
        state,
        code_verifier: `${verifier}wrong`,
      }),
    });
    assert.equal(exchangeResponse.status, 400);

    const validExchangeResponse = await fetch(`${url}/google/exchange`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: relayCode, state, code_verifier: verifier }),
    });
    assert.equal(validExchangeResponse.status, 200);
    assert.equal((await validExchangeResponse.json()).refresh_token, "refresh-token");
    assert.equal(tokenRequest.requestUrl, "https://oauth2.googleapis.com/token");
    const form = new URLSearchParams(tokenRequest.options.body);
    assert.equal(form.get("code_verifier"), verifier);
    assert.equal(form.get("client_secret"), clientSecret);

    const replayResponse = await fetch(`${url}/google/exchange`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: relayCode, state, code_verifier: verifier }),
    });
    assert.equal(replayResponse.status, 400);
  } finally {
    server.close();
  }
});

test("refresh sends Google credentials only from the service", async () => {
  let tokenRequest;
  const { server, url } = await startServer(async (requestUrl, options) => {
    tokenRequest = { requestUrl, options };
    return Response.json({
      access_token: "new-access-token",
      expires_in: 3600,
      token_type: "Bearer",
    });
  });
  try {
    const response = await fetch(`${url}/google/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: "stored-refresh-token" }),
    });
    assert.equal(response.status, 200);
    assert.equal((await response.json()).access_token, "new-access-token");
    const form = new URLSearchParams(tokenRequest.options.body);
    assert.equal(form.get("client_id"), clientId);
    assert.equal(form.get("client_secret"), clientSecret);
    assert.equal(form.get("refresh_token"), "stored-refresh-token");
  } finally {
    server.close();
  }
});

test("health reports configuration without exposing credentials", async () => {
  const { server, url } = await startServer(async () => {
    throw new Error("Unexpected network request");
  });
  try {
    const response = await fetch(`${url}/healthz`);
    const result = await response.json();
    assert.equal(result.ok, true);
    assert.equal(result.oauthConfigured, true);
    assert.equal(JSON.stringify(result).includes(clientSecret), false);
  } finally {
    server.close();
  }
});

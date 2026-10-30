# Google OAuth service

This small Node.js service completes Google Drive OAuth for Remotely Sync. It
holds the Google OAuth client secret on the VM, while Google refresh tokens stay
in the user's Obsidian plugin settings. It uses only Node.js built-in modules.

## Google Cloud setup

1. Enable the Google Drive API and configure the OAuth consent screen.
2. Create a **Web application** OAuth client.
3. Add this exact authorized redirect URI:
   `https://auth.lahirux.dev:8443/google/callback`
4. If the consent screen is in testing mode, add each Google account that will
   test the plugin as a test user.
5. Keep the client secret on the server. Do not add it to the plugin, repository,
   CI secrets, or a chat message.

## VM setup

Create a DNS-only A record `auth.lahirux.dev` pointing to the VM's public IP.
Allow inbound TCP 80 for certificate issuance and TCP 8443 for HTTPS in both
the Oracle network rules and UFW. Port 443 is intentionally not used by this
service.

Install the files under `/opt/remotely-sync-google-auth`, create a
`remotely-sync-auth` system account, and install
`deploy/remotely-sync-google-auth.service` into `/etc/systemd/system/`.
Create `/etc/remotely-sync-google-auth.env` as a root-owned mode-600 file:

```ini
HOST=127.0.0.1
PORT=3080
PUBLIC_BASE_URL=https://auth.lahirux.dev:8443
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
```

Run a separate Nginx instance for the auth service so it does not change the
VM's other Nginx configuration. Install `deploy/nginx-auth-http.conf` as
`/etc/nginx-remotely-sync-auth/nginx.conf` and
`deploy/nginx-remotely-sync-auth.service` as
`/etc/systemd/system/remotely-sync-auth-nginx.service`. Start that service,
then issue a certificate with Certbot using the webroot `/var/www/html` for
`auth.lahirux.dev`. Replace the temporary HTTP config with
`deploy/nginx-auth.lahirux.dev.conf`, validate with
`nginx -t -c /etc/nginx-remotely-sync-auth/nginx.conf`, then reload the
dedicated service. Enable it at boot. The port-80 server redirects to HTTPS on
8443 after certificate issuance.

Install the files from `public/` into `/var/www/remotely-sync-auth/` so the
homepage is available at `https://auth.lahirux.dev:8443/` and the privacy
policy at `https://auth.lahirux.dev:8443/privacy`. The homepage links to the
policy and describes the plugin; keep both pages public and up to date.

The Nginx site disables access logs and limits error logs so OAuth codes in
callback query strings are not written to ordinary request logs. The service
never logs request parameters or token values.

## Local checks

Run `node --test auth-service/server.test.mjs` from the plugin root. The tests
mock Google's token endpoint and do not require credentials or network access.

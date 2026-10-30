# Limitations From The Browser Environment: CORS Issue

The plugin is developed for the browser environment. The "fake" browser behind the scenes also follows the CORS policy.

[MDN has a doc about CORS.](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

1. Obsidian desktop 0.13.25 and later, and mobile 1.1.1 and later, provide [`requestUrl`](https://forum.obsidian.md/t/obsidian-release-v0-13-25-insider-build/32701), which lets the plugin make requests without browser CORS restrictions.

2. On older Obsidian versions, configure the server to return an `Access-Control-Allow-Origin` header permitting the relevant origin: `app://obsidian.md`, `capacitor://localhost`, or `http://localhost`.

   Example configurations:

   - [Amazon S3](./remote_services/s3_general/s3_cors_configure.md)
   - [Apache](./remote_services/webdav_general/webdav_apache_cors.md) (adapted from an [upstream community contribution](https://github.com/remotely-save/remotely-save/pull/31))

# Webdis

## What this setup does

[Webdis](https://github.com/nicolasff/webdis) exposes an HTTP API for [Redis®](https://redis.io/), which uses TCP connections that browser JavaScript cannot establish directly. This lets Remotely Sync experiment with Redis® as file storage: roughly, paths are keys and content is values. The approach should also work with Redis® alternatives such as Valkey, Redict, KeyDB, Dragonfly, and Garnet.

This app is **not an official Redis® Ltd, Redis® OSS, or Webdis product**. Redis is a registered trademark of Redis Ltd.

**Never expose Redis® or Webdis publicly without security protection. You are responsible for protecting your server.**

## Prerequisites and server security

1. Install Redis® and Webdis.
2. In `webdis.json`, configure ACLs for a username and password and/or IP filters. **Do not expose Redis® or Webdis publicly without security protection.**
3. Configure a reverse proxy, firewall, and HTTPS as appropriate. HTTPS must be configured correctly to connect from iOS.

## Connect and validate

In Remotely Sync settings, enter the server address, username, password, and an appropriate **base dir**, then check the connection. Sync after connectivity is confirmed.

Several keys and values will be generated in the Redis® database:

```
rs:fs:v1:${encodeURIComponent(vaultName+'/'+folderStructure+'/'+fileName)}:meta # you can HGETALL it
rs:fs:v1:${encodeURIComponent(vaultName+'/'+folderStructure+'/'+fileName)}:content # you can GET it
```

## Operational note

The key layout above describes the generated Redis® entries. Keep Redis® and Webdis protected; the server operator is responsible for their security.

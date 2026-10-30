# Nginx WebDAV with Docker

## Example setup

This Linux tutorial uses Docker image [docker-nginx-webdav-nononsense](https://github.com/dgraziotin/docker-nginx-webdav-nononsense), which contains `ngx_http_dav_module` and `nginx-dav-ext-module`. The description is adapted from the Remotely Sync author's pull request [`dgraziotin/docker-nginx-webdav-nononsense#123`](https://github.com/dgraziotin/docker-nginx-webdav-nononsense/pull/123).

The example stores data in host folder `./dav1`, uses `user1` / `password1`, listens on `127.0.0.1:8080`, and supports **Basic authentication only**.

## Start the server

Install Docker and configure its permissions, then run:

```bash
mkdir ./dav1 # create the local folder

docker container run --rm \
  -p 127.0.0.1:8080:80 \
  -v ./dav1:/data \
  -e WEBDAV_USERNAME=user1 \
  -e WEBDAV_PASSWORD=password1 \
  -e PUID=1000 \
  -e PGID=1000 \
  dgraziotin/nginx-webdav-nononsense
```

There is no `--detach` parameter, so the server stops when you terminate the program or close the terminal. Adjust the setup further if needed.

## Connect and inspect stored files

In Remotely Sync settings, use:

```
Server: http://127.0.0.1:8080
User: user1
Password: password1
Auth Type: Basic
Depth Header Sent To Servers: only supports depth='1'
```

![Nginx RS Setting](./nginx_rs_setting.png)

After connecting, synced files and folders should appear in `./dav1`.

## Security and device notes

**Never expose the WebDAV server to public networks without protections or strong passwords.** The guide recommends using Tailscale to create a LAN rather than exposing the service publicly. HTTPS is required to connect from iOS (iPhone/iPad); Caddy is recommended as a reverse proxy and can also be combined with Tailscale.

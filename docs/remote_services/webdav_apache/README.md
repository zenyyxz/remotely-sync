# Apache WebDAV with Docker

## Example environment

This guide uses Apache via the Linux Docker image [`bytemark/webdav`](https://hub.docker.com/r/bytemark/webdav/). A related [Bytemark guide](https://docs.bytemark.co.uk/article/run-your-own-webdav-server-with-docker/) is also available; this example differs slightly.

The target setup stores data in host folder `./dav1`, uses user `user1` and password `password1`, listens on `127.0.0.1:8080`, and uses Basic authentication.

## Start the server

Install Docker and configure its permissions, then run:

```bash
mkdir ./dav1 # create the local folder

docker container run --rm \
  -p 127.0.0.1:8080:80 \
  -v ./dav1:/var/lib/dav \
  -e USERNAME=user1 \
  -e ****** \
  -e AUTH_TYPE=Basic \
  bytemark/webdav
```

There is no `--detach` parameter, so the server stops when you terminate the program or close the terminal. Adjust the setup further if needed.

## Configure the WebDAV connection

In Remotely Sync settings, use:

```
Server: http://127.0.0.1:8080
User: user1
Password: password1
Auth Type: Basic
Depth Header Sent To Servers: only supports depth='1'
```

![Apache RS Setting](./apache_rs_settings.png)

The server should then connect. Synced files and folders appear under `./dav1`; the example layout is:

```
ls ./dav1/
## data  DavLock  DavLock.dir  DavLock.pag

ls ./dav1/data/
## <your vault name or your base dir>
```

## Authentication and safety

The Docker setup can use either `Basic` or `Digest` authentication; configure the same type in Remotely Sync. **Never expose the WebDAV server to public networks without protections or strong passwords.** The guide recommends using Tailscale to create a LAN rather than exposing the service publicly. For iOS (iPhone/iPad), HTTPS is required; Caddy is suggested as a reverse proxy and can also be combined with Tailscale.

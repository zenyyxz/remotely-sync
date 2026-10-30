# Nextcloud WebDAV

## Choose a Nextcloud service

Use an installed instance or a hosted provider. Nextcloud's website is <https://nextcloud.com/>.

For an internal network, the guide recommends the [Docker version](https://github.com/nextcloud/docker) with [Caddy as a reverse proxy](https://caddyserver.com/docs/quick-starts/reverse-proxy) for HTTPS. If self-hosting is difficult, choose a provider listed on the [Nextcloud sign-up page](https://nextcloud.com/sign-up/). For example, [The Good Cloud](https://thegood.cloud/) provides 2 GB of free storage. Remotely Sync has been tested with the Docker version and The Good Cloud.

## Find the WebDAV URL and connect

In Nextcloud settings, find the WebDAV URL. It has a form like:

```
https://cloud.example.com/remote.php/dav/files/USERNAME
```

Enter this URL **without a trailing slash**, along with your Nextcloud account and password, in Remotely Sync.

## Verify

Confirm the connection in Remotely Sync settings before syncing.

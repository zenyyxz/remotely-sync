# pCloud

## Service notes

pCloud's website is <https://www.pcloud.com/>. This plugin is **not an official pCloud product**; it uses pCloud's public API. The plugin currently labels this provider **beta**, so **back up your vault before using it**.

Remotely Sync uses pCloud's native API rather than WebDAV, which allows the last modified time to be preserved. pCloud offers WebDAV only to Premium users; Premium users can still use pCloud WebDAV with Remotely Sync.

## Authorize and connect

1. In Remotely Sync settings, select **pCloud**.
2. Click **Auth** and open the link to start on pCloud's website.
3. Follow pCloud's instructions and allow Remotely Sync to connect.
4. Return to the plugin and check the connection notice.
5. Sync. The plugin creates a vault folder at the root of pCloud and uploads notes there.

## Validation and limitations

If authorization does not complete, follow the pCloud instructions and confirm the plugin reports a connection before syncing. pCloud's API seems not to allow uploading empty files; in plugin settings, choose whether to skip them or raise errors. Keep a vault backup while using this beta feature.

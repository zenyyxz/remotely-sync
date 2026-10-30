# Koofr

## Service notes

Koofr's website is <https://koofr.eu/>. This plugin is **not an official Koofr product**; it uses Koofr's public API. The plugin currently labels this provider **beta**, so **back up your vault before using it**.

Remotely Sync uses Koofr's native API rather than its WebDAV interface. This allows the last modified time to be preserved.

## Connect through Koofr authorization

1. In Remotely Sync settings, select **Koofr**.
2. Click **Auth** and open the link to start on Koofr's website.
3. Follow Koofr's instructions and allow Remotely Sync to connect.
4. Return to the plugin. A notice reports whether authorization succeeded.
5. Sync. The plugin creates a vault folder at the root of Koofr and uploads notes there.

## Check before syncing

Confirm the plugin displays a successful connection notice before starting sync. Keep a backup of your vault, as this feature is beta.

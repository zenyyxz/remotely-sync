# OneDrive (Full)

## Choose this option carefully

This plugin is **not an official Microsoft or OneDrive product**; it uses OneDrive's public API. This option is for OneDrive for personal only; the development team does not have a OneDrive for Business account to develop and test with.

The App Folder option limits access to the app's own folder. OneDrive (Full) can instead sync to a folder at the root of OneDrive. This option is marked beta in the plugin:

- **Back up your vault before using this feature.**
- **Back up everything in your OneDrive besides the sync subfolder.**

## Authorize and connect

1. In Remotely Sync settings, select **OneDrive (Full)**.
2. Click **Auth** and open the link to start on OneDrive's website.
3. Follow OneDrive's instructions and allow Remotely Sync to connect.
4. Return to the plugin. A notice reports whether authorization succeeded.
5. Sync. The plugin creates a vault folder in the root of OneDrive and uploads notes there.

## Validate and limitations

Check for the connection notice before syncing. OneDrive's API does not allow uploading empty files; in Remotely Sync settings, choose whether to skip them or raise errors.

For the app-folder destination, use the [OneDrive (App Folder) guide](../onedrive/README.md) instead.

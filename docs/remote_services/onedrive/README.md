# OneDrive (App Folder)

## Scope, access, and preparation

This plugin is **not an official Microsoft or OneDrive product**; it uses Microsoft's [OneDrive public API](https://docs.microsoft.com/en-us/onedrive/developer/rest-api). After authorization, it can read your name and email and read and write files in your OneDrive.

This option uses the app folder. To connect to the root folder instead, select OneDrive (Full) and follow the [OneDrive (Full) guide](../onedrivefull/README.md).

Password-based end-to-end encryption is supported, but **the vault name itself is not encrypted**. If syncing one vault across multiple devices with default settings, use the same vault name on each device.

## Connect

In the plugin's settings, choose **OneDrive** and follow the authorization instructions. Complete the flow and confirm the connection notice before syncing.

## Troubleshooting and limitations

### OneDrive for Business

This plugin works only with OneDrive for personal, not OneDrive for Business. See [upstream issue #11](https://github.com/fyears/remotely-save/issues/11) for background.

### The `/Apps/remotely-sync` folder is missing

Some users report that OneDrive creates `/Application/Graph` instead of `/Apps/remotely-sync`. The reported workaround is:

1. Back up your vault manually.
2. On the [OneDrive website](https://onedrive.live.com/), rename `/Application/Graph` to `/Application/remotely-sync` (right-click the folder to find the rename option).
3. Return to Obsidian and try to sync.

### Empty files

OneDrive's API does not allow uploading empty files. In Remotely Sync settings, choose whether to skip them or raise errors.

### Syncing to the root folder

Choose **OneDrive (Full)** in plugin settings instead of the app-folder option. See the [OneDrive (Full) guide](../onedrivefull/README.md).

# Google Drive (GDrive)

## Important scope and service notes

This plugin is **not an official Google product**; it uses Google Drive's public API. The plugin currently labels this provider **beta**, so **back up your vault before using it**.

The plugin requests Google's `drive.file` scope. It can only see, read, and write files and folders it created itself. Do not manually create the vault folder or upload files to it through Google's website: the plugin will not see those items. You can still view or download files at the [Google Drive website](https://drive.google.com/drive/u/0/my-drive). Google describes the benefits of the `drive.file` scope in its [API documentation](https://developers.google.com/drive/api/guides/api-specific-auth#benefits); the guide notes that this scope is “not-sensitive” and does not require the same complicated verification process.

Google Drive permits files with the same name in one folder. Duplicate files may stop the plugin from working; if that happens, remove the duplicate manually on Google's website.

## Authorize the plugin

Authorization uses a website because Google Drive's API does not fit the special environment of an Obsidian plugin.

1. In Remotely Sync settings, select Google Drive.
   ![change remote to google drive](./change_remote_to_google_drive.png)
2. Click **Auth** and open the link to begin on the Remotely Sync website.
   ![visit start link](./google_drive_auth_link.png)
3. On that website, follow the link to Google's authorization page.
4. Follow Google's instructions and allow Remotely Sync to connect.
   ![allow Remotely Sync in Google website](./google_drive_auth_allow.png)
5. After redirection to the Remotely Sync website, copy the authorization code.
   ![redirected back and get the code](./google_drive_auth_code_show.png)
6. Paste the code into the plugin in Obsidian and submit it.
   ![submit the code in setting](./google_drive_code_submit.png)
7. Check the notice in the plugin to confirm whether the connection succeeded.
8. Sync. The plugin creates a vault folder at the root of your Google Drive and uploads notes into it.

## Credential handling

The website does **not** store or save the Google Drive credential—the code obtained at the end of authorization. It is only a bridge to help obtain that code. The code is saved locally in Obsidian and works like a special password, allowing the plugin to upload, download, and modify files for you.

## Troubleshooting and limitations

If authorization does not finish, follow the return-to-plugin flow and submit the code shown by the website. If files do not appear in the plugin, remember it only sees files and folders it created; manually uploaded items are outside its `drive.file` scope.

For duplicate names, inspect Google Drive's website and remove the duplicate file manually if needed. Keep a vault backup while using this beta feature.

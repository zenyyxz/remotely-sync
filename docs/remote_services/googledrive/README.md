# Google Drive

Remotely Sync connects directly to Google's public Drive API. Google Drive is
currently marked **beta**; back up your vault before using it.

## Access and limitations

The plugin requests Google's `drive.file` scope. It can read and modify files
that it creates, but does not see files uploaded manually through the Drive
website. Google explains this scope in its
[Drive API documentation](https://developers.google.com/drive/api/guides/api-specific-auth#benefits).

Google Drive allows duplicate names in a folder. Duplicates may prevent sync;
remove them through the [Google Drive website](https://drive.google.com/).

## Connect your Google account

1. In Remotely Sync settings, choose Google Drive and click **Auth**.
2. Open the authorization link in your browser and sign in to Google.
3. Review and allow the requested Drive access.
4. On the completion page, click **Open Remotely Sync** to return to Obsidian.
5. Confirm the success notice, then sync. The plugin creates a vault folder in
   the root of your Drive.

Authorization uses the Remotely Sync OAuth service at
`auth.lahirux.dev:8443` to
complete Google's OAuth exchange. The service temporarily holds authorization
state and one-time codes in memory; it does not persist Google tokens. The
Google client secret remains on the service and is not included in the plugin
or its build.

Your refresh token is saved in your local Obsidian plugin settings. The service
uses it to obtain short-lived access tokens when needed; refresh tokens are not
stored by the service.

## Troubleshooting

- If the browser does not open Obsidian automatically, click **Open Remotely
  Sync** on the completion page.
- If Google says the app is in testing, the account must be listed as a test
  user in the OAuth consent configuration.
- If manually uploaded files do not appear, this is expected with the `drive.file`
  scope.
- If sync reports duplicate names, remove the duplicates in Google Drive.

Keep a vault backup while using this beta feature.

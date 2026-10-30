# Open Media Vault WebDAV

## Prepare Open Media Vault

The Open Media Vault website is <https://www.openmediavault.org>. In its UI, complete the setup in this order:

1. Install the WebDAV plugin: **System → Plugins → openmediavault-webdav**.
2. Create a shared folder: **Storage → Shared Folders → Create**.
3. Enable the WebDAV server and select that shared folder: **Services → WedDAV → Enable → Select previously created Shared Folder**.
4. Confirm the group is `webdav-users`, then add your username to it under **Users → Groups → webdav-users → Edit → Members**.
5. Set the shared folder permissions under **Storage → Shared Folders → [folder] → Permissions**. Give both your username and `webdav-users` **Read/Write** permissions.
6. On the shared folder's **Access Control List** page, set your username, `webdav-users`, and `www-data` to **Read/Write**.

## Connect from Obsidian

Install Remotely Sync in Obsidian, select WebDAV, and enter:

```
http://[your-server-ip]/webdav
```

Use the configured user credentials and connect. Confirm the connection in settings before syncing.

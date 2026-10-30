# NoteHarbor Sync

NoteHarbor Sync synchronizes a vault between devices through cloud storage. It is an independent community plugin and is not Obsidian's official [Sync service](https://obsidian.md/sync).

[简体中文](./README.zh-cn.md) · [GitHub repository](https://github.com/zenyyxz/remotely-sync)

## Before you sync

**Back up your vault before the first sync.** Syncing can create, update, and remove files according to the local and remote state. Review the selected remote location and settings before starting.

All NoteHarbor Sync features are free to use; no NoteHarbor Sync account or subscription is required. You must still authorize your chosen storage provider, and that provider may charge for storage, requests, or data transfer.

## Pick a storage provider

NoteHarbor Sync supports:

- **S3 and compatible storage:** Amazon S3, Cloudflare R2, Backblaze B2, MinIO, Storj, Tencent Cloud COS, and others. See the [service overview](./docs/services_connectable_or_not.md) and [S3 policy guide](./docs/remote_services/s3_general/s3_user_policy.md).
- **Cloud file providers:** Dropbox, personal OneDrive (App Folder or full access), Google Drive, Box, pCloud, Yandex Disk, and Koofr.
- **Self-hosted or hosted endpoints:** WebDAV, Webdis, and Azure Blob Storage.

Browse the [provider setup guides](./docs/remote_services/).

## Set up the first sync

1. Install **NoteHarbor Sync** from Obsidian's Community plugins, or get the files from the [GitHub releases](https://github.com/zenyyxz/remotely-sync/releases).
2. Open the plugin settings, choose a provider, and enter its endpoint, bucket/container, or other required connection details.
3. Authorize the provider or test the connection using the controls shown in settings. Credentials are stored in Obsidian's plugin data; do not share `data.json`.
4. Review the remote directory and sync options. Hidden paths may be skipped by default, and the `.obsidian` configuration folder has a separate option.
5. Confirm that your backup and remote target are correct, then start syncing. The initial sync may take a while.

The default remote directory usually uses the vault name. To share the same remote data across devices, use the same provider, remote directory, and encryption settings on each device.

## Protect data and resolve conflicts

- Optional [end-to-end encryption](./docs/encryption/README.md) is available. Keep the encryption password safe; losing it may prevent you from decrypting remote files. The vault name itself is not encrypted.
- Conflict detection and resolution are available. [Smart Conflict](./docs/features/README.md) can merge smaller Markdown files; review its behavior and back up your vault before using it.
- Sync protection rules can limit changes; options are also available to skip large files or paths and configure hidden-file handling. See the [sync algorithm guide](./docs/sync_algorithm/v3/intro.md).
- `data.json` can contain sensitive connection settings. Do not publish it, send it to others, or commit it to version control.
- Obsidian mobile may have performance limitations with large files (around 50 MB and above); consider enabling the skip-large-files option.

## Use it day to day

Start a sync with the ribbon button or a command from the Command palette. You can also enable periodic or on-save syncing in settings. Automatic syncing only runs while Obsidian is open.

If a sync result is unexpected, pause automatic syncing and preserve both local and remote copies before troubleshooting. Start with the [debugging guide](./docs/how_to_debug/README.md); see the [performance guide](./docs/check_performance/README.md) for slow syncs.

## Further reading

- [Dropbox authorization walkthrough](./docs/dropbox_review_material/README.md)
- [S3-compatible storage example](./docs/remote_services/s3_cloudflare_r2/README.md)
- [WebDAV example](./docs/remote_services/webdav_nextcloud/README.md)
- [OneDrive full-access guide](./docs/remote_services/onedrivefull/README.md)
- [Service compatibility overview](./docs/services_connectable_or_not.md)

## Project and support

NoteHarbor Sync is an independent project based on the open-source Remotely Save codebase. Report issues or suggestions in the [GitHub repository](https://github.com/zenyyxz/remotely-sync). Cloud providers may charge fees and impose usage limits; check their terms before syncing.

See the [Privacy Policy](./PRIVACY_POLICY.md) for information about data handled by the plugin and Google Drive authorization service.

## License

The project source code is licensed under the [Apache License 2.0](./LICENSE).
The logo artwork in `assets/branding/` is separately licensed under
[CC BY-SA 4.0](./assets/branding/LICENSE.txt). Third-party dependencies and
other included assets remain under their respective licenses.

# Sync algorithm documentation

These documents describe successive versions of Remotely Sync's sync
algorithm. Use the version-specific notes to understand the assumptions and
decision rules for that design.

## Algorithm versions

- [Version 1](./v1/README.md) compares local files, remote files, and
  Obsidian-tracked local delete-or-rename history.
- [Version 2](./v2/README.md) adds remote deletion history and explains file
  and folder reconciliation.
- [Version 3](./v3/README.md) links to the user-facing introduction and the
  design document.

For the separate behavior governing oversized files, see
[Sync ignoring large files](./sync_ignoring_large_files.md).

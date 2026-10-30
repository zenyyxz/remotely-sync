# Sync algorithm: version 1

Version 1 bases each decision on three record sources. The rules below assume
that these sources are reliable.

## Inputs and limits

1. **Local files:** Obsidian provides an API that lists vault files.
2. **Remote files:** Some storage services return a listing through an API;
   others require Remotely Sync to scan directories recursively.
3. **Local delete-or-rename history:** Obsidian's tracking API records local
   deletions and renames. Changes made to files or folders outside Obsidian
   are not recorded by this source.

## Decision table

The cases below describe the combinations of remote state, local state, and
local history used by this version.

| ID | Remote file | Local file | Local delete/rename history | Additional condition | Decision |
| --- | --- | --- | --- | --- | --- |
| 1 | exists | exists | ignored | `mtime_remote > mtime_local` | Download the remote file, create the local folder if needed, and clear local history if present. |
| 2 | exists | exists | ignored | `mtime_remote < mtime_local` | Upload the local file, create the remote folder if needed, and clear local history if present. |
| 3 | exists | exists | ignored | Timestamps equal, no password, and sizes equal | Clear local history if present; the file was synced and has not changed since. |
| 4 | exists | exists | ignored | Timestamps equal, no password, and sizes differ | Upload the local file and clear local history if present; local is preferred to remote. |
| 5 | exists | exists | ignored | Timestamps equal and a password is set | Clear local history if present; in encryption mode sizes may differ, so decisions rely on timestamps. |
| 6 | exists | exists | ignored | Local entry is a folder, so `mtime_local` is undefined | Clear local history if present. The original design leaves unresolved the case where a folder and a previous file share a name. |
| 7 | exists | absent | exists | `mtime_remote >= delete_time_local` | Download the remote file and create the folder if needed. |
| 8 | exists | absent | exists | `mtime_remote < delete_time_local` | Delete the remote file and clear local history. |
| 9 | exists | absent | absent | — | Download the remote file and create the folder if needed. |
| 10 | absent | exists | ignored | Local entry may be a folder or file | Upload local files recursively, create the remote folder if needed, and clear local history if present. |
| 11 | absent | absent | ignored | — | Clear local history if present. |

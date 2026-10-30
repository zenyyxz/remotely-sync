# Sync algorithm: version 2

Version 2 adds remote deletion history to the inputs used by version 1. Its
file reconciliation table orders the four relevant timestamps and records the
action for each file and history source.

## Records used

1. **Local files:** listed through Obsidian's vault API.
2. **Remote files:** listed through the storage service API where available;
   otherwise scanned recursively.
3. **Local delete-or-rename history:** recorded through Obsidian's tracking
   API. Changes made outside Obsidian are not captured by this history.
4. **Remote delete history:** uploaded by Remotely Sync during each sync.

The decision table assumes all four record sources are reliable. The columns
`mtime_remote`, `mtime_local`, `deltime_remote`, and `deltime_local` are the
four timestamps being compared; the action follows the greatest timestamp and
its corresponding operation. Each row gives the operation for the local
file, remote file, and both deletion histories. The last column preserves the
source's branch-number cross-references; its original label does not explain
the comparison further.

## File reconciliation

| t1 | t2 | t3 | t4 | Local file action | Remote file action | Local deletion history | Remote deletion history | Original branch reference |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| mtime_remote | mtime_local | deltime_remote | deltime_local | del_if_exists | del_if_exists | clean | upload_local_del_history | |
| mtime_local | mtime_remote | deltime_remote | deltime_local | del_if_exists | del_if_exists | clean | upload_local_del_history | |
| mtime_remote | deltime_remote | mtime_local | deltime_local | del_if_exists | del_if_exists | clean | upload_local_del_history | |
| deltime_remote | mtime_remote | mtime_local | deltime_local | del_if_exists | del_if_exists | clean | upload_local_del_history | |
| mtime_local | deltime_remote | mtime_remote | deltime_local | del_if_exists | del_if_exists | clean | upload_local_del_history | |
| deltime_remote | mtime_local | mtime_remote | deltime_local | del_if_exists | del_if_exists | clean | upload_local_del_history | 8 |
| mtime_remote | mtime_local | deltime_local | deltime_remote | del_if_exists | del_if_exists | clean | keep | |
| mtime_local | mtime_remote | deltime_local | deltime_remote | del_if_exists | del_if_exists | clean | keep | |
| mtime_remote | deltime_local | mtime_local | deltime_remote | del_if_exists | del_if_exists | clean | keep | |
| deltime_local | mtime_remote | mtime_local | deltime_remote | del_if_exists | del_if_exists | clean | keep | |
| mtime_local | deltime_local | mtime_remote | deltime_remote | del_if_exists | del_if_exists | clean | keep | |
| deltime_local | mtime_local | mtime_remote | deltime_remote | del_if_exists | del_if_exists | clean | keep | |
| mtime_remote | deltime_remote | deltime_local | mtime_local | skip | upload_local | clean | clean | |
| deltime_remote | mtime_remote | deltime_local | mtime_local | skip | upload_local | clean | clean | 10 |
| mtime_remote | deltime_local | deltime_remote | mtime_local | skip | upload_local | clean | clean | |
| deltime_local | mtime_remote | deltime_remote | mtime_local | skip | upload_local | clean | clean | |
| deltime_remote | deltime_local | mtime_remote | mtime_local | skip | upload_local | clean | clean | 2; 3; 4; 5; 6 |
| deltime_local | deltime_remote | mtime_remote | mtime_local | skip | upload_local | clean | clean | |
| mtime_local | deltime_remote | deltime_local | mtime_remote | download_remote | skip | clean | clean | |
| deltime_remote | mtime_local | deltime_local | mtime_remote | download_remote | skip | clean | clean | 7; 9 |
| mtime_local | deltime_local | deltime_remote | mtime_remote | download_remote | skip | clean | clean | |
| deltime_local | mtime_local | deltime_remote | mtime_remote | download_remote | skip | clean | clean | |
| deltime_remote | deltime_local | mtime_local | mtime_remote | download_remote | skip | clean | clean | 1; 9 |
| deltime_local | deltime_remote | mtime_local | mtime_remote | download_remote | skip | clean | clean | |

## Folder reconciliation

Folder metadata is not used in this version; folder names determine whether
folders should exist.

1. Build the file plan first. If a planned file exists, its parent folders
   must exist as well. Create missing required folders recursively on the
   local or remote side.
2. A folder is deletable only when it appears in remote deletion history and
   it is empty or all its subfolders are deletable.

Examples of the deletion rule:

- If a folder is deleted on device 1 and synced, then recreated with the same
  name on device 2 and synced, the folder is deleted again on device 2.
- If a new file is added inside that recreated folder before the second sync,
  the folder is kept because it is not empty.
- If the same-name folder on device 2 is left untouched, it and its untouched
  subfiles are deleted there on the next sync.

# Troubleshooting and diagnostics

Most users should not need to inspect logs. If a sync behaves unexpectedly,
these guides describe progressively more detailed ways to gather diagnostic
information.

## Start with the sync plan

Export and inspect the planned file operations before digging into logs:
[Export sync plans](./export_sync_plans.md).

## Read console output

- **Desktop:** inspect the console directly by following
  [Check console output](./check_console_output.md).
- **Mobile (iOS and Android):** use Obsidian's `vConsole` plugin, as described
  in [Check output with vConsole](./check_vconsole_output.md).

## Export logs

For a more advanced diagnostic workflow that works on desktop and mobile—and
is especially useful on iOS—see
[Export logs with Logstravaganza](./use_logstravaganza.md).

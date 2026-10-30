# Measuring sync performance

Remotely Sync includes a profiler that records the time spent in sync steps.
Use it when investigating a slow sync; for general troubleshooting, see the
[debugging guide](../how_to_debug/README.md).

## Collect a profile

1. Open Remotely Sync settings and scroll to the bottom.
2. Turn on **Enable Profiler** and **Enable Profiler Printing**.
3. Run a sync.
4. Inspect the console output directly or through the `vConsole` plugin. The
   [console instructions](../how_to_debug/README.md) explain how to open it.
5. Optionally select **Export Profiler Results**. The plugin creates a report
   named like `_debug_remotely_sync/profiler_results_exported_on_xxxx.md`.

The console entries and exported report show the time spent in individual
steps.

![Profiler settings](./profiler_settings.png)

![Example exported profiler report](./profiler_exported.png)

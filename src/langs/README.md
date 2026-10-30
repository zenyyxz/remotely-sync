# Remotely Sync translations

Language resources live in JSON files in this directory. The English
translation (`en.json`) is the template for adding another supported locale.

## Add a translation

1. Copy `en.json` to a new file named `<lang>.json`, using a locale supported
   by Obsidian.
2. Translate the values in the new JSON file.
3. Import the file and add it to the exported `LANGS` object in `index.ts`.

## Translation contributions

Translations were previously maintained as a separate submodule. That
workflow was harder to manage for pull requests, so the submodule was merged
back into the main repository on 2024-01-06. Further translation improvements
and pull requests belong in the main repository.

# Dropbox API use and setup walkthrough

This document describes Remotely Sync's Dropbox integration and provides a
demonstration of its basic workflow. The material was also prepared to explain
the application when requesting production use of the Dropbox API.

## Project context

Obsidian stores notes as Markdown files. Remotely Sync is an unofficial
Obsidian plugin that synchronizes those notes between a vault and Dropbox. It
is implemented with web technologies and is an independent project based on
the open-source Remotely Save codebase.

## Dropbox API access

Remotely Sync uses Dropbox's **App folder** access type to limit access to the
application's designated folder rather than users' other Dropbox files. The
requested API scopes support these operations:

| Scope | Purpose |
| --- | --- |
| `account_info.read` | Read and display the account username so users can identify the account authorized through OAuth. |
| `files.content.read` | Read file content and modification times. During sync, Remotely Sync compares local and remote modification times and may download a newer remote file. |
| `files.content.write` | Upload or overwrite file content. During sync, Remotely Sync compares modification times and may upload a newer local file. |

## Demonstrate the integration

The walkthrough uses Obsidian for Windows or macOS and the Remotely Sync
community plugin. Screenshots are included for the steps that have them.

1. Download and install Obsidian from its [official website](https://obsidian.md/).
2. In Obsidian, choose **Create** under **Create new vault**. Name the vault
   `example-vault`, select a location, and create it.

   ![Create a vault](./attachments/step03.png)

3. If prompted to update, close the update notice.
4. Create a note from the left sidebar and enter some text.

   ![Create a note](./attachments/step05.png)

5. Open Obsidian settings using the gear icon at the lower left.

   ![Open settings](./attachments/step06.png)

6. Under **Community plugins**, turn off Safe mode and confirm. Then open the
   community-plugin browser.

   ![Open the community plugin browser](./attachments/step07.png)

7. Search for **Remotely Sync** and install it.

   ![Find Remotely Sync](./attachments/step08.png)

8. Return to **Community plugins** and enable Remotely Sync.

   ![Enable Remotely Sync](./attachments/step09.png)

9. Open Remotely Sync settings, choose **Dropbox** under **Choose service**,
   and select **Auth**.

   ![Choose Dropbox and authorize](./attachments/step10.png)

10. Follow the displayed authorization link and complete the OAuth steps on
    Dropbox. Dropbox redirects back to Obsidian when authorization completes.

    ![Complete Dropbox authorization](./attachments/step11.png)

11. After authorization, the **Auth** button is replaced by **Revoke Auth**.

    ![Authorized Dropbox connection](./attachments/step12.png)

12. Return to Obsidian's main view and select the sync icon in the left
    sidebar. Remotely Sync compares local and remote file metadata and decides
    which files to download or upload.

    ![Start a sync](./attachments/step13.png)

13. Create, edit, or remove notes, then sync again to see the corresponding
    changes reflected in Dropbox.

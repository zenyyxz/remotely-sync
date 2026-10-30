# Azure Blob Storage

## Before connecting

This plugin is **not an official Microsoft or Azure product**; it uses Azure Blob Storage's public API. The author is not an Azure expert, so treat this guide as a reference. Azure services are complex.

As far as the law allows, the software (Remotely Sync) is provided as-is, without warranty or condition. The licensor will not be liable for damages arising from these terms or from use or the nature of the software, under any kind of legal claim.

Prepare the container and its access before configuring Remotely Sync. These steps need to be repeated when the Container SAS URL expires.

## Prepare the Azure container

The setup uses Microsoft's free [Azure Storage Explorer](https://azure.microsoft.com/en-us/products/storage/storage-explorer). Connect it to your Blob Storage service or account; the same settings may also be available on Azure's website.

1. **Configure CORS.** Right-click **Blob containers**, select **Configure CORS**, and add this rule:

   ```
   Allowed Origins: *
   Allowed Methods: DELETE,GET,HEAD,MERGE,POST,PATCH,OPTIONS,PUT
   Allowed Headers: x-ms-*, content-type
   Exposed Headers: x-ms-*, content-type
   Max Age (in seconds): 5
   ```

   ![CORS screenshot](./azure_cors.png)

2. **Create a container** if you do not already have one. The example uses `example-container`.

   ![container screenshot](./azure_example_container.png)

3. **Create a stored access policy.** Right-click the container and choose **Manage Stored Access Policies**. Choose an ID, such as `example-container-0000001`, set an expiry date, and allow **Read, Add, Create, Write, Delete, List**. The default expiry is only one week; when it expires, update the expiry date. Save the policy.

   A policy makes it easier to revoke the SAS if necessary. See Microsoft's [stored access policy documentation](https://learn.microsoft.com/en-us/rest/api/storageservices/define-stored-access-policy).

   ![Manage Stored Access Policies screenshot](./azure_policy_1.png)
   ![Add Policy screenshot](./azure_policy_3.png)

4. **Generate a container SAS URL.** Right-click the container, choose **Get Shared Access Signature**, select the policy you made, and save the setting. The generated URL begins with `https://` or `http://`, for example:

   ```
   https://<account>.blob.core.windows.net/<container name>?sv=...&sig=...
   ```

   Keep this URL for the plugin setup. See Microsoft's [SAS overview](https://learn.microsoft.com/en-us/azure/storage/common/storage-sas-overview).

   ![Container SAS Url screenshot 1](./azure_sas_1.png)
   ![Container SAS Url screenshot 2](./azure_sas_2.png)

Azure's API has limitations in browser environments, which is why this setup needs CORS and SAS. If you suspect unexpected access, revoke the SAS by changing the policy name or expiry date, then generate a new SAS URL.

## Configure Remotely Sync

In Remotely Sync settings:

1. Select **Azure Blob Storage** as the sync service.
2. Enter the Container SAS URL and container name.
3. Set a prefix. By default the plugin uses `<your vault name>/`; a prefix is required, though it can be changed.
4. Check the connection. A notice reports whether the connection succeeded.
5. Sync. The plugin uploads vault files and “folders” under the prefix.

![RS setting screenshot](./azure_rs_setting.png)

## Validation and limitations

If connection fails, check that CORS, the policy permissions, the SAS URL, its expiry, container name, and prefix are set as described. If the SAS has expired, update the policy and generate another URL.

The plugin currently labels this provider **alpha**. **Back up your vault before using it.**

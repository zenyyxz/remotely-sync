# Backblaze B2

## Before you begin: pricing

Create an account at [Backblaze B2](https://www.backblaze.com/cloud-storage). Credit card information is not required, and B2 offers 10 GB of free storage. **Usage can still cost money if storage or API requests exceed a certain amount; pay particular attention to API request usage.**

## Create the bucket and key

1. Create a bucket. You can leave the default settings or enable encryption; this is separate from the encryption setting in Remotely Sync.

   ![](./s3_backblaze_b2-1-bucket.png)
   ![](./s3_backblaze_b2-2-create_bucket.png)

2. Copy the `Endpoint` (for example, `s3.us-east-005.backblazeb2.com`) and the `bucketname` shown near the bucket icon.

   ![](./s3_backblaze_b2-3-copy.png)

3. Open **Application Keys** and add a new key. Save the `keyID` and `applicationKey`.

   ![](./s3_backblaze_b2-4-app_keys.png)
   ![](./s3_backblaze_b2-5-add_new_app_keys.png)
   ![](./s3_backblaze_b2-6-app_keys_copy.png)

## Enter B2 details in Remotely Sync

In Obsidian's Remotely Sync settings:

- Choose **S3 or compatibile** under **Remote Service**.
- Copy the B2 `Endpoint` into the Remotely Sync `Endpoint` field.
- Take the region from the endpoint (for example, `us-east-005`) and enter it in the region field.
- Copy `keyID` into **Access Key ID**.
- Copy `applicationKey` into **Secret Access Key**.
- Copy `bucketname` into **Bucket Name**.

![](./s3_backblaze_b2-7-copy_paste.png)

Enable **Bypass CORS**, then use **Check Connectivity** to test the B2 bucket connection.

![](./s3_backblaze_b2-8-cors.png)
![](./s3_backblaze_b2-9-check_connectionpng.png)

## Sync

Once connectivity is confirmed, sync.

![](./s3_backblaze_b2-10-sync.png)

# MinIO

## What you need

Use a configured MinIO instance with an account, access key, secret key, region, and bucket. MinIO's website is <https://min.io/>.

## Prepare the bucket and credentials

1. Configure your MinIO instance and obtain an account.
2. Create an Access Key; its creation also provides an automatically generated secret key.
   ![](./minio_access_key.png)
3. Check or set the region.
   ![](./minio_region.png)
4. Create a bucket.
   ![](./minio_create_bucket.png)

## Add the connection in Remotely Sync

In the settings, enter the address, bucket, access key, and secret key. MinIO instances often need **S3 URL style = Path Style**. Enable **Bypass CORS**, which is usually the desired setting.

![](./minio_rs_settings.png)

Enter the full address, including the scheme and port. For example:

```
http://192.168.31.198:9000
```

![](./minio_custom_port.png)

## Check and sync

Check connectivity in the settings, then sync.

![](./minio_sync_success.png)

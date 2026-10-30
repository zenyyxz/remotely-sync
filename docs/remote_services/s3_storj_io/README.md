# Storj

## Account and bucket requirements

Create an account at <https://www.storj.io/> and sign in, then create a bucket.

## Create S3 credentials

In **Access Management**, create S3 credentials and allow all permissions for the bucket. Save the access key, secret key, and endpoint. The endpoint is likely to be [`https://gateway.storjshare.io`](https://docs.storj.io/dcs/api/s3/s3-compatible-gateway).

![](./storj_create_s3_cred_1.png)
![](./storj_create_s3_cred_2.png)

## Connect from Remotely Sync

Enter the credentials in Remotely Sync settings. Set the region to [`global`](https://docs.storj.io/dcs/api/s3/s3-compatibility).

![](storj_remotely_sync_settings.png)

Check connectivity and sync.

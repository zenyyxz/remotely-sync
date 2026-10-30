# Tencent Cloud COS

English | [中文](./README.zh-cn.md)

## Select the console region

The [international console](https://console.tencentcloud.com/cos) is linked here. The steps below use the China-region console; the international version should be similar.

## Create a private bucket and obtain access credentials

1. Create a bucket with **private read-write permissions**. Server-side encryption is recommended.
2. Open the bucket overview to find the bucket name, region, and access address.
   ![](./cos_bucket_info.png)
3. In the CAM page, create an API key and note its SecretID and SecretKey.
   ![](./cos_create_secret.png)

## Determine the endpoint and configure the plugin

Remove the bucket name from the access address to obtain the endpoint. For example, if the console shows:

```
https://<bucket-name-with-number>.cos.<region>.myqcloud.com
```

use this endpoint:

```
https://cos.<region>.myqcloud.com
```

In Remotely Sync settings, enter the endpoint, SecretID, SecretKey, and bucket name.

![](./cos_setting.png)

## Verify and sync

Check connectivity, then sync.

![](./cos_connection.png)

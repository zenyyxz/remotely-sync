# Cloudflare R2

## Costs and prerequisites

Start at the [Cloudflare R2 page](https://www.cloudflare.com/developer-platform/r2/). **R2 may cost money.** Create a Cloudflare account and enable R2; Cloudflare may require credit card information, although it provides a generous free tier and zero egress fee.

## Create a bucket and access key

1. Create a bucket.
   ![](./s3_cloudflare_r2_create_bucket.png)
2. Create an Access Key with **Object Read & Write** permission, specifying the bucket you created. During creation, Cloudflare provides the secret key and endpoint address.
   ![](./s3_cloudflare_r2_create_api_token.png)

## Configure Remotely Sync

Enter the endpoint address, bucket, access key, and secret key in Remotely Sync settings. **Region `us-east-1` is sufficient.** Enable **Bypass CORS**, which is usually the desired setting, and click **Check Connectivity**.

![](./s3_cloudflare_r2_rs_settings.png)

If the information is correct but connectivity check fails, upgrade Remotely Sync to **version >= 0.3.29** and try again. Then sync.

## Connectivity-check limitation

Cloudflare does not allow `HeadBucket` for Access Keys with **Object Read & Write** permission. Consequently, connectivity checking may fail even when syncing works. Remotely Sync version >= 0.3.29 addresses this by using `ListObjects` instead of `HeadBucket`.

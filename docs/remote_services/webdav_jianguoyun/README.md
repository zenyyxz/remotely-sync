# JianGuoYun / NutStore WebDAV

## Service limitations

JianGuoYun/NutStore has API limits. The plugin may generate many queries; with many files it can reach those limits and stop working properly. This is not a bug, and there is no way to fix the API limit from the plugin. Consider this before connecting.

## Obtain WebDAV credentials

1. Register an account.
2. Open **Settings → Security**, select **Add Application**, and obtain the WebDAV account (email) and WebDAV password. The WebDAV password is a string different from the website password.

   ![](./webdav_jianguoyun.cn.png)

## Configure and check the connection

Enter the WebDAV address, account, and password in Remotely Sync settings. Set **Depth Header Sent To Servers** to **only supports depth='1'**.

![](./webdav_jianguoyun_rs_settting.cn.png)

Click **Check Connectivity** and sync once the connection is confirmed. API limits may still prevent normal operation when there are many files.

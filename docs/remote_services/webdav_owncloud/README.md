# ownCloud WebDAV

## Find the WebDAV endpoint

Create and sign in to an ownCloud account. The ownCloud website is <https://owncloud.com/>.

In Settings, enable **Show hidden files** and locate the WebDAV address.

![](./owncloud_address.png)

## Configure Remotely Sync

Enter the WebDAV address, account, and password in Remotely Sync settings. Set **Depth Header Sent To Servers** to **only supports depth='1'**.

![](./owncloud_rs_settings.png)

## Check and sync

Click **Check Connectivity**. When the connection is confirmed, sync.

![](./owncloud_files.png)

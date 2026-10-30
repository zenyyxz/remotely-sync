# AList WebDAV

## What to prepare

Use the AList [official website](https://alist.nn.ci/) and [WebDAV guide](https://alist.nn.ci/guide/webdav.html). Install and run AList, obtain an account and password, and sign in through its web page.

## Configure a mount and build its address

Add storage and note the mount path. The screenshots use `/alisttest davpath`.

![](./alist_mount_path.zh.png)
![](./alist_mount_path.en.png)

The WebDAV address is **http(s)://domain** + **port** + **`/dav`** + **mount path**. Replace spaces in the mount path with `%20`. For example:

```
http[s]://domain:port/dav/[mountpath url encoded]
http://127.0.0.1:5244/dav/alisttest%20davpath
```

## Connect and verify

Select WebDAV in Remotely Sync settings and enter the **full address, including the mount path**, with the account and password.

![](./alist_rs_settings.en.png)

Click **Check Connectivity**. When the connection is confirmed, sync.

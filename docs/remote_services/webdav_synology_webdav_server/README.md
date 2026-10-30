# Synology WebDAV Server

English | [中文](./README.zh-cn.md)

## Read before exposing a NAS

This walkthrough uses Synology DSM 7. The author of the guide and Remotely Sync is **not** a NAS or Synology expert; read the documentation carefully and adapt the setup to your needs.

**Exposing a NAS to the public internet is dangerous if you do not know how to configure firewalls and other protections.**

See Synology's [WebDAV access guide](https://kb.synology.com/en-global/DSM/tutorial/How_to_access_files_on_Synology_NAS_with_WebDAV).

## Prepare the shared folder

Create a shared folder if needed; this example uses `share2`. Assign a user read/write permission for it.

![](./synology_create_shared_folder.png)

Create any intended subfolders inside the share before syncing. For example, this walkthrough uses `哈哈哈/sub folder` inside `share2`.

## Enable WebDAV Server

1. Install WebDAV Server from Package Center.
   ![](./synology_install_webdav_server.png)
2. Open the WebDAV Server settings.
3. If you know how to configure HTTPS certificates correctly, HTTPS is strongly recommended. This example enables HTTP for demonstration.
4. Enable **Enable DavDepthInfinity**, which can greatly speed up plugin runs, then click **Apply**.
   ![](./synology_webdav_server_settings.png)

## Set the address and test

In Remotely Sync settings, use this address format:

```
http(s)://<your synology ip or domain>:<port>/<shared folder>/<sub folders>
```

For the example above:

```
http://<ip>:5000/share2/哈哈哈/sub folder
```

Use the credentials of the user with read/write access to `share2`. Set the Depth header to **supports depth="infinity"**, then check connectivity and sync.

![](./synology_remotely_sync_settings.png)

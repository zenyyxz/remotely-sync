# 群晖 WebDAV Server

[English](./README.md) | 中文

## 阅读前的安全提醒

本指南以群晖 DSM 7 为例。教程作者（Remotely Sync 作者）**不是** NAS 或群晖专家，请仔细阅读资料并自行调整以符合实际环境。

**如果不了解防火墙和其他保护措施的配置，不要将 NAS 暴露到公网；这样做非常危险。**

群晖官方指南：<https://kb.synology.cn/zh-cn/DSM/tutorial/How_to_access_files_on_Synology_NAS_with_WebDAV>

## 准备共享文件夹

如果尚无共享文件夹，请先创建一个。本示例使用 `share2`，并为其指定有读写权限的用户。

![](./synology_create_shared_folder.png)

如果计划将库同步到子目录，例如 `哈哈哈/sub folder`，请先在 `share2` 中创建相应子目录。

## 安装并启用 WebDAV Server

1. 从套件中心安装 WebDAV Server。
   ![](./synology_install_webdav_server.png)
2. 打开 WebDAV Server 设置。如果能够正确配置 HTTPS 证书，强烈建议启用 HTTPS。本示例为演示后续步骤使用 HTTP。
3. 同时启用 **Enable DavDepthInfinity**；这可能显著加快插件运行。点击 **Apply**。
   ![](./synology_webdav_server_settings.png)

## 填写连接地址并验证

在 Remotely Sync 设置中，将地址写为：

```
http(s)://<your synology ip or domain>:<port>/<shared folder>/<sub folders>
```

本示例对应的地址为：

```
http://<ip>:5000/share2/哈哈哈/sub folder
```

用户名和密码应属于之前配置为可读写 `share2` 的用户。Depth 设置选择“supports depth="infinity"”。检查连接，成功后即可同步。

![](./synology_remotely_sync_settings.png)

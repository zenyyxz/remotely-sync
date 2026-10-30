# AList WebDAV

[English](./README.md) | 中文

## 准备 AList 服务

中文官网及 WebDAV 指南：<https://alist.nn.ci/zh/>、<https://alist.nn.ci/zh/guide/webdav.html>。

安装并运行 AList，取得账号和密码后登录网页。添加一个存储，并记下挂载路径。示例挂载路径为 `/alisttest davpath`。

![](./alist_mount_path.zh.png)
![](./alist_mount_path.en.png)

## 组合 WebDAV 地址

地址由 **http(s)://域名**、**端口**、**`/dav`** 和**挂载路径**依次组成。挂载路径中如果有空格，应编码为 `%20`。例如：

```
http[s]://domain:port/dav/[mountpath url encoded]
http://127.0.0.1:5244/dav/alisttest%20davpath
```

## 在 Remotely Sync 中连接

选择 WebDAV 类型，输入**包含完整域名、端口、`/dav` 和挂载路径的地址**，以及账号和密码。

![](./alist_rs_settings.en.png)

点击“检查连接”，确认连接后即可同步。

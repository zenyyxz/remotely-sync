# 坚果云 WebDAV

[English](./README.md) | 中文

## 重要限制

坚果云对 API 调用数量等有限制。文件较多时，Remotely Sync 可能产生较多查询并触发 API 上限，导致工作不正常。这不是插件 bug，也没有办法解决。开始配置前请先考虑这一限制。

## 获取 WebDAV 专用凭证

1. 注册并登录坚果云账号。
2. 前往“个人信息”→“安全”，点击“添加应用”。
3. 记录生成的 WebDAV 账号（通常是 email）和 WebDAV 密码。该密码是特殊字符串，**不同于网站登录密码**。

   ![](./webdav_jianguoyun.cn.png)

## 配置与验证连接

在 Remotely Sync 设置中输入 WebDAV 地址、账号和密码，并将“发送到服务器的 Depth Header”设为“只支持 depth='1'”。

![](./webdav_jianguoyun_rs_settting.cn.png)

点击“检查连接”；连接成功后即可同步。若因文件较多而触及 API 限额，插件可能无法正常工作。

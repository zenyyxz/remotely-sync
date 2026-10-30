# 腾讯云 COS

[English](./README.md) | 中文

## 开始前：选择控制台区域

中国区控制台入口：<https://console.cloud.tencent.com/cos>。本指南以中国区界面为例，国际区配置应该类似。

## 创建存储桶并准备密钥

1. 在“存储桶列表”中创建存储桶；创建时选择**私有读写**权限，并建议开启服务端加密。也可以从[创建存储桶页面](https://console.cloud.tencent.com/cos/bucket?action=create)进入。
2. 打开新建存储桶的概览页，记录桶名称、地域和访问域名。
   ![](./cos_bucket_info.png)
3. 前往[访问管理页](https://console.cloud.tencent.com/cam/capi)的“API 密钥管理”，创建密钥并记录 SecretID 和 SecretKey。
   ![](./cos_create_secret.png)

## 从访问域名确定服务地址

**服务地址需要移除访问域名中的桶名称。**例如，控制台显示的访问域名为：

```
https://<bucket-name-with-number>.cos.<region>.myqcloud.com
```

那么 Remotely Sync 中使用的服务地址为：

```
https://cos.<region>.myqcloud.com
```

在 Remotely Sync 设置中输入服务地址、SecretID、SecretKey 和桶名称。

![](./cos_setting.png)

## 检查连接并同步

先检查连接，确认连接状态后再同步。

![](./cos_connection.png)

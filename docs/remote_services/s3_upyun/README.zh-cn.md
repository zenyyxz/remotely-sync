# 又拍云 S3

## 适用服务与安全提醒

- 官网：<https://www.upyun.com/>
- S3 兼容文档：<https://help.upyun.com/knowledge-base/aws-s3%e5%85%bc%e5%ae%b9/>

又拍云似乎（原指南中也标注为不确定）默认公开文件。请特别注意隐私风险，并强烈建议在插件中设置加密。

## 准备对象存储与凭证

1. 注册又拍云账号并新建对象存储。
2. 参考[官方 S3 文档](https://help.upyun.com/knowledge-base/aws-s3%e5%85%bc%e5%ae%b9/)创建操作员，然后创建 S3 访问凭证。
3. 记录 AccessKey 和 SecretAccessKey。

## 填写 Remotely Sync 设置

在设置中填入以下内容：

- **Endpoint（服务地址）：** `s3.api.upyun.com`，**必须使用此域名**。
- **Region（区域）：** `us-east-1`。
- **Access Key ID：** 获取到的访问凭证中的 AccessKey。
- **Secret Access Key：** 获取到的访问凭证中的 SecretAccessKey。
- **Bucket（存储桶）名称：** 创建的“服务名”。
- **是否生成文件夹 Object：** 选择“不生成”（默认值），**必须选择不生成**。

## 加密并同步

可以在插件设置中添加密码，然后开始同步。由于文件可能默认公开，请在同步前确认隐私保护设置。

# Remotely Sync

Remotely Sync 是一款非官方 Obsidian 插件，可通过云存储在设备之间同步 vault。它不是 Obsidian 官方的[同步服务](https://obsidian.md/sync)。

[English](./README.md) · [GitHub 仓库](https://github.com/zenyyxz/remotely-sync)

## 开始之前

**首次同步前请先手动备份 vault。** 同步会依据本地和远程状态创建、修改或删除文件；请先阅读相关设置，并确认选择的云端位置正确。

插件本身的所有功能均可免费使用，不需要 Remotely Sync 账户或订阅。你仍需授权所选云服务；云服务的存储、请求或流量费用由服务提供商决定。

## 选择云端位置

支持以下服务：

- **S3 及兼容服务**：Amazon S3、Cloudflare R2、Backblaze B2、MinIO、Storj、腾讯云 COS 等。查看[服务列表](./docs/services_connectable_or_not.md)和[S3 用户策略](./docs/remote_services/s3_general/s3_user_policy.md)。
- **文件同步服务**：Dropbox、个人 OneDrive（应用文件夹或完整访问）、Google Drive、Box、pCloud、Yandex Disk、Koofr。
- **自建或托管存储**：WebDAV、Webdis、Azure Blob Storage。

各服务的连接步骤和限制见[服务配置指南](./docs/remote_services/)。

## 配置并执行首次同步

1. 在 Obsidian 的社区插件设置中搜索 **Remotely Sync** 并安装；也可以从[本项目发布页](https://github.com/zenyyxz/remotely-sync/releases)手动安装。
2. 打开 Remotely Sync 设置，选择服务，填写该服务要求的地址、容器/存储桶或其他连接信息。
3. 按设置中的流程授权或检查连接。凭据保存在 Obsidian 插件数据中；不要分享 `data.json`。
4. 检查远程目录和同步选项。默认情况下，隐藏路径可能不会同步；`.obsidian` 配置目录也有单独设置。
5. 确认备份和目标位置无误后，再启动同步。首次同步可能需要较长时间。

默认远程目录通常使用 vault 名称。若要让多台设备访问相同远程数据，请使用相同的服务、远程目录和相关加密设置。

## 数据保护与冲突

- 可选用[端到端加密](./docs/encryption/README.md)。设置加密密码后，请妥善保管；丢失密码可能导致无法解密远程文件。vault 名称本身不会因此加密。
- 插件提供冲突检测与处理；[智能冲突处理](./docs/features/README.md)可合并较小的 Markdown 文件。使用前先备份，并查看功能说明。
- 可以设置同步保护规则、跳过大型文件或路径，并配置隐藏文件处理。详见[同步算法说明](./docs/sync_algorithm/v3/intro.md)。
- `data.json` 含有连接凭据等敏感设置。不要公开、发送给他人或提交到版本控制。
- Obsidian 移动端处理大文件（约 50 MB 及以上）可能受 API 性能影响；可考虑启用跳过大文件。

## 日常使用

在侧边栏点击同步按钮，或从命令面板启动同步。也可以在设置中启用定时同步或保存时同步；自动同步只会在 Obsidian 运行期间进行。

若同步结果与预期不符，请暂停自动同步、保留本地和远程副本，并先查看[调试指南](./docs/how_to_debug/README.md)。性能问题可参考[性能分析指南](./docs/check_performance/README.md)。

## 服务指南

- [Dropbox 授权说明](./docs/dropbox_review_material/README.md)
- [S3 / 兼容服务配置](./docs/remote_services/s3_cloudflare_r2/README.md)
- [WebDAV 示例](./docs/remote_services/webdav_nextcloud/README.md)
- [OneDrive 完整访问](./docs/remote_services/onedrivefull/README.md)
- [所有服务的可连接性概览](./docs/services_connectable_or_not.md)

## 项目与反馈

Remotely Sync 是基于 Remotely Save 开源代码库开发的独立项目。欢迎通过[GitHub 仓库](https://github.com/zenyyxz/remotely-sync)提交问题或建议。云服务可能收费；请自行了解服务商的价格和使用限制。

## 许可证

项目源代码采用 [Apache License 2.0](./LICENSE)。`assets/branding/` 中的
Logo 作品单独采用 [CC BY-SA 4.0](./assets/branding/LICENSE.txt) 许可。
第三方依赖和其他附带资源仍遵循各自的许可证。

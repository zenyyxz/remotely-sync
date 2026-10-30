# Yandex Disk

## Service and compatibility

Use the [Yandex Disk web client](https://disk.yandex.com/client/disk) to access your account. This plugin is **not an official Yandex Disk or Yandex product**; it uses Yandex Disk's public API.

The plugin currently labels this provider **beta**. **Back up your vault before using it.**

Remotely Sync uses Yandex Disk's native API rather than WebDAV, which allows the last modified time to be preserved. Some users may also prefer OAuth 2 authorization.

## Connect

1. In Remotely Sync settings, select **Yandex Disk**.
2. Click **Auth** and open the link to start on Yandex Disk's website.
3. Follow Yandex Disk's instructions and allow Remotely Sync to connect.
4. Return to the plugin and check the connection notice.
5. Sync. The plugin creates a vault folder at the root of Yandex Disk and uploads notes there.

## Registering an app

If you need to register the app, use either <https://oauth.yandex.com/client/new/> or <https://oauth.yandex.ru/client/new/>. Set the redirect URI to either <https://oauth.yandex.com/verification_code> or <https://oauth.yandex.ru/verification_code>.

## Troubleshooting

If authorization does not complete, verify the Yandex authorization steps and return to the plugin to check its connection notice. Keep a vault backup while using this beta feature.

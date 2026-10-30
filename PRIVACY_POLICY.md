# Remotely Sync Privacy Policy

**Effective date: October 30, 2026**

Remotely Sync is an open-source Obsidian plugin maintained by zenyyxz. This
policy explains what information the plugin and its Google Drive authorization
service handle.

## Information handled by the plugin

Remotely Sync processes vault files, file names, file metadata, and provider
connection settings to synchronize the locations you select. The plugin sends
sync data directly between your Obsidian device and the storage provider you
configure. The Remotely Sync maintainer does not receive or store your vault
files through the Google authorization service.

Provider credentials, including OAuth access and refresh tokens, are stored in
Obsidian's local plugin settings on your device. Obsidian stores plugin settings
in the vault's plugin data. Anyone or any software with access to that device,
vault, backups, or settings file may be able to access those credentials. Keep
your device and vault backups secure, and do not share the plugin `data.json`
file.

## Google Drive authorization service

When you connect Google Drive, the plugin uses `auth.lahirux.dev` to complete
OAuth authorization. The service handles the OAuth state and PKCE challenge,
the temporary authorization code returned by Google, and requests to exchange
that code or refresh token for Google tokens. These requests are forwarded to
Google's OAuth endpoints. The service does not receive your vault files.

Authorization state is held temporarily in memory for up to 10 minutes, and
one-time authorization relay codes are held for up to 2 minutes. Refresh tokens
are used to request access tokens from Google and are not intentionally stored
by the authorization service. The Google OAuth client secret is stored on the
service host for the purpose of completing OAuth requests.

The service temporarily uses client IP addresses in memory for rate limiting.
It is configured not to write ordinary HTTP access logs, and its application
logs do not include OAuth request parameters or token values. The service is
hosted on Oracle Cloud Infrastructure; its infrastructure provider may process
network and operational information as part of operating the server.

## Storage providers and third parties

Your selected storage provider receives the files and metadata needed to carry
out your sync, subject to that provider's terms and privacy policy. When using
Google Drive, the plugin requests the Google Drive `drive.file` scope. Google
processes OAuth and Drive API requests under its own policies. Other providers
have their own terms and privacy policies.

The plugin does not include advertising or analytics. It does make network
requests to the storage provider you configure and, for Google Drive OAuth, to
the Remotely Sync authorization service and Google.

## Encryption

The plugin offers optional encryption for supported sync workflows. If you
enable it, keep your encryption password safe. Encryption does not hide every
piece of information, such as the vault name and information required by your
selected provider to store and synchronize files. Review the encryption
documentation and test your recovery process before relying on it.

## Your choices and data deletion

You can stop using a provider, revoke its authorization in the provider's
account settings, and remove saved credentials using the plugin settings.
Revoking authorization at the provider prevents future authorized access but
does not automatically delete files already stored there. Delete remote files
through the provider or plugin as appropriate.

The authorization service's temporary OAuth state and relay codes expire
automatically or are removed after use. Removing the plugin or its settings
does not remove local vault files, backups, or remote copies.

## Children's privacy

Remotely Sync is a general-purpose software plugin and is not designed to
collect age or contact information from children. The maintainer does not
intentionally collect personal information through the plugin; the Google
authorization service does temporarily process request IP addresses as
described above.

## Changes to this policy

This policy may be updated when the plugin or its services change. The latest
version will be published with the Remotely Sync source repository, with its
effective date updated when applicable.

## Contact

For privacy questions or requests, contact the maintainer through the
[Remotely Sync GitHub repository](https://github.com/zenyyxz/remotely-sync).

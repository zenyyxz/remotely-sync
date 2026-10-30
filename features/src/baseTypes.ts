////////////////////////////////////////////////////////////
// hacks
////////////////////////////////////////////////////////////

declare global {
  var DEFAULT_GOOGLEDRIVE_CLIENT_ID: string;
  var DEFAULT_GOOGLEDRIVE_CLIENT_SECRET: string;
  var DEFAULT_BOX_CLIENT_ID: string;
  var DEFAULT_BOX_CLIENT_SECRET: string;
  var DEFAULT_PCLOUD_CLIENT_ID: string;
  var DEFAULT_PCLOUD_CLIENT_SECRET: string;
  var DEFAULT_YANDEXDISK_CLIENT_ID: string;
  var DEFAULT_YANDEXDISK_CLIENT_SECRET: string;
  var DEFAULT_KOOFR_CLIENT_ID: string;
  var DEFAULT_KOOFR_CLIENT_SECRET: string;
}

///////////////////////////////////////////////////////////
// smart conflict
//////////////////////////////////////////////////////////

export const MERGABLE_SIZE = 1000 * 1000; // 1 MB

///////////////////////////////////////////////////////////
// Google Drive
//////////////////////////////////////////////////////////

export interface GoogleDriveConfig {
  accessToken: string;
  accessTokenExpiresInMs: number;
  accessTokenExpiresAtTimeMs: number;
  refreshToken: string;
  remoteBaseDir?: string;
  credentialsShouldBeDeletedAtTimeMs?: number;
  scope: "https://www.googleapis.com/auth/drive.file";
  kind: "googledrive";
}

export const GOOGLEDRIVE_CLIENT_ID = global.DEFAULT_GOOGLEDRIVE_CLIENT_ID;
export const GOOGLEDRIVE_CLIENT_SECRET =
  global.DEFAULT_GOOGLEDRIVE_CLIENT_SECRET;

///////////////////////////////////////////////////////////
// box
//////////////////////////////////////////////////////////

export const COMMAND_CALLBACK_BOX = "remotely-sync-cb-box";
export const BOX_CLIENT_ID = global.DEFAULT_BOX_CLIENT_ID;
export const BOX_CLIENT_SECRET = global.DEFAULT_BOX_CLIENT_SECRET;

export interface BoxConfig {
  accessToken: string;
  accessTokenExpiresInMs: number;
  accessTokenExpiresAtTimeMs: number;
  refreshToken: string;
  remoteBaseDir?: string;
  credentialsShouldBeDeletedAtTimeMs?: number;
  kind: "box";
}

///////////////////////////////////////////////////////////
// pCloud
//////////////////////////////////////////////////////////

export const COMMAND_CALLBACK_PCLOUD = "remotely-sync-cb-pcloud";
export const PCLOUD_CLIENT_ID = global.DEFAULT_PCLOUD_CLIENT_ID;
export const PCLOUD_CLIENT_SECRET = global.DEFAULT_PCLOUD_CLIENT_SECRET;

export interface PCloudConfig {
  accessToken: string;
  hostname: "eapi.pcloud.com" | "api.pcloud.com";
  locationid: 1 | 2;
  remoteBaseDir?: string;
  credentialsShouldBeDeletedAtTimeMs?: number;
  kind: "pcloud";

  /**
   * @deprecated
   */
  emptyFile: "skip" | "error";
}

///////////////////////////////////////////////////////////
// Yandex Disk
//////////////////////////////////////////////////////////

export const COMMAND_CALLBACK_YANDEXDISK = "remotely-sync-cb-yandexdisk";
export const YANDEXDISK_CLIENT_ID = global.DEFAULT_YANDEXDISK_CLIENT_ID;
export const YANDEXDISK_CLIENT_SECRET = global.DEFAULT_YANDEXDISK_CLIENT_SECRET;

export interface YandexDiskConfig {
  accessToken: string;
  accessTokenExpiresInMs: number;
  accessTokenExpiresAtTimeMs: number;
  refreshToken: string;
  remoteBaseDir?: string;
  credentialsShouldBeDeletedAtTimeMs?: number;
  scope: string;
  kind: "yandexdisk";
}

///////////////////////////////////////////////////////////
// Koofr
//////////////////////////////////////////////////////////

export const COMMAND_CALLBACK_KOOFR = "remotely-sync-cb-koofr";
export const KOOFR_CLIENT_ID = global.DEFAULT_KOOFR_CLIENT_ID;
export const KOOFR_CLIENT_SECRET = global.DEFAULT_KOOFR_CLIENT_SECRET;

export interface KoofrConfig {
  accessToken: string;
  accessTokenExpiresInMs: number;
  accessTokenExpiresAtTimeMs: number;
  refreshToken: string;
  remoteBaseDir?: string;
  credentialsShouldBeDeletedAtTimeMs?: number;
  scope: string;
  api: string;
  mountID: string;
  kind: "koofr";
}

///////////////////////////////////////////////////////////
// Azure Blob Storage
//////////////////////////////////////////////////////////

export interface AzureBlobStorageConfig {
  containerSasUrl: string;
  containerName: string;
  remotePrefix: string;
  generateFolderObject: boolean;
  partsConcurrency: number;
  kind: "azureblobstorage";
}

///////////////////////////////////////////////////////////
// Onedrive (Full)
//////////////////////////////////////////////////////////

export const COMMAND_CALLBACK_ONEDRIVEFULL = "remotely-sync-cb-onedrivefull";

export interface OnedriveFullConfig {
  accessToken: string;
  clientID: string;
  authority: string;
  refreshToken: string;
  accessTokenExpiresInSeconds: number;
  accessTokenExpiresAtTime: number;
  deltaLink: string;
  username: string;
  credentialsShouldBeDeletedAtTime?: number;
  remoteBaseDir?: string;
  emptyFile: "skip" | "error";
  kind: "onedrivefull";
}

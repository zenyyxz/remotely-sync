import { FakeFsAzureBlobStorage } from "../features/src/fsAzureBlobStorage";
import { FakeFsBox } from "../features/src/fsBox";
import { FakeFsGoogleDrive } from "../features/src/fsGoogleDrive";
import { FakeFsKoofr } from "../features/src/fsKoofr";
import { FakeFsOnedriveFull } from "../features/src/fsOnedriveFull";
import { FakeFsPCloud } from "../features/src/fsPCloud";
import { FakeFsYandexDisk } from "../features/src/fsYandexDisk";
import type { RemotelySyncPluginSettings } from "./baseTypes";
import type { FakeFs } from "./fsAll";
import { FakeFsDropbox } from "./fsDropbox";
import { FakeFsOnedrive } from "./fsOnedrive";
import { FakeFsS3 } from "./fsS3";
import { FakeFsWebdav } from "./fsWebdav";
import { FakeFsWebdis } from "./fsWebdis";

/**
 * To avoid circular dependency, we need a new file here.
 */
export function getClient(
  settings: RemotelySyncPluginSettings,
  vaultName: string,
  saveUpdatedConfigFunc: () => Promise<any>
): FakeFs {
  switch (settings.serviceType) {
    case "s3":
      return new FakeFsS3(settings.s3);
    case "webdav":
      return new FakeFsWebdav(
        settings.webdav,
        vaultName,
        saveUpdatedConfigFunc
      );
    case "dropbox":
      return new FakeFsDropbox(
        settings.dropbox,
        vaultName,
        saveUpdatedConfigFunc
      );
    case "onedrive":
      return new FakeFsOnedrive(
        settings.onedrive,
        vaultName,
        saveUpdatedConfigFunc
      );
    case "onedrivefull":
      return new FakeFsOnedriveFull(
        settings.onedrivefull,
        vaultName,
        saveUpdatedConfigFunc
      );
    case "webdis":
      return new FakeFsWebdis(
        settings.webdis,
        vaultName,
        saveUpdatedConfigFunc
      );
    case "googledrive":
      return new FakeFsGoogleDrive(
        settings.googledrive,
        vaultName,
        saveUpdatedConfigFunc
      );
    case "box":
      return new FakeFsBox(settings.box, vaultName, saveUpdatedConfigFunc);
    case "pcloud":
      return new FakeFsPCloud(
        settings.pcloud,
        vaultName,
        saveUpdatedConfigFunc
      );
    case "yandexdisk":
      return new FakeFsYandexDisk(
        settings.yandexdisk,
        vaultName,
        saveUpdatedConfigFunc
      );
    case "koofr":
      return new FakeFsKoofr(settings.koofr, vaultName, saveUpdatedConfigFunc);
    case "azureblobstorage":
      return new FakeFsAzureBlobStorage(settings.azureblobstorage, vaultName);
    default:
      throw Error(`cannot init client for serviceType=${settings.serviceType}`);
  }
}

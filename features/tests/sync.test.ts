import { strict as assert } from "assert";
import type { Entity, MixedEntity } from "../../src/baseTypes";
import { FakeFs } from "../../src/fsAll";
import type { FakeFsEncrypt } from "../../src/fsEncrypt";
import type { InternalDBs } from "../../src/localdb";
import { checkIsSkipItemOrNotByName, doActualSync } from "../src/sync";

class TestFs extends FakeFs {
  kind = "test";
  content: ArrayBuffer;
  entities: Entity[];

  constructor(content: ArrayBuffer, entities: Entity[] = []) {
    super();
    this.content = content;
    this.entities = entities;
  }

  async walk(): Promise<Entity[]> {
    return this.entities;
  }
  async walkPartial(): Promise<Entity[]> {
    return this.entities;
  }
  async stat(key: string): Promise<Entity> {
    throw new Error(`unexpected stat: ${key}`);
  }
  async mkdir(key: string): Promise<Entity> {
    throw new Error(`unexpected mkdir: ${key}`);
  }
  async writeFile(
    key: string,
    content: ArrayBuffer,
    mtime: number,
    ctime: number
  ): Promise<Entity> {
    throw new Error(`unexpected writeFile: ${key}`);
  }
  async readFile(key: string): Promise<ArrayBuffer> {
    return this.content;
  }
  async rename(key1: string, key2: string): Promise<void> {
    throw new Error(`unexpected rename: ${key1} -> ${key2}`);
  }
  async rm(key: string): Promise<void> {
    throw new Error(`unexpected rm: ${key}`);
  }
  async checkConnect(): Promise<boolean> {
    return true;
  }
  async getUserDisplayName(): Promise<string> {
    return "test";
  }
  async revokeAuth(): Promise<void> {}
  allowEmptyFile(): boolean {
    return true;
  }
}

const makeChangedFilePlan = (
  contentSize: number
): Record<string, MixedEntity> => {
  const local: Entity = {
    key: "note.md",
    keyRaw: "note.md",
    size: contentSize,
    sizeEnc: contentSize,
    sizeRaw: contentSize,
    mtimeCli: 2,
  };
  const remote: Entity = {
    key: "note.md",
    keyRaw: "note.md",
    size: contentSize,
    sizeEnc: contentSize,
    sizeRaw: contentSize,
    mtimeCli: 1,
    mtimeSvr: 1,
  };
  return {
    "note.md": {
      key: "note.md",
      local,
      remote,
      decision: "conflict_modified_then_keep_local",
      change: true,
    },
  };
};

describe("Sync: checkIsSkipItemOrNotByName", () => {
  it("should be ok everywhere for empty config", async () => {
    let isSkip = checkIsSkipItemOrNotByName(
      "xxx.md",
      false,
      false,
      false,
      ".obsidian",
      /*    ignorePaths */ [],
      /* onlyAllowPaths */ []
    ).finalIsIgnored;
    assert.ok(!isSkip);

    isSkip = checkIsSkipItemOrNotByName(
      "xxx.md",
      false,
      false,
      false,
      ".obsidian",
      /*    ignorePaths */ [""],
      /* onlyAllowPaths */ ["", "\n"]
    ).finalIsIgnored;
    assert.ok(!isSkip);
  });

  it("should be ok for deny list", async () => {
    let isSkip = checkIsSkipItemOrNotByName(
      "xxx.md",
      false,
      false,
      false,
      ".obsidian",
      /*    ignorePaths */ ["xxx"],
      /* onlyAllowPaths */ []
    ).finalIsIgnored;
    assert.ok(isSkip);

    isSkip = checkIsSkipItemOrNotByName(
      "yyy.md",
      false,
      false,
      false,
      ".obsidian",
      /*    ignorePaths */ ["xxx"],
      /* onlyAllowPaths */ []
    ).finalIsIgnored;
    assert.ok(!isSkip);

    isSkip = checkIsSkipItemOrNotByName(
      "xxx.md",
      false,
      false,
      false,
      ".obsidian",
      /*    ignorePaths */ ["xxx$"],
      /* onlyAllowPaths */ []
    ).finalIsIgnored;
    assert.ok(!isSkip);

    // if we deny a folder, we have to deny all the sub files
    // TODO: it's soooo hard to do the path resolution in this func with regex,
    //       so we defer the detection to later steps now.
    //       the test here doesn't work.
    // isSkip = checkIsSkipItemOrNotByName(
    //   'xxx/yyy.md',
    //   false,
    //   false,
    //   false,
    //   '.obsidian',
    //   /*    ignorePaths */ ['xxx/$'],
    //   /* onlyAllowPaths */ []
    // ).finalIsIgnored;
    // assert.ok(isSkip);
  });

  it("should be ok for allow list", async () => {
    let isSkip = checkIsSkipItemOrNotByName(
      "xxx.md",
      false,
      false,
      false,
      ".obsidian",
      /*    ignorePaths */ [],
      /* onlyAllowPaths */ ["xxx"]
    ).finalIsIgnored;
    assert.ok(!isSkip);

    isSkip = checkIsSkipItemOrNotByName(
      "yyy.md",
      false,
      false,
      false,
      ".obsidian",
      /*    ignorePaths */ [""],
      /* onlyAllowPaths */ ["xxx"]
    ).finalIsIgnored;
    assert.ok(isSkip);

    isSkip = checkIsSkipItemOrNotByName(
      "xxx.md",
      false,
      false,
      false,
      ".obsidian",
      /*    ignorePaths */ [],
      /* onlyAllowPaths */ ["xxx$"]
    ).finalIsIgnored;
    assert.ok(isSkip);

    // should NOT skip because we allow the sub file AND not deny the folder
    // TODO: it's soooo hard to do the path resolution in this func with regex,
    //       so we defer the detection to later steps now.
    //       the test here doesn't work.
    // isSkip = checkIsSkipItemOrNotByName(
    //   'xxx/',
    //   false,
    //   false,
    //   false,
    //   '.obsidian',
    //   /*    ignorePaths */ [],
    //   /* onlyAllowPaths */ ['xxx/yyy.md']
    // ).finalIsIgnored;
    // assert.ok(!isSkip);
  });

  it("should detect the name by two lists together", async () => {
    // should skip because we ignore the path
    let isSkip = checkIsSkipItemOrNotByName(
      "xxx.md",
      false,
      false,
      false,
      ".obsidian",
      /*    ignorePaths */ ["xxx"],
      /* onlyAllowPaths */ ["yyy"]
    ).finalIsIgnored;
    assert.ok(isSkip);

    // should skip because we disallow the whole folder
    isSkip = checkIsSkipItemOrNotByName(
      "xxx/yyy.md",
      false,
      false,
      false,
      ".obsidian",
      /*    ignorePaths */ ["xxx"],
      /* onlyAllowPaths */ ["xxx/yyy.md"]
    ).finalIsIgnored;
    assert.ok(isSkip);
  });
});

describe("Sync: protect modify percentage", () => {
  const runSyncWithContents = async (
    localContent: ArrayBuffer,
    remoteContent: ArrayBuffer
  ) => {
    const key = "note.md";
    const plan = makeChangedFilePlan(localContent.byteLength);
    const localFs = new TestFs(localContent);
    const encryptedFs = {
      readFile: async () => remoteContent,
    } as unknown as FakeFsEncrypt;
    const savedRecords: unknown[] = [];
    const db = {
      prevSyncRecordsTbl: {
        setItem: async (_key: string, value: unknown) => {
          savedRecords.push(value);
        },
      },
    } as unknown as InternalDBs;

    await doActualSync(
      plan,
      localFs,
      encryptedFs,
      "vault-id",
      "profile-id",
      1,
      50,
      () => "too many changes",
      db,
      undefined,
      "keep_newer",
      "manual"
    );
    return { plan, savedRecords };
  };

  it("does not block a large timestamp-only change when file contents match", async () => {
    const contents = new Uint8Array([1, 2, 3]).buffer;
    const { plan, savedRecords } = await runSyncWithContents(
      contents,
      contents.slice(0)
    );

    assert.equal(plan["note.md"].decision, "equal");
    assert.equal(plan["note.md"].change, false);
    assert.equal(savedRecords.length, 1);
  });

  it("still blocks a large change when file contents differ", async () => {
    await assert.rejects(
      runSyncWithContents(
        new Uint8Array([1, 2, 3]).buffer,
        new Uint8Array([1, 2, 4]).buffer
      ),
      /too many changes/
    );
  });
});

import { strict as assert } from "assert";
const Module = require("module") as {
  _load: (request: string, parent: object | null, isMain: boolean) => unknown;
};

const originalModuleLoad = Module._load.bind(Module);
Module._load = (request, parent, isMain) => {
  if (request === "obsidian") {
    return {
      requestUrl: async () => {
        throw new Error("Obsidian requestUrl is not used in these tests.");
      },
    };
  }
  return originalModuleLoad(request, parent, isMain);
};
const {
  DEFAULT_GOOGLEDRIVE_CONFIG,
  FakeFsGoogleDrive,
} = require("../src/fsGoogleDrive");
Module._load = originalModuleLoad;

const makeFs = () => {
  const fs = new FakeFsGoogleDrive(
    {
      ...DEFAULT_GOOGLEDRIVE_CONFIG,
      accessToken: "test-access-token",
      refreshToken: "test-refresh-token",
      accessTokenExpiresAtTimeMs: Date.now() + 60_000,
    },
    "test-vault",
    async () => {}
  );
  fs.vaultFolderExists = true;
  fs.baseDirID = "vault-folder-id";
  return fs;
};

const makeFileResponse = (id: string, modifiedTime: string) =>
  new Response(
    JSON.stringify({
      id,
      name: "note.md",
      mimeType: "text/markdown",
      size: "4",
      modifiedTime,
      createdTime: modifiedTime,
    }),
    { status: 200 }
  );

const makeFileListResponse = (files: object[]) =>
  new Response(JSON.stringify({ files }), { status: 200 });

const withMoment = async (run: () => Promise<unknown>) => {
  const originalWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: {
      moment: (timestamp: number) => ({
        toISOString: () => new Date(timestamp).toISOString(),
      }),
    },
  });
  try {
    await run();
  } finally {
    if (originalWindow) {
      Object.defineProperty(globalThis, "window", originalWindow);
    } else {
      Reflect.deleteProperty(globalThis, "window");
    }
  }
};

describe("Google Drive filesystem", () => {
  it("escapes quotes and backslashes in the vault folder search", async () => {
    const vaultName = "student's \\ vault";
    const fs = new FakeFsGoogleDrive(
      {
        ...DEFAULT_GOOGLEDRIVE_CONFIG,
        accessToken: "test-access-token",
        refreshToken: "test-refresh-token",
        accessTokenExpiresAtTimeMs: Date.now() + 60_000,
        remoteBaseDir: vaultName,
      },
      vaultName,
      async () => {}
    );
    const originalFetch = globalThis.fetch;
    const requests: string[] = [];
    globalThis.fetch = async (input) => {
      requests.push(String(input));
      if (requests.length === 1) {
        return new Response(JSON.stringify({ files: [] }), { status: 200 });
      }
      return new Response(JSON.stringify({ id: "created-vault-id" }), {
        status: 200,
      });
    };

    try {
      await fs._init();
    } finally {
      globalThis.fetch = originalFetch;
    }

    const query = new URL(requests[0]).searchParams.get("q");
    assert.equal(
      query,
      "'root' in parents and name='student\\'s \\\\ vault' and mimeType='application/vnd.google-apps.folder' and trashed=false"
    );
  });

  it("creates a file when no remote entry exists", async () => {
    const fs = makeFs();
    const originalFetch = globalThis.fetch;
    const requests: Array<{ url: string; init?: RequestInit }> = [];
    globalThis.fetch = async (input, init) => {
      requests.push({ url: String(input), init });
      if (requests.length === 1) {
        return makeFileListResponse([]);
      }
      return makeFileResponse("new-file-id", "2026-10-30T12:00:00.000Z");
    };

    try {
      await withMoment(() =>
        fs.writeFile("note.md", new ArrayBuffer(4), 1_798_000_000_000, 1)
      );
    } finally {
      globalThis.fetch = originalFetch;
    }

    assert.equal(requests.length, 2);
    assert.equal(requests[0].init?.method, "GET");
    assert.equal(requests[1].init?.method, "POST");
    assert.match(requests[1].url, /\/files\?/);
    const formData = requests[1].init?.body as FormData;
    const metadata = JSON.parse(
      await (formData.get("metadata") as Blob).text()
    );
    assert.deepEqual(metadata.parents, ["vault-folder-id"]);
    assert.ok(metadata.createdTime);
  });

  it("updates an existing small file instead of creating a duplicate", async () => {
    const fs = makeFs();
    fs.keyToGDEntity["note.md"] = {
      id: "existing-file-id",
      key: "note.md",
      keyRaw: "note.md",
      parentID: "vault-folder-id",
      parentIDPath: "",
      isFolder: false,
      sizeRaw: 4,
    };

    const originalFetch = globalThis.fetch;
    const requests: Array<{ url: string; init?: RequestInit }> = [];
    globalThis.fetch = async (input, init) => {
      requests.push({ url: String(input), init });
      if (requests.length === 1) {
        return makeFileListResponse([
          {
            id: "existing-file-id",
            name: "note.md",
            mimeType: "text/markdown",
            size: "4",
            modifiedTime: "2026-10-30T12:00:00.000Z",
          },
        ]);
      }
      return makeFileResponse("existing-file-id", "2026-10-30T12:00:00.000Z");
    };

    try {
      await withMoment(() =>
        fs.writeFile("note.md", new ArrayBuffer(4), 1_798_000_000_000, 1)
      );
    } finally {
      globalThis.fetch = originalFetch;
    }

    assert.equal(requests.length, 2);
    assert.equal(requests[0].init?.method, "GET");
    assert.equal(requests[1].init?.method, "PATCH");
    assert.match(requests[1].url, /\/files\/existing-file-id\?/);
    const formData = requests[1].init?.body as FormData;
    const metadata = JSON.parse(
      await (formData.get("metadata") as Blob).text()
    );
    assert.equal(metadata.name, "note.md");
    assert.equal("parents" in metadata, false);
    assert.equal("createdTime" in metadata, false);
  });

  it("reuses a remote file on consecutive writes when the cache misses", async () => {
    const fs = makeFs();
    const originalFetch = globalThis.fetch;
    const requests: Array<{ url: string; init?: RequestInit }> = [];
    globalThis.fetch = async (input, init) => {
      requests.push({ url: String(input), init });
      if (init?.method === "GET") {
        return makeFileListResponse([
          {
            id: "existing-file-id",
            name: "note.md",
            mimeType: "text/markdown",
            size: "4",
            modifiedTime: "2026-10-30T12:00:00.000Z",
          },
        ]);
      }
      return makeFileResponse("existing-file-id", "2026-10-30T12:00:00.000Z");
    };

    try {
      await withMoment(async () => {
        await fs.writeFile("note.md", new ArrayBuffer(4), 1_798_000_000_000, 1);
        delete fs.keyToGDEntity["note.md"];
        await fs.writeFile("note.md", new ArrayBuffer(4), 1_798_000_000_000, 1);
      });
    } finally {
      globalThis.fetch = originalFetch;
    }

    const uploads = requests.filter(
      (request) => request.init?.method !== "GET"
    );
    assert.equal(uploads.length, 2);
    assert.ok(uploads.every((request) => request.init?.method === "PATCH"));
    assert.ok(
      uploads.every((request) =>
        request.url.includes("/files/existing-file-id?")
      )
    );
  });

  it("selects the most recently modified same-name remote file", async () => {
    const fs = makeFs();
    const originalFetch = globalThis.fetch;
    globalThis.fetch = async () =>
      new Response(
        JSON.stringify({
          files: [
            {
              id: "older-file-id",
              name: "note.md",
              mimeType: "text/markdown",
              size: "4",
              modifiedTime: "2026-10-29T12:00:00.000Z",
            },
            {
              id: "newer-file-id",
              name: "note.md",
              mimeType: "text/markdown",
              size: "4",
              modifiedTime: "2026-10-30T12:00:00.000Z",
            },
          ],
        }),
        { status: 200 }
      );

    try {
      const files = await fs.walk();
      assert.equal(files.length, 1);
      assert.equal(fs.keyToGDEntity["note.md"].id, "newer-file-id");
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  it("preserves opaque page tokens when walking multiple pages", async () => {
    const fs = makeFs();
    const originalFetch = globalThis.fetch;
    const requests: string[] = [];
    globalThis.fetch = async (input) => {
      requests.push(String(input));
      const files =
        requests.length === 1
          ? [
              {
                id: "first-file-id",
                name: "first.md",
                mimeType: "text/markdown",
                size: "4",
                modifiedTime: "2026-10-29T12:00:00.000Z",
              },
            ]
          : [
              {
                id: "second-file-id",
                name: "second.md",
                mimeType: "text/markdown",
                size: "4",
                modifiedTime: "2026-10-30T12:00:00.000Z",
              },
            ];
      return new Response(
        JSON.stringify(
          requests.length === 1
            ? { files, nextPageToken: "opaque+token/value=" }
            : { files }
        ),
        { status: 200 }
      );
    };

    try {
      const files = await fs.walk();
      assert.equal(files.length, 2);
      assert.equal(
        new URL(requests[1]).searchParams.get("pageToken"),
        "opaque+token/value="
      );
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  it("propagates folder-listing failures from the walk", async () => {
    const fs = makeFs();
    const originalFetch = globalThis.fetch;
    globalThis.fetch = async () => new Response(null, { status: 500 });

    try {
      await assert.rejects(
        fs.walk(),
        /cannot walk for parentID=vault-folder-id/
      );
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  it("uses a resumable update for an existing large file", async () => {
    const fs = makeFs();
    const key = "笔记.md";
    fs.keyToGDEntity[key] = {
      id: "existing-large-file-id",
      key,
      keyRaw: key,
      parentID: "vault-folder-id",
      parentIDPath: "",
      isFolder: false,
      sizeRaw: 5 * 1024 * 1024 + 1,
    };

    const originalFetch = globalThis.fetch;
    const requests: Array<{ url: string; init?: RequestInit }> = [];
    globalThis.fetch = async (input, init) => {
      requests.push({ url: String(input), init });
      if (requests.length === 1) {
        return makeFileListResponse([
          {
            id: "existing-large-file-id",
            name: key,
            mimeType: "text/markdown",
            size: String(5 * 1024 * 1024 + 1),
            modifiedTime: "2026-10-30T12:00:00.000Z",
          },
        ]);
      }
      if (requests.length === 2) {
        return new Response(null, {
          status: 200,
          headers: { Location: "https://upload.example/session" },
        });
      }
      if (requests.length === 3) {
        return new Response(null, { status: 308 });
      }
      return makeFileResponse(
        "existing-large-file-id",
        "2026-10-30T12:00:00.000Z"
      );
    };

    try {
      await withMoment(() =>
        fs.writeFile(
          key,
          new ArrayBuffer(5 * 1024 * 1024 + 1),
          1_798_000_000_000,
          1
        )
      );
    } finally {
      globalThis.fetch = originalFetch;
    }

    assert.equal(requests.length, 4);
    assert.equal(requests[0].init?.method, "GET");
    assert.equal(requests[1].init?.method, "PATCH");
    assert.match(requests[1].url, /\/files\/existing-large-file-id\?/);
    const metadataBody = requests[1].init?.body as string;
    assert.equal(
      new Headers(requests[1].init?.headers).get("Content-Length"),
      String(new TextEncoder().encode(metadataBody).byteLength)
    );
    assert.equal(requests[2].init?.method, "PUT");
    assert.equal(requests[2].url, "https://upload.example/session");
    assert.equal(requests[3].init?.method, "PUT");
    assert.equal(requests[3].url, "https://upload.example/session");
  });

  it("sends a JSON body when moving a Drive file to trash", async () => {
    const fs = makeFs();
    fs.keyToGDEntity["note.md"] = {
      id: "file-to-delete-id",
      key: "note.md",
      keyRaw: "note.md",
      parentID: "vault-folder-id",
      parentIDPath: "",
      isFolder: false,
      sizeRaw: 4,
    };
    const originalFetch = globalThis.fetch;
    let request: { url: string; init?: RequestInit } | undefined;
    globalThis.fetch = async (input, init) => {
      request = { url: String(input), init };
      return new Response(null, { status: 200 });
    };

    try {
      await fs.rm("note.md");
    } finally {
      globalThis.fetch = originalFetch;
    }

    assert.ok(request);
    assert.match(request.url, /\/files\/file-to-delete-id$/);
    assert.equal(request.init?.method, "PATCH");
    assert.equal(
      new Headers(request.init?.headers).get("Content-Type"),
      "application/json"
    );
    assert.deepEqual(JSON.parse(String(request.init?.body)), {
      trashed: true,
    });
  });

  it("awaits the access token before revoking Google authorization", async () => {
    const fs = makeFs();
    const originalFetch = globalThis.fetch;
    let request: { url: string; init?: RequestInit } | undefined;
    globalThis.fetch = async (input, init) => {
      request = { url: String(input), init };
      return new Response(null, { status: 200 });
    };

    try {
      await fs.revokeAuth();
    } finally {
      globalThis.fetch = originalFetch;
    }

    assert.ok(request);
    assert.equal(request.url, "https://oauth2.googleapis.com/revoke");
    assert.equal(request.init?.method, "POST");
    assert.equal(
      new Headers(request.init?.headers).get("Content-Type"),
      "application/x-www-form-urlencoded"
    );
    assert.equal(
      new URLSearchParams(String(request.init?.body)).get("token"),
      "test-access-token"
    );
  });
});

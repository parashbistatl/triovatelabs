const DB_NAME = "labadmin-file-store";
const STORE_NAME = "files";
const REF_PREFIX = "idb://";

type FileRecord = {
  id: string;
  blob: Blob;
};

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function randomId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function isIdbRef(value: string) {
  return value.startsWith(REF_PREFIX);
}

export async function saveFileToIdb(file: File) {
  const db = await openDb();
  const id = randomId();

  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    store.put({ id, blob: file } as FileRecord);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });

  return `${REF_PREFIX}${id}`;
}

async function readFileFromIdb(id: string) {
  const db = await openDb();

  return new Promise<Blob | null>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const request = store.get(id);
    request.onsuccess = () => {
      const result = request.result as FileRecord | undefined;
      resolve(result?.blob ?? null);
    };
    request.onerror = () => reject(request.error);
  });
}

export async function resolveFileRefToUrl(value: string) {
  if (!isIdbRef(value)) {
    return value;
  }

  const id = value.slice(REF_PREFIX.length);
  const blob = await readFileFromIdb(id);
  if (!blob) {
    return "";
  }

  return URL.createObjectURL(blob);
}

export async function deleteFileRef(value: string) {
  if (!isIdbRef(value)) {
    return;
  }

  const id = value.slice(REF_PREFIX.length);
  const db = await openDb();

  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    store.delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

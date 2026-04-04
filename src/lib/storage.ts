import type { DailyLog, Period, ProfileSettings, Settings } from "./types";
import { DEFAULT_PROFILE_SETTINGS, DEFAULT_SETTINGS } from "./types";

const STORAGE_KEYS = {
  periods: "period-calendar:periods",
  dailyLogs: "period-calendar:daily-logs",
  settings: "period-calendar:settings",
  profile: "period-calendar:profile",
  indexedDbMigration: "period-calendar:indexeddb-migrated:v1",
} as const;

const DB_NAME = "period-calendar-db";
const DB_VERSION = 1;
const MIGRATION_DONE_VALUE = "done";

const STORES = {
  periods: "periods",
  dailyLogs: "dailyLogs",
} as const;

type IndexedDbStoreName = (typeof STORES)[keyof typeof STORES];

let databasePromise: Promise<IDBDatabase> | null = null;
let migrationPromise: Promise<void> | null = null;

const isBrowser = (): boolean => typeof window !== "undefined";

const isIndexedDbSupported = (): boolean =>
  isBrowser() && typeof window.indexedDB !== "undefined";

const isValidStoredEntity = (value: unknown): value is { id: string } => {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as { id?: unknown };
  return typeof candidate.id === "string" && candidate.id.length > 0;
};

const byPeriodStartDateDesc = (a: Period, b: Period): number =>
  new Date(b.startDate).getTime() - new Date(a.startDate).getTime();

const byDailyLogDateDesc = (a: DailyLog, b: DailyLog): number =>
  b.date.localeCompare(a.date);

function readJsonArrayFromLocalStorage<T>(key: string): T[] {
  if (!isBrowser()) return [];

  const raw = window.localStorage.getItem(key);
  if (!raw) return [];

  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

function getPeriodsFromLocalStorage(): Period[] {
  return readJsonArrayFromLocalStorage<Period>(STORAGE_KEYS.periods)
    .filter(isValidStoredEntity)
    .sort(byPeriodStartDateDesc);
}

function savePeriodToLocalStorage(period: Period): void {
  if (!isBrowser()) return;

  const periods = readJsonArrayFromLocalStorage<Period>(STORAGE_KEYS.periods).filter(
    isValidStoredEntity,
  );
  const existingIndex = periods.findIndex((item) => item.id === period.id);

  if (existingIndex >= 0) {
    periods[existingIndex] = period;
  } else {
    periods.push(period);
  }

  window.localStorage.setItem(STORAGE_KEYS.periods, JSON.stringify(periods));
}

function deletePeriodFromLocalStorage(id: string): void {
  if (!isBrowser()) return;

  const periods = readJsonArrayFromLocalStorage<Period>(STORAGE_KEYS.periods)
    .filter(isValidStoredEntity)
    .filter((period) => period.id !== id);

  window.localStorage.setItem(STORAGE_KEYS.periods, JSON.stringify(periods));
}

function getDailyLogsFromLocalStorage(): DailyLog[] {
  return readJsonArrayFromLocalStorage<DailyLog>(STORAGE_KEYS.dailyLogs)
    .filter(isValidStoredEntity)
    .sort(byDailyLogDateDesc);
}

function saveDailyLogToLocalStorage(dailyLog: DailyLog): void {
  if (!isBrowser()) return;

  const dailyLogs = readJsonArrayFromLocalStorage<DailyLog>(
    STORAGE_KEYS.dailyLogs,
  ).filter(isValidStoredEntity);

  const byIdIndex = dailyLogs.findIndex((item) => item.id === dailyLog.id);
  if (byIdIndex >= 0) {
    dailyLogs[byIdIndex] = dailyLog;
  } else {
    const byDateIndex = dailyLogs.findIndex((item) => item.date === dailyLog.date);
    if (byDateIndex >= 0) {
      dailyLogs[byDateIndex] = dailyLog;
    } else {
      dailyLogs.push(dailyLog);
    }
  }

  window.localStorage.setItem(STORAGE_KEYS.dailyLogs, JSON.stringify(dailyLogs));
}

function deleteDailyLogFromLocalStorage(id: string): void {
  if (!isBrowser()) return;

  const dailyLogs = readJsonArrayFromLocalStorage<DailyLog>(STORAGE_KEYS.dailyLogs)
    .filter(isValidStoredEntity)
    .filter((dailyLog) => dailyLog.id !== id);

  window.localStorage.setItem(STORAGE_KEYS.dailyLogs, JSON.stringify(dailyLogs));
}

function requestToPromise<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => {
      resolve(request.result);
    };
    request.onerror = () => {
      reject(request.error ?? new Error("IndexedDB request failed"));
    };
  });
}

function transactionToPromise(transaction: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => {
      resolve();
    };
    transaction.onabort = () => {
      reject(transaction.error ?? new Error("IndexedDB transaction aborted"));
    };
    transaction.onerror = () => {
      reject(transaction.error ?? new Error("IndexedDB transaction failed"));
    };
  });
}

function openDatabase(): Promise<IDBDatabase> {
  if (!isIndexedDbSupported()) {
    return Promise.reject(new Error("IndexedDB is not supported"));
  }

  if (databasePromise) return databasePromise;

  databasePromise = new Promise((resolve, reject) => {
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const database = request.result;

      if (!database.objectStoreNames.contains(STORES.periods)) {
        const periodsStore = database.createObjectStore(STORES.periods, {
          keyPath: "id",
        });
        periodsStore.createIndex("startDate", "startDate", { unique: false });
      }

      if (!database.objectStoreNames.contains(STORES.dailyLogs)) {
        const dailyLogsStore = database.createObjectStore(STORES.dailyLogs, {
          keyPath: "id",
        });
        dailyLogsStore.createIndex("date", "date", { unique: false });
      }
    };

    request.onsuccess = () => {
      const database = request.result;
      database.onversionchange = () => {
        database.close();
        databasePromise = null;
      };
      resolve(database);
    };

    request.onerror = () => {
      databasePromise = null;
      reject(request.error ?? new Error("Unable to open IndexedDB"));
    };

    request.onblocked = () => {
      databasePromise = null;
      reject(new Error("IndexedDB open request blocked"));
    };
  });

  return databasePromise;
}

async function withStore<T>(
  storeName: IndexedDbStoreName,
  mode: IDBTransactionMode,
  runner: (store: IDBObjectStore) => Promise<T> | T,
): Promise<T> {
  const database = await openDatabase();
  const transaction = database.transaction(storeName, mode);
  const store = transaction.objectStore(storeName);

  const value = await runner(store);
  await transactionToPromise(transaction);

  return value;
}

async function getAllFromStore<T>(storeName: IndexedDbStoreName): Promise<T[]> {
  return withStore(storeName, "readonly", async (store) => {
    const values = await requestToPromise(store.getAll());
    return values as T[];
  });
}

async function putManyInStore<T>(
  storeName: IndexedDbStoreName,
  values: T[],
): Promise<void> {
  if (values.length === 0) return;

  await withStore(storeName, "readwrite", async (store) => {
    await Promise.all(values.map((value) => requestToPromise(store.put(value))));
  });
}

async function putInStore<T>(
  storeName: IndexedDbStoreName,
  value: T,
): Promise<void> {
  await withStore(storeName, "readwrite", async (store) => {
    await requestToPromise(store.put(value));
  });
}

async function deleteFromStore(
  storeName: IndexedDbStoreName,
  key: IDBValidKey,
): Promise<void> {
  await withStore(storeName, "readwrite", async (store) => {
    await requestToPromise(store.delete(key));
  });
}

async function migrateLocalStorageToIndexedDb(): Promise<void> {
  if (!isBrowser()) return;

  if (
    window.localStorage.getItem(STORAGE_KEYS.indexedDbMigration) ===
    MIGRATION_DONE_VALUE
  ) {
    return;
  }

  const [storedPeriods, storedDailyLogs] = await Promise.all([
    getAllFromStore<Period>(STORES.periods),
    getAllFromStore<DailyLog>(STORES.dailyLogs),
  ]);

  if (storedPeriods.length === 0) {
    const legacyPeriods = readJsonArrayFromLocalStorage<Period>(
      STORAGE_KEYS.periods,
    ).filter(isValidStoredEntity);

    await putManyInStore(STORES.periods, legacyPeriods);
  }

  if (storedDailyLogs.length === 0) {
    const legacyDailyLogs = readJsonArrayFromLocalStorage<DailyLog>(
      STORAGE_KEYS.dailyLogs,
    ).filter(isValidStoredEntity);

    await putManyInStore(STORES.dailyLogs, legacyDailyLogs);
  }

  window.localStorage.setItem(
    STORAGE_KEYS.indexedDbMigration,
    MIGRATION_DONE_VALUE,
  );
}

async function ensureIndexedDbMigration(): Promise<void> {
  if (!isIndexedDbSupported() || !isBrowser()) return;

  if (
    window.localStorage.getItem(STORAGE_KEYS.indexedDbMigration) ===
    MIGRATION_DONE_VALUE
  ) {
    return;
  }

  if (!migrationPromise) {
    migrationPromise = migrateLocalStorageToIndexedDb().catch((error) => {
      console.error("IndexedDB migration failed, using localStorage fallback", error);
    });
  }

  await migrationPromise;
}

export async function getPeriods(): Promise<Period[]> {
  if (!isIndexedDbSupported()) return getPeriodsFromLocalStorage();

  await ensureIndexedDbMigration();

  try {
    const periods = await getAllFromStore<Period>(STORES.periods);
    return periods.sort(byPeriodStartDateDesc);
  } catch (error) {
    console.error("Failed to read periods from IndexedDB", error);
    return getPeriodsFromLocalStorage();
  }
}

export async function savePeriod(period: Period): Promise<void> {
  if (!isIndexedDbSupported()) {
    savePeriodToLocalStorage(period);
    return;
  }

  await ensureIndexedDbMigration();

  try {
    await putInStore(STORES.periods, period);
  } catch (error) {
    console.error("Failed to save period in IndexedDB", error);
    savePeriodToLocalStorage(period);
  }
}

export async function deletePeriod(id: string): Promise<void> {
  if (!isIndexedDbSupported()) {
    deletePeriodFromLocalStorage(id);
    return;
  }

  await ensureIndexedDbMigration();

  try {
    await deleteFromStore(STORES.periods, id);
  } catch (error) {
    console.error("Failed to delete period in IndexedDB", error);
    deletePeriodFromLocalStorage(id);
  }
}

export async function getDailyLogs(): Promise<DailyLog[]> {
  if (!isIndexedDbSupported()) return getDailyLogsFromLocalStorage();

  await ensureIndexedDbMigration();

  try {
    const dailyLogs = await getAllFromStore<DailyLog>(STORES.dailyLogs);
    return dailyLogs.sort(byDailyLogDateDesc);
  } catch (error) {
    console.error("Failed to read daily logs from IndexedDB", error);
    return getDailyLogsFromLocalStorage();
  }
}

export async function saveDailyLog(dailyLog: DailyLog): Promise<void> {
  if (!isIndexedDbSupported()) {
    saveDailyLogToLocalStorage(dailyLog);
    return;
  }

  await ensureIndexedDbMigration();

  try {
    await putInStore(STORES.dailyLogs, dailyLog);
  } catch (error) {
    console.error("Failed to save daily log in IndexedDB", error);
    saveDailyLogToLocalStorage(dailyLog);
  }
}

export async function deleteDailyLog(id: string): Promise<void> {
  if (!isIndexedDbSupported()) {
    deleteDailyLogFromLocalStorage(id);
    return;
  }

  await ensureIndexedDbMigration();

  try {
    await deleteFromStore(STORES.dailyLogs, id);
  } catch (error) {
    console.error("Failed to delete daily log in IndexedDB", error);
    deleteDailyLogFromLocalStorage(id);
  }
}

export function getSettings(): Settings {
  if (!isBrowser()) return DEFAULT_SETTINGS;

  const raw = window.localStorage.getItem(STORAGE_KEYS.settings);
  if (!raw) return DEFAULT_SETTINGS;
  return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
}

export function saveSettings(settings: Settings): void {
  if (!isBrowser()) return;

  window.localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(settings));
}

export function getProfileSettings(): ProfileSettings {
  if (!isBrowser()) return DEFAULT_PROFILE_SETTINGS;

  const raw = window.localStorage.getItem(STORAGE_KEYS.profile);
  if (!raw) return DEFAULT_PROFILE_SETTINGS;
  return { ...DEFAULT_PROFILE_SETTINGS, ...JSON.parse(raw) };
}

export function saveProfileSettings(profile: ProfileSettings): void {
  if (!isBrowser()) return;

  window.localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(profile));
}

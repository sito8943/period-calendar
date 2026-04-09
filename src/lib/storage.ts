import { IndexedDBClient } from "@sito/dashboard-app";
import type { BaseEntityDto, BaseFilterDto } from "@sito/dashboard-app";

import type {
  AddDailyLogDto,
  AddPeriodDto,
  DailyLog,
  FlowLevel,
  MoodLevel,
  Period,
  ProfileSettings,
  Settings,
  SexualActivity,
  SexualProtection,
  SleepQuality,
  SymptomKey,
  UpdateDailyLogDto,
  UpdatePeriodDto,
} from "./types";
import {
  DEFAULT_PROFILE_SETTINGS,
  DEFAULT_SETTINGS,
  FLOW_LEVELS,
  SEXUAL_PROTECTION_OPTIONS,
  SYMPTOM_KEYS,
} from "./types";
import {
  getDailyLogsSupabaseClient,
  getPeriodsSupabaseClient,
  getSupabaseSessionUserId,
  isSupabaseConfigured,
} from "./supabase";
import type {
  DailyLogSupabaseAddDto,
  DailyLogSupabaseUpdateDto,
  PeriodSupabaseAddDto,
  PeriodSupabaseUpdateDto,
} from "./supabase";

const STORAGE_KEYS = {
  periods: "period-calendar:periods",
  dailyLogs: "period-calendar:daily-logs",
  settings: "period-calendar:settings",
  profile: "period-calendar:profile",
  migrationV2: "period-calendar:indexeddb-client-migrated:v2",
} as const;

const OFFLINE_DB_NAME = "period-calendar-offline-db";
const OFFLINE_DB_VERSION = 1;

const LEGACY_DB_NAME = "period-calendar-db";
const LEGACY_STORES = {
  periods: "periods",
  dailyLogs: "dailyLogs",
} as const;

const MIGRATION_DONE_VALUE = "done";
const SUPABASE_MIGRATION_VERSION = "v1";

type OfflineFilterDto = BaseFilterDto;

type PeriodEntityDto = BaseEntityDto & {
  startDate: string;
  endDate: string | null;
};

type PeriodEntityAddDto = Omit<PeriodEntityDto, "id">;
type PeriodImportPreviewDto = { existing?: boolean };

type DailyLogEntityDto = BaseEntityDto & {
  date: string;
  flow: FlowLevel | null;
  symptoms: SymptomKey[];
  sexualActivity: SexualActivity | null;
  mood: MoodLevel | null;
  sleepHours: number | null;
  sleepQuality: SleepQuality | null;
  notes: string;
};

type DailyLogEntityAddDto = Omit<DailyLogEntityDto, "id">;
type DailyLogImportPreviewDto = { existing?: boolean };

class PeriodsIndexedDbClient extends IndexedDBClient<
  "periods",
  PeriodEntityDto,
  PeriodEntityDto,
  PeriodEntityAddDto,
  PeriodEntityDto,
  OfflineFilterDto,
  PeriodImportPreviewDto
> {
  constructor() {
    super("periods", OFFLINE_DB_NAME, OFFLINE_DB_VERSION);
  }
}

class DailyLogsIndexedDbClient extends IndexedDBClient<
  "dailyLogs",
  DailyLogEntityDto,
  DailyLogEntityDto,
  DailyLogEntityAddDto,
  DailyLogEntityDto,
  OfflineFilterDto,
  DailyLogImportPreviewDto
> {
  constructor() {
    super("dailyLogs", OFFLINE_DB_NAME, OFFLINE_DB_VERSION);
  }
}

const periodsClient = new PeriodsIndexedDbClient();
const dailyLogsClient = new DailyLogsIndexedDbClient();

let migrationPromise: Promise<void> | null = null;

const flowSet = new Set<FlowLevel>(FLOW_LEVELS);
const symptomKeySet = new Set<SymptomKey>(SYMPTOM_KEYS);
const protectionSet = new Set<SexualProtection>(SEXUAL_PROTECTION_OPTIONS);

const isBrowser = (): boolean => typeof window !== "undefined";

const isIndexedDbSupported = (): boolean =>
  isBrowser() && typeof window.indexedDB !== "undefined";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const toIsoDatePattern = /^\d{4}-\d{2}-\d{2}$/;

const isIsoDate = (value: unknown): value is string =>
  typeof value === "string" && toIsoDatePattern.test(value);

const parseDateOrFallback = (value: unknown, fallback: Date): Date => {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value;
  }

  if (typeof value === "string" || typeof value === "number") {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }

  return fallback;
};

const parseNullableDate = (value: unknown): Date | null => {
  if (value === null || value === undefined || value === "") return null;
  const parsed = parseDateOrFallback(value, new Date(Number.NaN));
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed;
};

const parseNumericId = (id: string): number => {
  const numericId = Number(id);
  if (!Number.isInteger(numericId) || numericId <= 0) {
    throw new Error("Invalid entity id");
  }
  return numericId;
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

const normalizeFlowLevel = (value: unknown): FlowLevel | null => {
  if (typeof value !== "string") return null;
  return flowSet.has(value as FlowLevel) ? (value as FlowLevel) : null;
};

const normalizeSymptomKeys = (value: unknown): SymptomKey[] => {
  if (!Array.isArray(value)) return [];

  const normalized = new Set<SymptomKey>();
  for (const item of value) {
    if (typeof item === "string" && symptomKeySet.has(item as SymptomKey)) {
      normalized.add(item as SymptomKey);
    }
  }

  return [...normalized];
};

const normalizeSexualActivity = (value: unknown): SexualActivity | null => {
  if (!isRecord(value)) return null;

  const hadSex = Boolean(value.hadSex);
  if (!hadSex) return null;

  const protection =
    typeof value.protection === "string" &&
    protectionSet.has(value.protection as SexualProtection)
      ? (value.protection as SexualProtection)
      : "unknown";

  return {
    hadSex: true,
    protection,
  };
};

const normalizeMoodLevel = (value: unknown): MoodLevel | null => {
  if (typeof value !== "number") return null;
  if (!Number.isInteger(value)) return null;
  if (value < 1 || value > 5) return null;
  return value as MoodLevel;
};

const normalizeSleepQuality = (value: unknown): SleepQuality | null => {
  if (typeof value !== "number") return null;
  if (!Number.isInteger(value)) return null;
  if (value < 1 || value > 5) return null;
  return value as SleepQuality;
};

const normalizeSleepHours = (value: unknown): number | null => {
  if (typeof value !== "number") return null;
  if (!Number.isFinite(value)) return null;
  return value;
};

const normalizeString = (value: unknown): string =>
  typeof value === "string" ? value : "";

const toPeriodModel = (entity: PeriodEntityDto): Period => ({
  id: String(entity.id),
  startDate: entity.startDate,
  endDate: entity.endDate,
  createdAt: entity.createdAt.toISOString(),
  updatedAt: entity.updatedAt.toISOString(),
});

const toDailyLogModel = (entity: DailyLogEntityDto): DailyLog => ({
  id: String(entity.id),
  date: entity.date,
  flow: entity.flow,
  symptoms: entity.symptoms,
  sexualActivity: entity.sexualActivity,
  mood: entity.mood,
  sleepHours: entity.sleepHours,
  sleepQuality: entity.sleepQuality,
  notes: entity.notes,
  createdAt: entity.createdAt.toISOString(),
  updatedAt: entity.updatedAt.toISOString(),
});

const toPeriodEntityAddDto = (payload: {
  startDate: string;
  endDate?: string | null;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}): PeriodEntityAddDto | null => {
  if (!isIsoDate(payload.startDate)) return null;

  const now = new Date();
  const createdAt = parseDateOrFallback(payload.createdAt, now);
  const updatedAt = parseDateOrFallback(payload.updatedAt, createdAt);

  return {
    startDate: payload.startDate,
    endDate: isIsoDate(payload.endDate) ? payload.endDate : null,
    createdAt,
    updatedAt,
    deletedAt: parseNullableDate(payload.deletedAt),
  };
};

const toDailyLogEntityAddDto = (payload: {
  date: string;
  flow: unknown;
  symptoms: unknown;
  sexualActivity: unknown;
  mood: unknown;
  sleepHours: unknown;
  sleepQuality: unknown;
  notes: unknown;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}): DailyLogEntityAddDto | null => {
  if (!isIsoDate(payload.date)) return null;

  const now = new Date();
  const createdAt = parseDateOrFallback(payload.createdAt, now);
  const updatedAt = parseDateOrFallback(payload.updatedAt, createdAt);

  return {
    date: payload.date,
    flow: normalizeFlowLevel(payload.flow),
    symptoms: normalizeSymptomKeys(payload.symptoms),
    sexualActivity: normalizeSexualActivity(payload.sexualActivity),
    mood: normalizeMoodLevel(payload.mood),
    sleepHours: normalizeSleepHours(payload.sleepHours),
    sleepQuality: normalizeSleepQuality(payload.sleepQuality),
    notes: normalizeString(payload.notes),
    createdAt,
    updatedAt,
    deletedAt: parseNullableDate(payload.deletedAt),
  };
};

function getPeriodsFromLocalStorage(): Period[] {
  const rows = readJsonArrayFromLocalStorage<unknown>(STORAGE_KEYS.periods);
  const periods: Period[] = [];

  for (const row of rows) {
    if (!isRecord(row)) continue;
    if (typeof row.id !== "string" || !row.id.length) continue;
    if (!isIsoDate(row.startDate)) continue;

    const createdAt = parseDateOrFallback(row.createdAt, new Date()).toISOString();
    const updatedAt = parseDateOrFallback(row.updatedAt, new Date(createdAt)).toISOString();

    periods.push({
      id: row.id,
      startDate: row.startDate,
      endDate: isIsoDate(row.endDate) ? row.endDate : null,
      createdAt,
      updatedAt,
    });
  }

  return periods.sort(byPeriodStartDateDesc);
}

function getDailyLogsFromLocalStorage(): DailyLog[] {
  const rows = readJsonArrayFromLocalStorage<unknown>(STORAGE_KEYS.dailyLogs);
  const dailyLogs: DailyLog[] = [];

  for (const row of rows) {
    if (!isRecord(row)) continue;
    if (typeof row.id !== "string" || !row.id.length) continue;
    if (!isIsoDate(row.date)) continue;

    const createdAt = parseDateOrFallback(row.createdAt, new Date()).toISOString();
    const updatedAt = parseDateOrFallback(row.updatedAt, new Date(createdAt)).toISOString();

    dailyLogs.push({
      id: row.id,
      date: row.date,
      flow: normalizeFlowLevel(row.flow),
      symptoms: normalizeSymptomKeys(row.symptoms),
      sexualActivity: normalizeSexualActivity(row.sexualActivity),
      mood: normalizeMoodLevel(row.mood),
      sleepHours: normalizeSleepHours(row.sleepHours),
      sleepQuality: normalizeSleepQuality(row.sleepQuality),
      notes: normalizeString(row.notes),
      createdAt,
      updatedAt,
    });
  }

  return dailyLogs.sort(byDailyLogDateDesc);
}

function savePeriodsToLocalStorage(periods: Period[]): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(STORAGE_KEYS.periods, JSON.stringify(periods));
}

function saveDailyLogsToLocalStorage(dailyLogs: DailyLog[]): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(STORAGE_KEYS.dailyLogs, JSON.stringify(dailyLogs));
}

function addPeriodInLocalStorage(dto: AddPeriodDto): Period {
  const periods = getPeriodsFromLocalStorage();
  const now = new Date().toISOString();

  const period: Period = {
    id: crypto.randomUUID(),
    startDate: dto.startDate,
    endDate: dto.endDate ?? null,
    createdAt: now,
    updatedAt: now,
  };

  periods.push(period);
  savePeriodsToLocalStorage(periods);

  return period;
}

function updatePeriodInLocalStorage(dto: UpdatePeriodDto): Period {
  const periods = getPeriodsFromLocalStorage();
  const index = periods.findIndex((item) => item.id === dto.id);
  if (index < 0) throw new Error("Period not found");

  const updated: Period = {
    ...periods[index],
    startDate: dto.startDate,
    endDate: dto.endDate ?? null,
    updatedAt: new Date().toISOString(),
  };

  periods[index] = updated;
  savePeriodsToLocalStorage(periods);

  return updated;
}

function deletePeriodInLocalStorage(id: string): void {
  const periods = getPeriodsFromLocalStorage().filter((item) => item.id !== id);
  savePeriodsToLocalStorage(periods);
}

function addDailyLogInLocalStorage(dto: AddDailyLogDto): DailyLog {
  const dailyLogs = getDailyLogsFromLocalStorage();
  const duplicateDate = dailyLogs.find((item) => item.date === dto.date);
  if (duplicateDate) throw new Error("A daily log already exists for this date");

  const now = new Date().toISOString();
  const dailyLog: DailyLog = {
    id: crypto.randomUUID(),
    ...dto,
    createdAt: now,
    updatedAt: now,
  };

  dailyLogs.push(dailyLog);
  saveDailyLogsToLocalStorage(dailyLogs);

  return dailyLog;
}

function updateDailyLogInLocalStorage(dto: UpdateDailyLogDto): DailyLog {
  const dailyLogs = getDailyLogsFromLocalStorage();
  const index = dailyLogs.findIndex((item) => item.id === dto.id);
  if (index < 0) throw new Error("Daily log not found");

  const duplicateDate = dailyLogs.find(
    (item) => item.date === dto.date && item.id !== dto.id,
  );
  if (duplicateDate) throw new Error("A daily log already exists for this date");

  const updated: DailyLog = {
    ...dailyLogs[index],
    ...dto,
    updatedAt: new Date().toISOString(),
  };

  dailyLogs[index] = updated;
  saveDailyLogsToLocalStorage(dailyLogs);

  return updated;
}

function deleteDailyLogInLocalStorage(id: string): void {
  const dailyLogs = getDailyLogsFromLocalStorage().filter((item) => item.id !== id);
  saveDailyLogsToLocalStorage(dailyLogs);
}

async function readLegacyIndexedDbStore<T>(storeName: string): Promise<T[]> {
  if (!isIndexedDbSupported()) return [];

  return new Promise((resolve) => {
    const request = window.indexedDB.open(LEGACY_DB_NAME);

    const finalize = (value: T[]): void => {
      resolve(value);
    };

    request.onerror = () => {
      finalize([]);
    };

    request.onsuccess = () => {
      const db = request.result;

      if (!db.objectStoreNames.contains(storeName)) {
        db.close();
        finalize([]);
        return;
      }

      const transaction = db.transaction(storeName, "readonly");
      const store = transaction.objectStore(storeName);
      const getAllRequest = store.getAll();

      getAllRequest.onerror = () => {
        db.close();
        finalize([]);
      };

      getAllRequest.onsuccess = () => {
        const rows = Array.isArray(getAllRequest.result)
          ? (getAllRequest.result as T[])
          : [];
        db.close();
        finalize(rows);
      };
    };

    request.onupgradeneeded = () => {
      // legacy DB does not exist in this browser profile
    };
  });
}

const dedupePeriods = (rows: PeriodEntityAddDto[]): PeriodEntityAddDto[] => {
  const map = new Map<string, PeriodEntityAddDto>();

  for (const row of rows) {
    const key = `${row.startDate}|${row.endDate ?? ""}|${row.createdAt.toISOString()}`;
    map.set(key, row);
  }

  return [...map.values()];
};

const dedupeDailyLogs = (rows: DailyLogEntityAddDto[]): DailyLogEntityAddDto[] => {
  const map = new Map<string, DailyLogEntityAddDto>();

  for (const row of rows) {
    const existing = map.get(row.date);
    if (!existing || existing.updatedAt.getTime() < row.updatedAt.getTime()) {
      map.set(row.date, row);
    }
  }

  return [...map.values()];
};

const normalizeLegacyPeriodRows = (rows: unknown[]): PeriodEntityAddDto[] => {
  const normalized: PeriodEntityAddDto[] = [];

  for (const row of rows) {
    if (!isRecord(row)) continue;

    const dto = toPeriodEntityAddDto({
      startDate: normalizeString(row.startDate),
      endDate: row.endDate as string | null | undefined,
      createdAt: typeof row.createdAt === "string" ? row.createdAt : undefined,
      updatedAt: typeof row.updatedAt === "string" ? row.updatedAt : undefined,
      deletedAt:
        typeof row.deletedAt === "string" || row.deletedAt === null
          ? (row.deletedAt as string | null)
          : null,
    });

    if (dto) normalized.push(dto);
  }

  return normalized;
};

const normalizeLegacyDailyLogRows = (rows: unknown[]): DailyLogEntityAddDto[] => {
  const normalized: DailyLogEntityAddDto[] = [];

  for (const row of rows) {
    if (!isRecord(row)) continue;

    const dto = toDailyLogEntityAddDto({
      date: normalizeString(row.date),
      flow: row.flow,
      symptoms: row.symptoms,
      sexualActivity: row.sexualActivity,
      mood: row.mood,
      sleepHours: row.sleepHours,
      sleepQuality: row.sleepQuality,
      notes: row.notes,
      createdAt: typeof row.createdAt === "string" ? row.createdAt : undefined,
      updatedAt: typeof row.updatedAt === "string" ? row.updatedAt : undefined,
      deletedAt:
        typeof row.deletedAt === "string" || row.deletedAt === null
          ? (row.deletedAt as string | null)
          : null,
    });

    if (dto) normalized.push(dto);
  }

  return normalized;
};

async function runOfflineMigration(): Promise<void> {
  if (!isBrowser() || !isIndexedDbSupported()) return;

  if (window.localStorage.getItem(STORAGE_KEYS.migrationV2) === MIGRATION_DONE_VALUE) {
    return;
  }

  const [currentPeriods, currentDailyLogs] = await Promise.all([
    periodsClient.get(undefined, { softDeleteScope: "ALL" }),
    dailyLogsClient.get(undefined, { softDeleteScope: "ALL" }),
  ]);

  const shouldMigratePeriods = currentPeriods.items.length === 0;
  const shouldMigrateDailyLogs = currentDailyLogs.items.length === 0;

  if (!shouldMigratePeriods && !shouldMigrateDailyLogs) {
    window.localStorage.setItem(STORAGE_KEYS.migrationV2, MIGRATION_DONE_VALUE);
    return;
  }

  const [
    localPeriodsRows,
    localDailyLogRows,
    legacyIndexedDbPeriodsRows,
    legacyIndexedDbDailyLogRows,
  ] = await Promise.all([
    readJsonArrayFromLocalStorage<unknown>(STORAGE_KEYS.periods),
    readJsonArrayFromLocalStorage<unknown>(STORAGE_KEYS.dailyLogs),
    readLegacyIndexedDbStore<unknown>(LEGACY_STORES.periods),
    readLegacyIndexedDbStore<unknown>(LEGACY_STORES.dailyLogs),
  ]);

  if (shouldMigratePeriods) {
    const periodsToMigrate = dedupePeriods(
      normalizeLegacyPeriodRows([...localPeriodsRows, ...legacyIndexedDbPeriodsRows]),
    );

    for (const period of periodsToMigrate) {
      await periodsClient.insert(period);
    }
  }

  if (shouldMigrateDailyLogs) {
    const dailyLogsToMigrate = dedupeDailyLogs(
      normalizeLegacyDailyLogRows([
        ...localDailyLogRows,
        ...legacyIndexedDbDailyLogRows,
      ]),
    );

    for (const dailyLog of dailyLogsToMigrate) {
      await dailyLogsClient.insert(dailyLog);
    }
  }

  window.localStorage.setItem(STORAGE_KEYS.migrationV2, MIGRATION_DONE_VALUE);
}

async function ensureOfflineMigration(): Promise<void> {
  if (!isIndexedDbSupported() || !isBrowser()) return;

  if (window.localStorage.getItem(STORAGE_KEYS.migrationV2) === MIGRATION_DONE_VALUE) {
    return;
  }

  if (!migrationPromise) {
    migrationPromise = runOfflineMigration().catch((error) => {
      console.error("Offline migration failed, falling back to localStorage", error);
    });
  }

  await migrationPromise;
}

const supabaseMigrationPromises = new Map<string, Promise<void>>();

const getSupabaseMigrationKey = (userId: string): string =>
  `period-calendar:supabase-migrated:${SUPABASE_MIGRATION_VERSION}:${userId}`;

const getCurrentSupabaseUserId = async (): Promise<string | null> => {
  if (!isBrowser() || !isSupabaseConfigured()) return null;

  try {
    return await getSupabaseSessionUserId();
  } catch (error) {
    console.error("Failed to get Supabase auth session", error);
    return null;
  }
};

async function getPeriodsFromOfflineStore(): Promise<Period[]> {
  if (!isIndexedDbSupported()) return getPeriodsFromLocalStorage();

  await ensureOfflineMigration();

  try {
    const result = await periodsClient.get(undefined, { softDeleteScope: "ACTIVE" });
    return result.items.map(toPeriodModel).sort(byPeriodStartDateDesc);
  } catch (error) {
    console.error("Failed to read periods from IndexedDBClient", error);
    return getPeriodsFromLocalStorage();
  }
}

async function addPeriodToOfflineStore(dto: AddPeriodDto): Promise<Period> {
  if (!isIndexedDbSupported()) return addPeriodInLocalStorage(dto);

  await ensureOfflineMigration();

  const addDto = toPeriodEntityAddDto({
    startDate: dto.startDate,
    endDate: dto.endDate ?? null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deletedAt: null,
  });

  if (!addDto) {
    throw new Error("Invalid period payload");
  }

  const created = await periodsClient.insert(addDto);
  return toPeriodModel(created);
}

async function updatePeriodInOfflineStore(dto: UpdatePeriodDto): Promise<Period> {
  if (!isIndexedDbSupported()) return updatePeriodInLocalStorage(dto);

  await ensureOfflineMigration();

  const id = parseNumericId(dto.id);
  const existing = await periodsClient.getById(id);

  const updated = await periodsClient.update({
    ...existing,
    startDate: dto.startDate,
    endDate: dto.endDate ?? null,
    updatedAt: new Date(),
  });

  return toPeriodModel(updated);
}

async function deletePeriodFromOfflineStore(id: string): Promise<void> {
  if (!isIndexedDbSupported()) {
    deletePeriodInLocalStorage(id);
    return;
  }

  await ensureOfflineMigration();

  const numericId = parseNumericId(id);
  await periodsClient.softDelete([numericId]);
}

async function getDailyLogsFromOfflineStore(): Promise<DailyLog[]> {
  if (!isIndexedDbSupported()) return getDailyLogsFromLocalStorage();

  await ensureOfflineMigration();

  try {
    const result = await dailyLogsClient.get(undefined, { softDeleteScope: "ACTIVE" });
    return result.items.map(toDailyLogModel).sort(byDailyLogDateDesc);
  } catch (error) {
    console.error("Failed to read daily logs from IndexedDBClient", error);
    return getDailyLogsFromLocalStorage();
  }
}

async function addDailyLogToOfflineStore(dto: AddDailyLogDto): Promise<DailyLog> {
  if (!isIndexedDbSupported()) return addDailyLogInLocalStorage(dto);

  await ensureOfflineMigration();

  const existingDailyLogs = await getDailyLogs();
  const duplicateDate = existingDailyLogs.find((item) => item.date === dto.date);
  if (duplicateDate) {
    throw new Error("A daily log already exists for this date");
  }

  const addDto = toDailyLogEntityAddDto({
    ...dto,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deletedAt: null,
  });

  if (!addDto) {
    throw new Error("Invalid daily log payload");
  }

  const created = await dailyLogsClient.insert(addDto);
  return toDailyLogModel(created);
}

async function updateDailyLogInOfflineStore(
  dto: UpdateDailyLogDto,
): Promise<DailyLog> {
  if (!isIndexedDbSupported()) return updateDailyLogInLocalStorage(dto);

  await ensureOfflineMigration();

  const id = parseNumericId(dto.id);

  const existingDailyLogs = await getDailyLogs();
  const duplicateDate = existingDailyLogs.find(
    (item) => item.date === dto.date && item.id !== dto.id,
  );
  if (duplicateDate) {
    throw new Error("A daily log already exists for this date");
  }

  const existing = await dailyLogsClient.getById(id);

  const updated = await dailyLogsClient.update({
    ...existing,
    date: dto.date,
    flow: dto.flow,
    symptoms: [...new Set(dto.symptoms)],
    sexualActivity: dto.sexualActivity,
    mood: dto.mood,
    sleepHours: dto.sleepHours,
    sleepQuality: dto.sleepQuality,
    notes: dto.notes,
    updatedAt: new Date(),
  });

  return toDailyLogModel(updated);
}

async function deleteDailyLogFromOfflineStore(id: string): Promise<void> {
  if (!isIndexedDbSupported()) {
    deleteDailyLogInLocalStorage(id);
    return;
  }

  await ensureOfflineMigration();

  const numericId = parseNumericId(id);
  await dailyLogsClient.softDelete([numericId]);
}

async function ensureSupabaseSeedFromOffline(userId: string): Promise<void> {
  if (!isBrowser()) return;

  const migrationKey = getSupabaseMigrationKey(userId);
  if (window.localStorage.getItem(migrationKey) === MIGRATION_DONE_VALUE) {
    return;
  }

  const runningMigration = supabaseMigrationPromises.get(userId);
  if (runningMigration) {
    await runningMigration;
    return;
  }

  const migrationTask = (async () => {
    const periodsSupabaseClient = getPeriodsSupabaseClient();
    const dailyLogsSupabaseClient = getDailyLogsSupabaseClient();

    if (!periodsSupabaseClient || !dailyLogsSupabaseClient) return;

    const [periodsRemote, dailyLogsRemote] = await Promise.all([
      periodsSupabaseClient.get(
        { currentPage: 0, pageSize: 1 },
        { user_id: userId, softDeleteScope: "ALL" },
      ),
      dailyLogsSupabaseClient.get(
        { currentPage: 0, pageSize: 1 },
        { user_id: userId, softDeleteScope: "ALL" },
      ),
    ]);

    if (periodsRemote.totalElements > 0 || dailyLogsRemote.totalElements > 0) {
      window.localStorage.setItem(migrationKey, MIGRATION_DONE_VALUE);
      return;
    }

    const [periodsLocal, dailyLogsLocal] = await Promise.all([
      getPeriodsFromOfflineStore(),
      getDailyLogsFromOfflineStore(),
    ]);

    if (periodsLocal.length > 0) {
      const periodRows: PeriodSupabaseAddDto[] = periodsLocal.map((item) => ({
        userId,
        startDate: item.startDate,
        endDate: item.endDate,
        createdAt: parseDateOrFallback(item.createdAt, new Date()),
        updatedAt: parseDateOrFallback(item.updatedAt, new Date()),
        deletedAt: null,
      }));
      await periodsSupabaseClient.insertMany(periodRows);
    }

    if (dailyLogsLocal.length > 0) {
      const dailyLogRows: DailyLogSupabaseAddDto[] = dailyLogsLocal.map(
        (item) => ({
          userId,
          date: item.date,
          flow: item.flow,
          symptoms: [...new Set(item.symptoms)],
          sexualActivity: item.sexualActivity,
          mood: item.mood,
          sleepHours: item.sleepHours,
          sleepQuality: item.sleepQuality,
          notes: item.notes,
          createdAt: parseDateOrFallback(item.createdAt, new Date()),
          updatedAt: parseDateOrFallback(item.updatedAt, new Date()),
          deletedAt: null,
        }),
      );
      await dailyLogsSupabaseClient.insertMany(dailyLogRows);
    }

    window.localStorage.setItem(migrationKey, MIGRATION_DONE_VALUE);
  })().finally(() => {
    supabaseMigrationPromises.delete(userId);
  });

  supabaseMigrationPromises.set(userId, migrationTask);
  await migrationTask;
}

async function getPeriodsFromSupabase(userId: string): Promise<Period[]> {
  const periodsSupabaseClient = getPeriodsSupabaseClient();
  if (!periodsSupabaseClient) {
    throw new Error("Supabase periods client is not available");
  }

  const result = await periodsSupabaseClient.export({
    user_id: userId,
    softDeleteScope: "ACTIVE",
  });

  return result.map(toPeriodModel).sort(byPeriodStartDateDesc);
}

async function addPeriodToSupabase(
  userId: string,
  dto: AddPeriodDto,
): Promise<Period> {
  const periodsSupabaseClient = getPeriodsSupabaseClient();
  if (!periodsSupabaseClient) {
    throw new Error("Supabase periods client is not available");
  }

  const addDto = toPeriodEntityAddDto({
    startDate: dto.startDate,
    endDate: dto.endDate ?? null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deletedAt: null,
  });

  if (!addDto) {
    throw new Error("Invalid period payload");
  }

  const created = await periodsSupabaseClient.insert({
    ...addDto,
    userId,
  });

  return toPeriodModel(created);
}

async function updatePeriodInSupabase(
  dto: UpdatePeriodDto,
): Promise<Period> {
  const periodsSupabaseClient = getPeriodsSupabaseClient();
  if (!periodsSupabaseClient) {
    throw new Error("Supabase periods client is not available");
  }

  const payload: PeriodSupabaseUpdateDto = {
    id: parseNumericId(dto.id),
    startDate: dto.startDate,
    endDate: dto.endDate ?? null,
    updatedAt: new Date(),
  };

  const updated = await periodsSupabaseClient.update(payload);
  return toPeriodModel(updated);
}

async function deletePeriodFromSupabase(id: string): Promise<void> {
  const periodsSupabaseClient = getPeriodsSupabaseClient();
  if (!periodsSupabaseClient) {
    throw new Error("Supabase periods client is not available");
  }

  const numericId = parseNumericId(id);
  await periodsSupabaseClient.softDelete([numericId]);
}

async function getDailyLogsFromSupabase(userId: string): Promise<DailyLog[]> {
  const dailyLogsSupabaseClient = getDailyLogsSupabaseClient();
  if (!dailyLogsSupabaseClient) {
    throw new Error("Supabase daily logs client is not available");
  }

  const result = await dailyLogsSupabaseClient.export({
    user_id: userId,
    softDeleteScope: "ACTIVE",
  });

  return result.map(toDailyLogModel).sort(byDailyLogDateDesc);
}

async function addDailyLogToSupabase(
  userId: string,
  dto: AddDailyLogDto,
): Promise<DailyLog> {
  const dailyLogsSupabaseClient = getDailyLogsSupabaseClient();
  if (!dailyLogsSupabaseClient) {
    throw new Error("Supabase daily logs client is not available");
  }

  const duplicateByDate = await dailyLogsSupabaseClient.export({
    user_id: userId,
    date: dto.date,
    softDeleteScope: "ACTIVE",
  });
  if (duplicateByDate.length > 0) {
    throw new Error("A daily log already exists for this date");
  }

  const addDto = toDailyLogEntityAddDto({
    ...dto,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deletedAt: null,
  });

  if (!addDto) {
    throw new Error("Invalid daily log payload");
  }

  const created = await dailyLogsSupabaseClient.insert({
    ...addDto,
    userId,
  });
  return toDailyLogModel(created);
}

async function updateDailyLogInSupabase(
  userId: string,
  dto: UpdateDailyLogDto,
): Promise<DailyLog> {
  const dailyLogsSupabaseClient = getDailyLogsSupabaseClient();
  if (!dailyLogsSupabaseClient) {
    throw new Error("Supabase daily logs client is not available");
  }

  const duplicateByDate = await dailyLogsSupabaseClient.export({
    user_id: userId,
    date: dto.date,
    softDeleteScope: "ACTIVE",
  });

  const hasDuplicate = duplicateByDate.some((item) => String(item.id) !== dto.id);
  if (hasDuplicate) {
    throw new Error("A daily log already exists for this date");
  }

  const payload: DailyLogSupabaseUpdateDto = {
    id: parseNumericId(dto.id),
    date: dto.date,
    flow: dto.flow,
    symptoms: [...new Set(dto.symptoms)],
    sexualActivity: dto.sexualActivity,
    mood: dto.mood,
    sleepHours: dto.sleepHours,
    sleepQuality: dto.sleepQuality,
    notes: dto.notes,
    updatedAt: new Date(),
  };

  const updated = await dailyLogsSupabaseClient.update(payload);
  return toDailyLogModel(updated);
}

async function deleteDailyLogFromSupabase(id: string): Promise<void> {
  const dailyLogsSupabaseClient = getDailyLogsSupabaseClient();
  if (!dailyLogsSupabaseClient) {
    throw new Error("Supabase daily logs client is not available");
  }

  const numericId = parseNumericId(id);
  await dailyLogsSupabaseClient.softDelete([numericId]);
}

export async function getPeriods(): Promise<Period[]> {
  const userId = await getCurrentSupabaseUserId();

  if (userId) {
    try {
      await ensureSupabaseSeedFromOffline(userId);
      return await getPeriodsFromSupabase(userId);
    } catch (error) {
      console.error("Supabase periods read failed, using offline store", error);
    }
  }

  return getPeriodsFromOfflineStore();
}

export async function addPeriod(dto: AddPeriodDto): Promise<Period> {
  const userId = await getCurrentSupabaseUserId();

  if (userId) {
    try {
      await ensureSupabaseSeedFromOffline(userId);
      return await addPeriodToSupabase(userId, dto);
    } catch (error) {
      console.error("Supabase add period failed, using offline store", error);
    }
  }

  return addPeriodToOfflineStore(dto);
}

export async function updatePeriod(dto: UpdatePeriodDto): Promise<Period> {
  const userId = await getCurrentSupabaseUserId();

  if (userId) {
    try {
      await ensureSupabaseSeedFromOffline(userId);
      return await updatePeriodInSupabase(dto);
    } catch (error) {
      console.error("Supabase update period failed, using offline store", error);
    }
  }

  return updatePeriodInOfflineStore(dto);
}

export async function deletePeriod(id: string): Promise<void> {
  const userId = await getCurrentSupabaseUserId();

  if (userId) {
    try {
      await ensureSupabaseSeedFromOffline(userId);
      await deletePeriodFromSupabase(id);
      return;
    } catch (error) {
      console.error("Supabase delete period failed, using offline store", error);
    }
  }

  await deletePeriodFromOfflineStore(id);
}

export async function getDailyLogs(): Promise<DailyLog[]> {
  const userId = await getCurrentSupabaseUserId();

  if (userId) {
    try {
      await ensureSupabaseSeedFromOffline(userId);
      return await getDailyLogsFromSupabase(userId);
    } catch (error) {
      console.error("Supabase daily logs read failed, using offline store", error);
    }
  }

  return getDailyLogsFromOfflineStore();
}

export async function addDailyLog(dto: AddDailyLogDto): Promise<DailyLog> {
  const userId = await getCurrentSupabaseUserId();

  if (userId) {
    try {
      await ensureSupabaseSeedFromOffline(userId);
      return await addDailyLogToSupabase(userId, dto);
    } catch (error) {
      console.error("Supabase add daily log failed, using offline store", error);
    }
  }

  return addDailyLogToOfflineStore(dto);
}

export async function updateDailyLog(dto: UpdateDailyLogDto): Promise<DailyLog> {
  const userId = await getCurrentSupabaseUserId();

  if (userId) {
    try {
      await ensureSupabaseSeedFromOffline(userId);
      return await updateDailyLogInSupabase(userId, dto);
    } catch (error) {
      console.error("Supabase update daily log failed, using offline store", error);
    }
  }

  return updateDailyLogInOfflineStore(dto);
}

export async function deleteDailyLog(id: string): Promise<void> {
  const userId = await getCurrentSupabaseUserId();

  if (userId) {
    try {
      await ensureSupabaseSeedFromOffline(userId);
      await deleteDailyLogFromSupabase(id);
      return;
    } catch (error) {
      console.error("Supabase delete daily log failed, using offline store", error);
    }
  }

  await deleteDailyLogFromOfflineStore(id);
}

export function getSettings(): Settings {
  if (!isBrowser()) return DEFAULT_SETTINGS;

  const raw = window.localStorage.getItem(STORAGE_KEYS.settings);
  if (!raw) return DEFAULT_SETTINGS;

  try {
    return { ...DEFAULT_SETTINGS, ...(JSON.parse(raw) as Partial<Settings>) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: Settings): void {
  if (!isBrowser()) return;

  window.localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(settings));
}

export function getProfileSettings(): ProfileSettings {
  if (!isBrowser()) return DEFAULT_PROFILE_SETTINGS;

  const raw = window.localStorage.getItem(STORAGE_KEYS.profile);
  if (!raw) return DEFAULT_PROFILE_SETTINGS;

  try {
    return {
      ...DEFAULT_PROFILE_SETTINGS,
      ...(JSON.parse(raw) as Partial<ProfileSettings>),
    };
  } catch {
    return DEFAULT_PROFILE_SETTINGS;
  }
}

export function saveProfileSettings(profile: ProfileSettings): void {
  if (!isBrowser()) return;

  window.localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(profile));
}

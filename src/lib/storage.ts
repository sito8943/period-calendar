import type {
  AddDailyLogDto,
  AddPeriodDto,
  DailyLog,
  Period,
  ProfileLanguage,
  ProfileSettings,
  Settings,
  UpdateDailyLogDto,
  UpdatePeriodDto,
} from "./types";
import type { PeriodTheme } from "./theme";
import { DEFAULT_PROFILE_SETTINGS, DEFAULT_SETTINGS } from "./types";
import {
  getDailyLogsSupabaseClient,
  getPeriodsSupabaseClient,
  getSupabaseSessionUserId,
  isSupabaseConfigured,
  supabase,
} from "./supabase";
import type {
  DailyLogEntityAddDto,
  DailyLogEntityDto,
  DailyLogSupabaseUpdateDto,
  PeriodEntityAddDto,
  PeriodEntityDto,
  PeriodSupabaseUpdateDto,
} from "./supabase";

const STORAGE_KEYS = {
  settings: "period-calendar:settings",
} as const;

const isBrowser = (): boolean => typeof window !== "undefined";

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

const normalizeProfileLanguage = (value: unknown): ProfileLanguage =>
  String(value).toLowerCase().startsWith("en") ? "en" : "es";

const normalizeProfileTheme = (value: unknown): PeriodTheme =>
  value === "boy" ? "boy" : "girl";

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

const toDailyLogEntityAddDto = (
  payload: AddDailyLogDto & {
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string | null;
  },
): DailyLogEntityAddDto | null => {
  if (!isIsoDate(payload.date)) return null;

  const now = new Date();
  const createdAt = parseDateOrFallback(payload.createdAt, now);
  const updatedAt = parseDateOrFallback(payload.updatedAt, createdAt);

  return {
    date: payload.date,
    flow: payload.flow,
    symptoms: [...new Set(payload.symptoms)],
    sexualActivity: payload.sexualActivity,
    mood: payload.mood,
    sleepHours: payload.sleepHours,
    sleepQuality: payload.sleepQuality,
    notes: payload.notes,
    createdAt,
    updatedAt,
    deletedAt: parseNullableDate(payload.deletedAt),
  };
};

const getCurrentSupabaseUserId = async (): Promise<string | null> => {
  if (!isBrowser() || !isSupabaseConfigured()) return null;

  try {
    return await getSupabaseSessionUserId();
  } catch (error) {
    console.error("Failed to get Supabase auth session", error);
    return null;
  }
};

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

async function updatePeriodInSupabase(dto: UpdatePeriodDto): Promise<Period> {
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

  const hasDuplicate = duplicateByDate.some(
    (item) => String(item.id) !== dto.id,
  );
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

type ProfileSettingsSupabaseRow = {
  name: string | null;
  partner_name: string | null;
  language: string | null;
  theme: string | null;
  updated_at: string | null;
};

const mapProfileSettingsSupabaseRow = (
  row: ProfileSettingsSupabaseRow | null,
): ProfileSettings | null => {
  if (!row) return null;

  return {
    name: row.name ?? "",
    partnerName: row.partner_name ?? "",
    language: normalizeProfileLanguage(row.language),
    theme: normalizeProfileTheme(row.theme),
    updatedAt: row.updated_at ?? "",
  };
};

async function getProfileSettingsFromSupabase(
  userId: string,
): Promise<ProfileSettings | null> {
  if (!supabase) {
    throw new Error("Supabase client is not available");
  }

  const { data, error } = await supabase
    .from("profile_settings")
    .select("name, partner_name, language, theme, updated_at")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return mapProfileSettingsSupabaseRow(
    (data as ProfileSettingsSupabaseRow | null) ?? null,
  );
}

async function saveProfileSettingsToSupabase(
  userId: string,
  profile: ProfileSettings,
): Promise<ProfileSettings> {
  if (!supabase) {
    throw new Error("Supabase client is not available");
  }

  const payload = {
    user_id: userId,
    name: profile.name,
    partner_name: profile.partnerName,
    language: profile.language,
    theme: profile.theme,
    updated_at: profile.updatedAt,
  };

  const { data, error } = await supabase
    .from("profile_settings")
    .upsert(payload, { onConflict: "user_id" })
    .select("name, partner_name, language, theme, updated_at")
    .single();

  if (error) {
    throw error;
  }

  const saved = mapProfileSettingsSupabaseRow(
    (data as ProfileSettingsSupabaseRow | null) ?? null,
  );
  if (!saved) return profile;
  return saved;
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

export const storageCore = {
  getCurrentSupabaseUserId,
  getPeriodsFromSupabase,
  addPeriodToSupabase,
  updatePeriodInSupabase,
  deletePeriodFromSupabase,
  getDailyLogsFromSupabase,
  addDailyLogToSupabase,
  updateDailyLogInSupabase,
  deleteDailyLogFromSupabase,
  getProfileSettingsFromSupabase,
  saveProfileSettingsToSupabase,
  defaultProfileSettings: DEFAULT_PROFILE_SETTINGS,
  getSettings,
  saveSettings,
} as const;

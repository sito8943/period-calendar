import type { DailyLog, Period, ProfileSettings, Settings } from "./types";
import { DEFAULT_PROFILE_SETTINGS, DEFAULT_SETTINGS } from "./types";

const STORAGE_KEYS = {
  periods: "period-calendar:periods",
  dailyLogs: "period-calendar:daily-logs",
  settings: "period-calendar:settings",
  profile: "period-calendar:profile",
} as const;

export function getPeriods(): Period[] {
  const raw = localStorage.getItem(STORAGE_KEYS.periods);
  if (!raw) return [];
  const periods: Period[] = JSON.parse(raw);
  return periods.sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
  );
}

export function savePeriod(period: Period): void {
  const periods = getPeriods();
  const index = periods.findIndex((p) => p.id === period.id);
  if (index >= 0) {
    periods[index] = period;
  } else {
    periods.push(period);
  }
  localStorage.setItem(STORAGE_KEYS.periods, JSON.stringify(periods));
}

export function deletePeriod(id: string): void {
  const periods = getPeriods().filter((p) => p.id !== id);
  localStorage.setItem(STORAGE_KEYS.periods, JSON.stringify(periods));
}

export function getDailyLogs(): DailyLog[] {
  const raw = localStorage.getItem(STORAGE_KEYS.dailyLogs);
  if (!raw) return [];
  const dailyLogs: DailyLog[] = JSON.parse(raw);
  return dailyLogs.sort((a, b) => b.date.localeCompare(a.date));
}

export function saveDailyLog(dailyLog: DailyLog): void {
  const dailyLogs = getDailyLogs();
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
  localStorage.setItem(STORAGE_KEYS.dailyLogs, JSON.stringify(dailyLogs));
}

export function deleteDailyLog(id: string): void {
  const dailyLogs = getDailyLogs().filter((item) => item.id !== id);
  localStorage.setItem(STORAGE_KEYS.dailyLogs, JSON.stringify(dailyLogs));
}

export function getSettings(): Settings {
  const raw = localStorage.getItem(STORAGE_KEYS.settings);
  if (!raw) return DEFAULT_SETTINGS;
  return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
}

export function saveSettings(settings: Settings): void {
  localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(settings));
}

export function getProfileSettings(): ProfileSettings {
  const raw = localStorage.getItem(STORAGE_KEYS.profile);
  if (!raw) return DEFAULT_PROFILE_SETTINGS;
  return { ...DEFAULT_PROFILE_SETTINGS, ...JSON.parse(raw) };
}

export function saveProfileSettings(profile: ProfileSettings): void {
  localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(profile));
}

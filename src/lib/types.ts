import type { PeriodTheme } from "./theme";

export interface Period {
  id: string;
  startDate: string; // YYYY-MM-DD
  endDate: string | null; // YYYY-MM-DD
  createdAt: string; // ISO datetime
  updatedAt: string; // ISO datetime
}

export const FLOW_LEVELS = ["none", "light", "medium", "heavy"] as const;
export type FlowLevel = (typeof FLOW_LEVELS)[number];

export const SYMPTOM_KEYS = [
  "cramps",
  "mood_swings",
  "acne",
  "headache",
  "bloating",
  "back_pain",
  "fatigue",
] as const;
export type SymptomKey = (typeof SYMPTOM_KEYS)[number];

export const SEXUAL_PROTECTION_OPTIONS = [
  "unknown",
  "none",
  "condom",
  "pill",
  "iud",
  "other",
] as const;
export type SexualProtection = (typeof SEXUAL_PROTECTION_OPTIONS)[number];

export type MoodLevel = 1 | 2 | 3 | 4 | 5;
export type SleepQuality = 1 | 2 | 3 | 4 | 5;

export interface SexualActivity {
  hadSex: boolean;
  protection: SexualProtection;
}

export interface DailyLogInput {
  date: string; // YYYY-MM-DD
  flow: FlowLevel | null;
  symptoms: SymptomKey[];
  sexualActivity: SexualActivity | null;
  mood: MoodLevel | null;
  sleepHours: number | null;
  sleepQuality: SleepQuality | null;
  notes: string;
}

export interface DailyLog extends DailyLogInput {
  id: string;
  createdAt: string; // ISO datetime
  updatedAt: string; // ISO datetime
}

export interface AddPeriodDto {
  startDate: string;
  endDate?: string | null;
}

export interface UpdatePeriodDto {
  id: string;
  startDate: string;
  endDate?: string | null;
}

export type AddDailyLogDto = DailyLogInput;

export interface UpdateDailyLogDto extends DailyLogInput {
  id: string;
}

export interface Settings {
  defaultCycleLength: number;
  defaultPeriodLength: number;
}

export type ProfileLanguage = "es" | "en";

export interface ProfileSettings {
  name: string;
  partnerName: string;
  language: ProfileLanguage;
  theme: PeriodTheme;
  updatedAt: string;
}

export const DEFAULT_SETTINGS: Settings = {
  defaultCycleLength: 28,
  defaultPeriodLength: 5,
};

export const DEFAULT_PROFILE_SETTINGS: ProfileSettings = {
  name: "",
  partnerName: "",
  language: "es",
  theme: "girl",
  updatedAt: "",
};

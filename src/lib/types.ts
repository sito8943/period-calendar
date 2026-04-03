export interface Period {
  id: string;
  startDate: string; // YYYY-MM-DD
  endDate: string | null; // YYYY-MM-DD
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

export interface Settings {
  defaultCycleLength: number;
  defaultPeriodLength: number;
}

export type ProfileLanguage = "es" | "en";

export interface ProfileSettings {
  name: string;
  language: ProfileLanguage;
  updatedAt: string;
}

export const DEFAULT_SETTINGS: Settings = {
  defaultCycleLength: 28,
  defaultPeriodLength: 5,
};

export const DEFAULT_PROFILE_SETTINGS: ProfileSettings = {
  name: "",
  language: "es",
  updatedAt: "",
};

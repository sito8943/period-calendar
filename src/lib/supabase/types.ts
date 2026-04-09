import type {
  BaseEntityDto,
  BaseFilterDto,
  DeleteDto,
  ImportPreviewDto,
} from "@sito/dashboard-app";

import type {
  FlowLevel,
  MoodLevel,
  SexualActivity,
  SleepQuality,
  SymptomKey,
} from "../types";

export type PeriodEntityDto = BaseEntityDto & {
  startDate: string;
  endDate: string | null;
};

export type PeriodEntityAddDto = Omit<PeriodEntityDto, "id">;

export type PeriodSupabaseRow = {
  id: number;
  user_id: string;
  start_date: string;
  end_date: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type PeriodSupabaseFilterDto = BaseFilterDto & {
  user_id?: string;
  start_date?: string;
  end_date?: string | null;
};

export type PeriodSupabaseImportPreviewDto = ImportPreviewDto & {
  id?: number;
  userId?: string;
  startDate?: string;
  endDate?: string | null;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
};

export type PeriodSupabaseAddDto = PeriodEntityAddDto & {
  userId: string;
};

export interface PeriodSupabaseUpdateDto extends DeleteDto {
  startDate: string;
  endDate: string | null;
  updatedAt: Date;
}

export type DailyLogEntityDto = BaseEntityDto & {
  date: string;
  flow: FlowLevel | null;
  symptoms: SymptomKey[];
  sexualActivity: SexualActivity | null;
  mood: MoodLevel | null;
  sleepHours: number | null;
  sleepQuality: SleepQuality | null;
  notes: string;
};

export type DailyLogEntityAddDto = Omit<DailyLogEntityDto, "id">;

export type DailyLogSupabaseRow = {
  id: number;
  user_id: string;
  date: string;
  flow: FlowLevel | null;
  symptoms: SymptomKey[] | null;
  sexual_activity: SexualActivity | null;
  mood: MoodLevel | null;
  sleep_hours: number | null;
  sleep_quality: SleepQuality | null;
  notes: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type DailyLogSupabaseFilterDto = BaseFilterDto & {
  user_id?: string;
  date?: string;
};

export type DailyLogSupabaseImportPreviewDto = ImportPreviewDto & {
  id?: number;
  userId?: string;
  date?: string;
  flow?: FlowLevel | null;
  symptoms?: SymptomKey[];
  sexualActivity?: SexualActivity | null;
  mood?: MoodLevel | null;
  sleepHours?: number | null;
  sleepQuality?: SleepQuality | null;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
};

export type DailyLogSupabaseAddDto = DailyLogEntityAddDto & {
  userId: string;
};

export interface DailyLogSupabaseUpdateDto extends DeleteDto {
  date: string;
  flow: FlowLevel | null;
  symptoms: SymptomKey[];
  sexualActivity: SexualActivity | null;
  mood: MoodLevel | null;
  sleepHours: number | null;
  sleepQuality: SleepQuality | null;
  notes: string;
  updatedAt: Date;
}

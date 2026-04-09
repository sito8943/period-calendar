import { SupabaseDataClient } from "@sito/dashboard-app";
import type { SupabaseClient } from "@supabase/supabase-js";

import type {
  DailyLogEntityDto,
  DailyLogSupabaseAddDto,
  DailyLogSupabaseFilterDto,
  DailyLogSupabaseImportPreviewDto,
  DailyLogSupabaseRow,
  DailyLogSupabaseUpdateDto,
} from "./types";
import { parseNullableIsoDate, toNullableIsoString } from "./utils";

export class DailyLogsSupabaseClient extends SupabaseDataClient<
  "daily_logs",
  DailyLogEntityDto,
  DailyLogEntityDto,
  DailyLogSupabaseAddDto,
  DailyLogSupabaseUpdateDto,
  DailyLogSupabaseFilterDto,
  DailyLogSupabaseImportPreviewDto,
  DailyLogSupabaseRow
> {
  constructor(supabase: SupabaseClient) {
    super("daily_logs", supabase, {
      idColumn: "id",
      deletedAtColumn: "deleted_at",
      defaultSortColumn: "date",
      mapRowToDto: (row) => ({
        id: row.id,
        date: row.date,
        flow: row.flow,
        symptoms: row.symptoms ?? [],
        sexualActivity: row.sexual_activity,
        mood: row.mood,
        sleepHours: row.sleep_hours,
        sleepQuality: row.sleep_quality,
        notes: row.notes,
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at),
        deletedAt: parseNullableIsoDate(row.deleted_at),
      }),
      mapAddDtoToRow: (value) => ({
        user_id: value.userId,
        date: value.date,
        flow: value.flow,
        symptoms: value.symptoms,
        sexual_activity: value.sexualActivity,
        mood: value.mood,
        sleep_hours: value.sleepHours,
        sleep_quality: value.sleepQuality,
        notes: value.notes,
        created_at: value.createdAt.toISOString(),
        updated_at: value.updatedAt.toISOString(),
        deleted_at: toNullableIsoString(value.deletedAt),
      }),
      mapUpdateDtoToRow: (value) => ({
        date: value.date,
        flow: value.flow,
        symptoms: value.symptoms,
        sexual_activity: value.sexualActivity,
        mood: value.mood,
        sleep_hours: value.sleepHours,
        sleep_quality: value.sleepQuality,
        notes: value.notes,
        updated_at: value.updatedAt.toISOString(),
      }),
      mapImportPreviewToRow: (value) => ({
        user_id: value.userId,
        date: value.date,
        flow: value.flow,
        symptoms: value.symptoms,
        sexual_activity: value.sexualActivity,
        mood: value.mood,
        sleep_hours: value.sleepHours,
        sleep_quality: value.sleepQuality,
        notes: value.notes,
        created_at: value.createdAt,
        updated_at: value.updatedAt,
        deleted_at: value.deletedAt,
      }),
    });
  }
}

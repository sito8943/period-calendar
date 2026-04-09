import { SupabaseDataClient } from "@sito/dashboard-app";
import type { SupabaseClient } from "@supabase/supabase-js";

import type {
  PeriodEntityDto,
  PeriodSupabaseAddDto,
  PeriodSupabaseFilterDto,
  PeriodSupabaseImportPreviewDto,
  PeriodSupabaseRow,
  PeriodSupabaseUpdateDto,
} from "./types";
import { parseNullableIsoDate, toNullableIsoString } from "./utils";

export class PeriodsSupabaseClient extends SupabaseDataClient<
  "periods",
  PeriodEntityDto,
  PeriodEntityDto,
  PeriodSupabaseAddDto,
  PeriodSupabaseUpdateDto,
  PeriodSupabaseFilterDto,
  PeriodSupabaseImportPreviewDto,
  PeriodSupabaseRow
> {
  constructor(supabase: SupabaseClient) {
    super("periods", supabase, {
      idColumn: "id",
      deletedAtColumn: "deleted_at",
      defaultSortColumn: "start_date",
      mapRowToDto: (row) => ({
        id: row.id,
        startDate: row.start_date,
        endDate: row.end_date,
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at),
        deletedAt: parseNullableIsoDate(row.deleted_at),
      }),
      mapAddDtoToRow: (value) => ({
        user_id: value.userId,
        start_date: value.startDate,
        end_date: value.endDate,
        created_at: value.createdAt.toISOString(),
        updated_at: value.updatedAt.toISOString(),
        deleted_at: toNullableIsoString(value.deletedAt),
      }),
      mapUpdateDtoToRow: (value) => ({
        start_date: value.startDate,
        end_date: value.endDate,
        updated_at: value.updatedAt.toISOString(),
      }),
      mapImportPreviewToRow: (value) => ({
        user_id: value.userId,
        start_date: value.startDate,
        end_date: value.endDate,
        created_at: value.createdAt,
        updated_at: value.updatedAt,
        deleted_at: value.deletedAt,
      }),
    });
  }
}

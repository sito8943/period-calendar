import { DailyLogsSupabaseClient } from "./DailyLogsSupabaseClient";
import { PeriodsSupabaseClient } from "./PeriodsSupabaseClient";
import { supabase } from "./client";

let periodsSupabaseClient: PeriodsSupabaseClient | null = null;
let dailyLogsSupabaseClient: DailyLogsSupabaseClient | null = null;

export const getPeriodsSupabaseClient = (): PeriodsSupabaseClient | null => {
  if (!supabase) return null;

  if (!periodsSupabaseClient) {
    periodsSupabaseClient = new PeriodsSupabaseClient(supabase);
  }

  return periodsSupabaseClient;
};

export const getDailyLogsSupabaseClient =
  (): DailyLogsSupabaseClient | null => {
    if (!supabase) return null;

    if (!dailyLogsSupabaseClient) {
      dailyLogsSupabaseClient = new DailyLogsSupabaseClient(supabase);
    }

    return dailyLogsSupabaseClient;
  };

import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";

import { config } from "../../config";

const createSupabaseClient = (): SupabaseClient | null => {
  if (!config.supabase.enabled) return null;

  return createClient(config.supabase.url, config.supabase.anonKey);
};

export const supabase = createSupabaseClient();

export const isSupabaseConfigured = (): boolean => supabase !== null;

export const getSupabaseSessionUserId = async (): Promise<string | null> => {
  if (!supabase) return null;

  const { data, error } = await supabase.auth.getSession();

  if (error) {
    console.error("Failed to resolve Supabase session", error);
    return null;
  }

  return data.session?.user.id ?? null;
};

import { supabase } from "../../supabase";
import { createAuthProviderNotConfiguredError } from "../authErrors";

export const ensureSupabase = () => {
  if (!supabase) {
    throw createAuthProviderNotConfiguredError();
  }

  return supabase;
};

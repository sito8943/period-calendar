import type { Session } from "@supabase/supabase-js";

import { mapSupabaseSessionToSessionDto } from "@sito/dashboard-app";

import { supabase } from "../../supabase";
import { createAuthProviderNotConfiguredError } from "../authErrors";

export const ensureSupabase = () => {
  if (!supabase) {
    throw createAuthProviderNotConfiguredError();
  }

  return supabase;
};

export const mapSession = (
  session: Session,
  defaults?: {
    defaultUsername?: string;
    defaultEmail?: string;
  },
) =>
  mapSupabaseSessionToSessionDto(session, {
    defaultUsername: defaults?.defaultUsername,
    defaultEmail: defaults?.defaultEmail,
  });

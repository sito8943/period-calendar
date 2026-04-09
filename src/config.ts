const { VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY } = import.meta.env;

const supabaseUrl = VITE_SUPABASE_URL?.trim() ?? "";
const supabaseAnonKey = VITE_SUPABASE_ANON_KEY?.trim() ?? "";
const isSupabaseEnabled =
  supabaseUrl.length > 0 && supabaseAnonKey.length > 0;

export const config = {
  appName: "Period Calendar",
  defaultLanguage: "es",
  storage: {
    periods: "period-calendar:periods",
    settings: "period-calendar:settings",
    onboarding: "period-calendar:onboarding",
    theme: "period-calendar:theme",
  },
  supabase: {
    enabled: isSupabaseEnabled,
    url: supabaseUrl,
    anonKey: supabaseAnonKey,
  },
};

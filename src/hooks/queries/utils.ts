export const PeriodQueryKeys = {
  all: () => ({ queryKey: ["periods"] }),
  list: () => ({
    queryKey: [...PeriodQueryKeys.all().queryKey, "list"],
  }),
  dailyLogs: () => ({ queryKey: ["dailyLogs"] }),
  dailyLogsList: () => ({
    queryKey: [...PeriodQueryKeys.dailyLogs().queryKey, "list"],
  }),
  settings: () => ({ queryKey: ["settings"] }),
  profile: () => ({ queryKey: ["profile"] }),
};

export const PeriodQueryKeys = {
  all: () => ({ queryKey: ["periods"] }),
  list: () => ({
    queryKey: [...PeriodQueryKeys.all().queryKey, "list"],
  }),
  settings: () => ({ queryKey: ["settings"] }),
};

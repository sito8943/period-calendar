export const GUEST_PERIOD_QUERY_SCOPE = "guest";

type PeriodQueryScopeIdentity = string | number | null | undefined;
type PeriodQueryScopeAccountLike = {
  id?: number | null;
  email?: string | null;
  username?: string | null;
  token?: string | null;
};

export const resolvePeriodQueryScope = (
  scopeIdentity?: PeriodQueryScopeIdentity,
): string => {
  if (typeof scopeIdentity === "number" && Number.isFinite(scopeIdentity)) {
    return String(scopeIdentity);
  }
  if (typeof scopeIdentity !== "string") return GUEST_PERIOD_QUERY_SCOPE;

  const normalizedIdentity = scopeIdentity.trim();
  if (normalizedIdentity.length === 0) return GUEST_PERIOD_QUERY_SCOPE;

  return normalizedIdentity;
};

export const resolvePeriodQueryScopeFromAccount = (
  account?: PeriodQueryScopeAccountLike | null,
): string => {
  if (!account) return GUEST_PERIOD_QUERY_SCOPE;

  const emailScope = resolvePeriodQueryScope(account.email);
  if (emailScope !== GUEST_PERIOD_QUERY_SCOPE) return emailScope;

  const usernameScope = resolvePeriodQueryScope(account.username);
  if (usernameScope !== GUEST_PERIOD_QUERY_SCOPE) return usernameScope;

  const idScope = resolvePeriodQueryScope(account.id);
  if (idScope !== GUEST_PERIOD_QUERY_SCOPE) return idScope;

  return resolvePeriodQueryScope(account.token);
};

export const PeriodQueryKeys = {
  all: (queryScope?: PeriodQueryScopeIdentity) => ({
    queryKey: ["periods", resolvePeriodQueryScope(queryScope)],
  }),
  list: (queryScope?: PeriodQueryScopeIdentity) => ({
    queryKey: [...PeriodQueryKeys.all(queryScope).queryKey, "list"],
  }),
  dailyLogs: (queryScope?: PeriodQueryScopeIdentity) => ({
    queryKey: ["dailyLogs", resolvePeriodQueryScope(queryScope)],
  }),
  dailyLogsList: (queryScope?: PeriodQueryScopeIdentity) => ({
    queryKey: [...PeriodQueryKeys.dailyLogs(queryScope).queryKey, "list"],
  }),
  settings: () => ({ queryKey: ["settings"] }),
  profile: (queryScope?: PeriodQueryScopeIdentity) => ({
    queryKey: ["profile", resolvePeriodQueryScope(queryScope)],
  }),
};

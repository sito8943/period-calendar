import { useMemo } from "react";
import { useOptionalAuthContext } from "@sito/dashboard-app";

import { resolvePeriodQueryScopeFromAccount } from "./constants";

export function usePeriodQueryScope(): string {
  const auth = useOptionalAuthContext();
  const account = auth?.account;
  const accountId = account?.id;
  const accountEmail = account?.email;
  const accountUsername = account?.username;
  const accountToken = account?.token;

  return useMemo(
    () =>
      resolvePeriodQueryScopeFromAccount({
        id: accountId ?? null,
        email: accountEmail ?? null,
        username: accountUsername ?? null,
        token: accountToken ?? null,
      }),
    [accountEmail, accountId, accountToken, accountUsername],
  );
}

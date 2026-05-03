import type { EmailOtpType } from "@supabase/supabase-js";

import { AuthRouteQueryParamType } from "lib";

export const normalizeConfirmEmailTokenType = (
  value: string | null,
): Extract<EmailOtpType, "email" | "signup"> | null => {
  const normalizedType = value?.toLowerCase() ?? null;

  if (normalizedType === AuthRouteQueryParamType.Email) return normalizedType;
  if (normalizedType === AuthRouteQueryParamType.SignUp) return normalizedType;

  return null;
};

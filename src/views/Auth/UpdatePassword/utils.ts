import type { EmailOtpType } from "@supabase/supabase-js";

import { AuthRouteQueryParamType } from "lib";

export const normalizeRecoveryTokenType = (
  value: string | null,
): Extract<EmailOtpType, "recovery"> | null => {
  const normalizedType = value?.toLowerCase() ?? null;
  if (normalizedType !== AuthRouteQueryParamType.Recovery) return null;
  return normalizedType;
};

export const mapUpdatePasswordErrorKey = (message: string): string => {
  const normalized = message.toLowerCase();

  if (
    normalized.includes("weak password") ||
    normalized.includes("password should") ||
    normalized.includes("at least")
  ) {
    return "_accessibility:errors.updatePassword.weakPassword";
  }

  if (
    normalized.includes("token") ||
    normalized.includes("otp") ||
    normalized.includes("expired") ||
    normalized.includes("invalid") ||
    normalized.includes("session") ||
    normalized.includes("nonce")
  ) {
    return "_accessibility:errors.updatePassword.invalidToken";
  }

  return "_accessibility:errors.updatePassword.generic";
};

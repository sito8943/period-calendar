export const mapUpdatePasswordErrorKey = (message: string): string => {
  const normalized = message.toLowerCase();

  if (normalized.includes("not configured")) {
    return "_accessibility:errors.updatePassword.supabaseNotConfigured";
  }

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

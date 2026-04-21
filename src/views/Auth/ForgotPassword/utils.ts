export const mapForgotPasswordErrorKey = (message: string): string => {
  const normalized = message.toLowerCase();

  if (
    normalized.includes("invalid email") ||
    normalized.includes("validate email")
  ) {
    return "_accessibility:errors.forgotPassword.invalidEmail";
  }

  return "_accessibility:errors.forgotPassword.generic";
};

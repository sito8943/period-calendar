export const mapSignInErrorKey = (message: string): string => {
  const normalized = message.toLowerCase();

  if (
    normalized.includes("invalid login") ||
    normalized.includes("invalid credentials") ||
    normalized.includes("email not confirmed")
  ) {
    return "_accessibility:errors.signIn.invalidCredentials";
  }

  return "_accessibility:errors.signIn.generic";
};

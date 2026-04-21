export const mapSignUpErrorKey = (message: string): string => {
  const normalized = message.toLowerCase();

  if (
    normalized.includes("already registered") ||
    normalized.includes("already exists")
  ) {
    return "_accessibility:errors.signUp.emailAlreadyInUse";
  }

  return "_accessibility:errors.signUp.generic";
};

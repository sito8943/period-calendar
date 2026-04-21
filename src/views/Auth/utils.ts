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

export const mapSignUpErrorKey = (message: string): string => {
  const normalized = message.toLowerCase();

  if (normalized.includes("already registered") || normalized.includes("already exists")) {
    return "_accessibility:errors.signUp.emailAlreadyInUse";
  }

  return "_accessibility:errors.signUp.generic";
};

export const mapForgotPasswordErrorKey = (message: string): string => {
  const normalized = message.toLowerCase();

  if (normalized.includes("invalid email") || normalized.includes("validate email")) {
    return "_accessibility:errors.forgotPassword.invalidEmail";
  }

  return "_accessibility:errors.forgotPassword.generic";
};

import type { EmailOtpType } from "@supabase/supabase-js";

export type ForgotPasswordDto = {
  email: string;
  redirectTo?: string;
};

export type ResetPasswordDto =
  | {
      tokenHash: string;
      type: Extract<EmailOtpType, "recovery">;
      newPassword: string;
    }
  | {
      accessToken: string;
      refreshToken: string;
      newPassword: string;
    };

export type ResendConfirmEmailDto = {
  email: string;
  redirectTo?: string;
};

export type ConfirmEmailDto = {
  tokenHash: string;
  type: Extract<EmailOtpType, "email" | "signup">;
};

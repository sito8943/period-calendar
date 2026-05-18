import type {
  ConfirmEmailDto,
  ForgotPasswordDto,
  ResendConfirmEmailDto,
  ResetPasswordDto,
} from "./types";
import { ensureSupabase } from "./utils";

export class PeriodCalendarAuthApiClient {
  async forgotPassword(data: ForgotPasswordDto): Promise<void> {
    const auth = ensureSupabase();
    const redirectTo = data.redirectTo?.trim();

    const { error } = await auth.auth.resetPasswordForEmail(data.email, {
      ...(redirectTo ? { redirectTo } : {}),
    });

    if (error) throw error;
  }

  async resendConfirmEmail(data: ResendConfirmEmailDto): Promise<void> {
    const auth = ensureSupabase();
    const redirectTo = data.redirectTo?.trim();

    const { error } = await auth.auth.resend({
      type: "signup",
      email: data.email,
      options: {
        ...(redirectTo ? { emailRedirectTo: redirectTo } : {}),
      },
    });

    if (error) throw error;
  }

  async confirmEmail(data: ConfirmEmailDto): Promise<void> {
    const auth = ensureSupabase();
    const { error } = await auth.auth.verifyOtp({
      token_hash: data.tokenHash,
      type: data.type,
    });

    if (error) throw error;

    await auth.auth.signOut();
  }

  async resetPassword(data: ResetPasswordDto): Promise<void> {
    const auth = ensureSupabase();

    if ("tokenHash" in data) {
      const { error: verifyError } = await auth.auth.verifyOtp({
        token_hash: data.tokenHash,
        type: data.type,
      });

      if (verifyError) throw verifyError;
    } else {
      const { error: setSessionError } = await auth.auth.setSession({
        access_token: data.accessToken,
        refresh_token: data.refreshToken,
      });

      if (setSessionError) throw setSessionError;
    }

    const { data: sessionData, error: sessionError } =
      await auth.auth.getSession();

    if (sessionError) throw sessionError;
    if (!sessionData.session) throw new Error("No active session");

    const { error: updateError } = await auth.auth.updateUser({
      password: data.newPassword,
    });

    if (updateError) throw updateError;

    await auth.auth.signOut();
  }
}

import { AuthClient as BaseAuthClient } from "@sito/dashboard-app";
import type {
  APIClientAuthConfig,
  AuthDto,
  RefreshDto,
  RegisterDto,
  SessionDto,
} from "@sito/dashboard-app";

import type {
  PeriodCalendarRegisterDto,
  PeriodCalendarSignUpResult,
} from "./types";
import { ensureSupabase, mapSession } from "./utils";

export class PeriodCalendarAuthClient extends BaseAuthClient {
  constructor(userKey?: string, authConfig?: APIClientAuthConfig) {
    super("", userKey, authConfig);
  }

  async login(data: AuthDto): Promise<SessionDto> {
    const auth = ensureSupabase();
    const { data: authData, error } = await auth.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) throw error;
    if (!authData.session) throw new Error("Authenticated session not found");

    return mapSession(authData.session, {
      defaultUsername: data.email,
      defaultEmail: data.email,
    });
  }

  async refresh(data: RefreshDto): Promise<SessionDto> {
    const auth = ensureSupabase();
    const { data: authData, error } = await auth.auth.refreshSession({
      refresh_token: data.refreshToken,
    });

    if (error) throw error;
    if (!authData.session) throw new Error("Authenticated session not found");

    return mapSession(authData.session);
  }

  async register(data: RegisterDto): Promise<SessionDto> {
    const result = await this.signUp(data as PeriodCalendarRegisterDto);

    if (result.status !== "authenticated") {
      throw new Error("Email confirmation required");
    }

    return result.session;
  }

  async signUp(
    data: PeriodCalendarRegisterDto,
  ): Promise<PeriodCalendarSignUpResult> {
    const auth = ensureSupabase();
    const name = data.name?.trim() || data.username?.trim() || data.email.trim();
    const redirectTo = data.redirectTo?.trim();

    const { data: authData, error } = await auth.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        ...(redirectTo ? { emailRedirectTo: redirectTo } : {}),
        data: {
          name,
          username: name,
        },
      },
    });

    if (error) throw error;

    if (!authData.session) {
      return {
        status: "confirmation_required",
        email: data.email,
      };
    }

    return {
      status: "authenticated",
      session: mapSession(authData.session, {
        defaultUsername: name,
        defaultEmail: data.email,
      }),
    };
  }

  async getSession(): Promise<SessionDto> {
    const auth = ensureSupabase();
    const { data, error } = await auth.auth.getSession();

    if (error) throw error;
    if (!data.session) throw new Error("No active session");

    return mapSession(data.session);
  }

  async logout(
    _options?: Parameters<BaseAuthClient["logout"]>[0],
  ): Promise<void> {
    const auth = ensureSupabase();
    const { error } = await auth.auth.signOut();
    if (error) throw error;
  }
}

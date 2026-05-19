import {
  IManager,
  SupabaseAuthApiClient,
  type IAuthApiClient,
} from "@sito/dashboard-app";

import { config } from "../../config";
import { supabase } from "../supabase";
import { PeriodCalendarAuthClient } from "./AuthClient";
import { createAuthProviderNotConfiguredError } from "./authErrors";
import { DailyLogClient } from "./DailyLogClient";
import { PeriodClient } from "./PeriodClient";
import { ProfileClient } from "./ProfileClient";
import { SettingsClient } from "./SettingsClient";

const throwNotConfigured = (): never => {
  throw createAuthProviderNotConfiguredError();
};

const createAuthApi = (): IAuthApiClient =>
  supabase
    ? new SupabaseAuthApiClient(supabase)
    : {
        forgotPassword: async () => throwNotConfigured(),
        resetPassword: async () => throwNotConfigured(),
        resendConfirmEmail: async () => throwNotConfigured(),
        confirmEmail: async () => throwNotConfigured(),
      };

export class PeriodCalendarManager extends IManager {
  authApi: IAuthApiClient = createAuthApi();
  periods: PeriodClient = new PeriodClient();
  dailyLogs: DailyLogClient = new DailyLogClient();
  profiles: ProfileClient = new ProfileClient();
  settings: SettingsClient = new SettingsClient();

  constructor() {
    super("", config.auth.user, {
      rememberKey: config.auth.remember,
      refreshTokenKey: config.auth.refreshTokenKey,
      accessTokenExpiresAtKey: config.auth.accessTokenExpiresAtKey,
    });

    this.auth = new PeriodCalendarAuthClient(config.auth.user, {
      rememberKey: config.auth.remember,
      refreshTokenKey: config.auth.refreshTokenKey,
      accessTokenExpiresAtKey: config.auth.accessTokenExpiresAtKey,
    });
  }

  get Auth(): PeriodCalendarAuthClient {
    return this.auth as PeriodCalendarAuthClient;
  }

  get AuthApi(): IAuthApiClient {
    return this.authApi;
  }

  get Periods(): PeriodClient {
    return this.periods;
  }

  get DailyLogs(): DailyLogClient {
    return this.dailyLogs;
  }

  get Profiles(): ProfileClient {
    return this.profiles;
  }

  get Settings(): SettingsClient {
    return this.settings;
  }
}

export const periodCalendarManager = new PeriodCalendarManager();

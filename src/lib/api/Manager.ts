import { DailyLogClient } from "./DailyLogClient";
import { PeriodClient } from "./PeriodClient";
import { ProfileClient } from "./ProfileClient";
import { SettingsClient } from "./SettingsClient";

export class PeriodCalendarManager {
  periods: PeriodClient = new PeriodClient();
  dailyLogs: DailyLogClient = new DailyLogClient();
  profiles: ProfileClient = new ProfileClient();
  settings: SettingsClient = new SettingsClient();

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

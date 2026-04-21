import { storageCore } from "../storage";
import type { Settings } from "../types";

export class SettingsClient {
  get(): Settings {
    return storageCore.getSettings();
  }

  save(settings: Settings): void {
    storageCore.saveSettings(settings);
  }
}

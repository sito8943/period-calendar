import { storageCore } from "../storage";
import type { ProfileSettings } from "../types";

export class ProfileClient {
  async get(): Promise<ProfileSettings> {
    const userId = await storageCore.getCurrentSupabaseUserId();
    if (!userId) return storageCore.defaultProfileSettings;

    const remote = await storageCore.getProfileSettingsFromSupabase(userId);
    return remote ?? storageCore.defaultProfileSettings;
  }

  async save(profile: ProfileSettings): Promise<ProfileSettings> {
    const userId = await storageCore.getCurrentSupabaseUserId();
    if (!userId) {
      throw new Error("Authentication required to save profile settings");
    }
    return storageCore.saveProfileSettingsToSupabase(userId, profile);
  }
}

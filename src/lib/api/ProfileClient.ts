import { storageCore } from "../storage";
import type { ProfileSettings } from "../types";

export class ProfileClient {
  async get(): Promise<ProfileSettings> {
    const userId = await storageCore.getCurrentSupabaseUserId();

    if (userId) {
      await storageCore.ensureMirrorUserScope(userId);

      try {
        const remoteProfileSettings =
          await storageCore.getProfileSettingsFromSupabase(userId);

        if (remoteProfileSettings) {
          await storageCore.syncProfileSettingsMirrorWithRemote(
            remoteProfileSettings,
          );
          return remoteProfileSettings;
        }
      } catch (error) {
        console.error(
          "Supabase profile settings read failed, using offline store",
          error,
        );
      }
    }

    return storageCore.getProfileSettingsFromOfflineStore();
  }

  async getMirrorSnapshot(): Promise<ProfileSettings> {
    const userId = await storageCore.getCurrentSupabaseUserId();
    if (userId) {
      await storageCore.ensureMirrorUserScope(userId);
    }

    return storageCore.getProfileSettingsFromOfflineStore();
  }

  async save(profile: ProfileSettings): Promise<ProfileSettings> {
    const userId = await storageCore.getCurrentSupabaseUserId();
    if (userId) {
      await storageCore.ensureMirrorUserScope(userId);
    }

    await storageCore.saveProfileSettingsToOfflineStore(profile);

    if (userId) {
      try {
        const savedProfileSettings =
          await storageCore.saveProfileSettingsToSupabase(userId, profile);
        await storageCore.syncProfileSettingsMirrorWithRemote(
          savedProfileSettings,
        );
        return savedProfileSettings;
      } catch (error) {
        console.error(
          "Supabase profile settings save failed, using offline store",
          error,
        );
      }
    }

    return profile;
  }
}

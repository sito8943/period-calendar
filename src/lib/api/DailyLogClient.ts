import { storageCore } from "../storage";
import type { AddDailyLogDto, DailyLog, UpdateDailyLogDto } from "../types";

export class DailyLogClient {
  async get(): Promise<DailyLog[]> {
    const userId = await storageCore.getCurrentSupabaseUserId();

    if (userId) {
      await storageCore.ensureMirrorUserScope(userId);

      try {
        await storageCore.ensureSupabaseSeedFromOffline(userId);
        const dailyLogs = await storageCore.getDailyLogsFromSupabase(userId);
        await storageCore.syncDailyLogsMirrorWithRemote(dailyLogs);
        return dailyLogs;
      } catch (error) {
        console.error("Supabase daily logs read failed, using offline store", error);
      }
    }

    return storageCore.getDailyLogsFromOfflineStore();
  }

  async getMirrorSnapshot(): Promise<DailyLog[]> {
    const userId = await storageCore.getCurrentSupabaseUserId();
    if (userId) {
      await storageCore.ensureMirrorUserScope(userId);
    }

    return storageCore.getDailyLogsFromOfflineStore();
  }

  async insert(dto: AddDailyLogDto): Promise<DailyLog> {
    const userId = await storageCore.getCurrentSupabaseUserId();

    if (userId) {
      await storageCore.ensureMirrorUserScope(userId);

      try {
        await storageCore.ensureSupabaseSeedFromOffline(userId);
        const created = await storageCore.addDailyLogToSupabase(userId, dto);
        await storageCore.upsertDailyLogInOfflineMirror(created);
        return created;
      } catch (error) {
        console.error("Supabase add daily log failed, using offline store", error);
      }
    }

    return storageCore.addDailyLogToOfflineStore(dto);
  }

  async update(dto: UpdateDailyLogDto): Promise<DailyLog> {
    const userId = await storageCore.getCurrentSupabaseUserId();

    if (userId) {
      await storageCore.ensureMirrorUserScope(userId);

      try {
        await storageCore.ensureSupabaseSeedFromOffline(userId);
        const updated = await storageCore.updateDailyLogInSupabase(userId, dto);
        await storageCore.upsertDailyLogInOfflineMirror(updated);
        return updated;
      } catch (error) {
        console.error("Supabase update daily log failed, using offline store", error);
      }
    }

    return storageCore.updateDailyLogInOfflineStore(dto);
  }

  async softDelete(id: string): Promise<void> {
    const userId = await storageCore.getCurrentSupabaseUserId();

    if (userId) {
      await storageCore.ensureMirrorUserScope(userId);

      try {
        await storageCore.ensureSupabaseSeedFromOffline(userId);
        await storageCore.deleteDailyLogFromSupabase(id);
        await storageCore.removeDailyLogFromOfflineMirror(id);
        return;
      } catch (error) {
        console.error("Supabase delete daily log failed, using offline store", error);
      }
    }

    await storageCore.deleteDailyLogFromOfflineStore(id);
  }
}

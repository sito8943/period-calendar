import { storageCore } from "../storage";
import type { AddDailyLogDto, DailyLog, UpdateDailyLogDto } from "../types";

export class DailyLogClient {
  async get(): Promise<DailyLog[]> {
    const userId = await storageCore.getCurrentSupabaseUserId();
    if (!userId) return [];
    return storageCore.getDailyLogsFromSupabase(userId);
  }

  async insert(dto: AddDailyLogDto): Promise<DailyLog> {
    const userId = await storageCore.getCurrentSupabaseUserId();
    if (!userId) {
      throw new Error("Authentication required to add a daily log");
    }
    return storageCore.addDailyLogToSupabase(userId, dto);
  }

  async update(dto: UpdateDailyLogDto): Promise<DailyLog> {
    const userId = await storageCore.getCurrentSupabaseUserId();
    if (!userId) {
      throw new Error("Authentication required to update a daily log");
    }
    return storageCore.updateDailyLogInSupabase(userId, dto);
  }

  async softDelete(id: string): Promise<void> {
    const userId = await storageCore.getCurrentSupabaseUserId();
    if (!userId) {
      throw new Error("Authentication required to delete a daily log");
    }
    await storageCore.deleteDailyLogFromSupabase(id);
  }
}

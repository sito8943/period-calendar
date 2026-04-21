import { storageCore } from "../storage";
import type { AddPeriodDto, Period, UpdatePeriodDto } from "../types";

export class PeriodClient {
  async get(): Promise<Period[]> {
    const userId = await storageCore.getCurrentSupabaseUserId();

    if (userId) {
      await storageCore.ensureMirrorUserScope(userId);

      try {
        await storageCore.ensureSupabaseSeedFromOffline(userId);
        const periods = await storageCore.getPeriodsFromSupabase(userId);
        await storageCore.syncPeriodsMirrorWithRemote(periods);
        return periods;
      } catch (error) {
        console.error("Supabase periods read failed, using offline store", error);
      }
    }

    return storageCore.getPeriodsFromOfflineStore();
  }

  async getMirrorSnapshot(): Promise<Period[]> {
    const userId = await storageCore.getCurrentSupabaseUserId();
    if (userId) {
      await storageCore.ensureMirrorUserScope(userId);
    }

    return storageCore.getPeriodsFromOfflineStore();
  }

  async insert(dto: AddPeriodDto): Promise<Period> {
    const userId = await storageCore.getCurrentSupabaseUserId();

    if (userId) {
      await storageCore.ensureMirrorUserScope(userId);

      try {
        await storageCore.ensureSupabaseSeedFromOffline(userId);
        const created = await storageCore.addPeriodToSupabase(userId, dto);
        await storageCore.upsertPeriodInOfflineMirror(created);
        return created;
      } catch (error) {
        console.error("Supabase add period failed, using offline store", error);
      }
    }

    return storageCore.addPeriodToOfflineStore(dto);
  }

  async update(dto: UpdatePeriodDto): Promise<Period> {
    const userId = await storageCore.getCurrentSupabaseUserId();

    if (userId) {
      await storageCore.ensureMirrorUserScope(userId);

      try {
        await storageCore.ensureSupabaseSeedFromOffline(userId);
        const updated = await storageCore.updatePeriodInSupabase(dto);
        await storageCore.upsertPeriodInOfflineMirror(updated);
        return updated;
      } catch (error) {
        console.error("Supabase update period failed, using offline store", error);
      }
    }

    return storageCore.updatePeriodInOfflineStore(dto);
  }

  async softDelete(id: string): Promise<void> {
    const userId = await storageCore.getCurrentSupabaseUserId();

    if (userId) {
      await storageCore.ensureMirrorUserScope(userId);

      try {
        await storageCore.ensureSupabaseSeedFromOffline(userId);
        await storageCore.deletePeriodFromSupabase(id);
        await storageCore.removePeriodFromOfflineMirror(id);
        return;
      } catch (error) {
        console.error("Supabase delete period failed, using offline store", error);
      }
    }

    await storageCore.deletePeriodFromOfflineStore(id);
  }
}

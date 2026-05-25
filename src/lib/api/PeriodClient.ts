import { storageCore } from "../storage";
import type { AddPeriodDto, Period, UpdatePeriodDto } from "../types";

export class PeriodClient {
  async get(): Promise<Period[]> {
    const userId = await storageCore.getCurrentSupabaseUserId();
    if (!userId) return [];
    return storageCore.getPeriodsFromSupabase(userId);
  }

  async insert(dto: AddPeriodDto): Promise<Period> {
    const userId = await storageCore.getCurrentSupabaseUserId();
    if (!userId) {
      throw new Error("Authentication required to add a period");
    }
    return storageCore.addPeriodToSupabase(userId, dto);
  }

  async update(dto: UpdatePeriodDto): Promise<Period> {
    const userId = await storageCore.getCurrentSupabaseUserId();
    if (!userId) {
      throw new Error("Authentication required to update a period");
    }
    return storageCore.updatePeriodInSupabase(dto);
  }

  async softDelete(id: string): Promise<void> {
    const userId = await storageCore.getCurrentSupabaseUserId();
    if (!userId) {
      throw new Error("Authentication required to delete a period");
    }
    await storageCore.deletePeriodFromSupabase(id);
  }
}

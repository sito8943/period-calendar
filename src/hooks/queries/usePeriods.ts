import { useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// lib
import {
  getPeriods,
  savePeriod,
  deletePeriod as deletePeriodFromStorage,
  getSettings,
  calculateAverageCycleLength,
  calculateAveragePeriodDuration,
  predictNextPeriodStart,
} from "lib";
import type { Period, AddPeriodDto, UpdatePeriodDto, Settings } from "lib";
import { PeriodQueryKeys } from "./utils";

export function usePeriodsList() {
  return useQuery({
    ...PeriodQueryKeys.list(),
    queryFn: () => getPeriods(),
  });
}

export function useSettings() {
  return useQuery({
    ...PeriodQueryKeys.settings(),
    queryFn: () => getSettings(),
  });
}

export function useAddPeriod() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: AddPeriodDto) => {
      const now = new Date().toISOString();
      const period: Period = {
        id: crypto.randomUUID(),
        startDate: dto.startDate,
        endDate: dto.endDate ?? null,
        createdAt: now,
        updatedAt: now,
      };
      savePeriod(period);
      return Promise.resolve(period);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(PeriodQueryKeys.all());
    },
  });
}

export function useUpdatePeriod() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: UpdatePeriodDto) => {
      const periods = getPeriods();
      const existing = periods.find((p) => p.id === dto.id);
      if (!existing) throw new Error("Period not found");

      const updated: Period = {
        ...existing,
        startDate: dto.startDate,
        endDate: dto.endDate ?? null,
        updatedAt: new Date().toISOString(),
      };
      savePeriod(updated);
      return Promise.resolve(updated);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(PeriodQueryKeys.all());
    },
  });
}

export function useDeletePeriod() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => {
      deletePeriodFromStorage(id);
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(PeriodQueryKeys.all());
    },
  });
}

export function useCycleStats(periods: Period[], settings: Settings) {
  return useMemo(() => {
    const avgCycleLength = calculateAverageCycleLength(periods);
    const avgPeriodDuration = calculateAveragePeriodDuration(periods);
    const nextPeriodStart = predictNextPeriodStart(
      periods,
      settings.defaultCycleLength,
    );

    let daysUntilNext: number | null = null;
    if (nextPeriodStart) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      daysUntilNext = Math.round(
        (nextPeriodStart.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
      );
    }

    return {
      avgCycleLength,
      avgPeriodDuration,
      nextPeriodStart,
      daysUntilNext,
    };
  }, [periods, settings.defaultCycleLength]);
}

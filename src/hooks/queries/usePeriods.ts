import { useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// lib
import {
  getPeriods,
  addPeriod,
  updatePeriod,
  deletePeriod as deletePeriodFromStorage,
  getSettings,
  calculateCycleLengthStdDev,
  calculateAverageCycleLength,
  calculateAveragePeriodDuration,
  getLatestCycleVariation,
  predictNextPeriodStart,
} from "lib";
import type { Period, AddPeriodDto, UpdatePeriodDto, Settings } from "lib";
import { PeriodQueryKeys } from "./utils";

export function usePeriodsList() {
  return useQuery({
    ...PeriodQueryKeys.list(),
    queryFn: async () => getPeriods(),
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
    mutationFn: async (dto: AddPeriodDto) => addPeriod(dto),
    onSuccess: () => {
      queryClient.invalidateQueries(PeriodQueryKeys.all());
    },
  });
}

export function useUpdatePeriod() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dto: UpdatePeriodDto) => updatePeriod(dto),
    onSuccess: () => {
      queryClient.invalidateQueries(PeriodQueryKeys.all());
    },
  });
}

export function useDeletePeriod() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await deletePeriodFromStorage(id);
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
    const cycleLengthStdDev = calculateCycleLengthStdDev(periods);
    const latestCycleVariation = getLatestCycleVariation(periods);
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
      cycleLengthStdDev,
      latestCycleVariation,
      nextPeriodStart,
      daysUntilNext,
    };
  }, [periods, settings.defaultCycleLength]);
}

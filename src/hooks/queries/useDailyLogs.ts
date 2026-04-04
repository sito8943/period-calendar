import { useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// lib
import {
  getDailyLogs,
  addDailyLog,
  updateDailyLog,
  deleteDailyLog as deleteDailyLogFromStorage,
} from "lib";
import type { AddDailyLogDto, UpdateDailyLogDto } from "lib";

// utils
import { PeriodQueryKeys } from "./utils";

export function useDailyLogsList() {
  return useQuery({
    ...PeriodQueryKeys.dailyLogsList(),
    queryFn: async () => getDailyLogs(),
  });
}

export function useDailyLogByDate(date?: string) {
  const { data: dailyLogs = [] } = useDailyLogsList();

  return useMemo(() => {
    if (!date) return undefined;
    return dailyLogs.find((log) => log.date === date);
  }, [date, dailyLogs]);
}

export function useAddDailyLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dto: AddDailyLogDto) => addDailyLog(dto),
    onSuccess: () => {
      queryClient.invalidateQueries(PeriodQueryKeys.dailyLogs());
    },
  });
}

export function useUpdateDailyLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dto: UpdateDailyLogDto) => updateDailyLog(dto),
    onSuccess: () => {
      queryClient.invalidateQueries(PeriodQueryKeys.dailyLogs());
    },
  });
}

export function useDeleteDailyLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await deleteDailyLogFromStorage(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(PeriodQueryKeys.dailyLogs());
    },
  });
}

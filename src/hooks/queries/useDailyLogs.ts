import { useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// lib
import {
  getDailyLogs,
  saveDailyLog,
  deleteDailyLog as deleteDailyLogFromStorage,
} from "lib";
import type { AddDailyLogDto, DailyLog, UpdateDailyLogDto } from "lib";

// utils
import { PeriodQueryKeys } from "./utils";

export function useDailyLogsList() {
  return useQuery({
    ...PeriodQueryKeys.dailyLogsList(),
    queryFn: () => getDailyLogs(),
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
    mutationFn: (dto: AddDailyLogDto) => {
      const dailyLogs = getDailyLogs();
      const duplicateDate = dailyLogs.find((item) => item.date === dto.date);
      if (duplicateDate) {
        throw new Error("A daily log already exists for this date");
      }

      const now = new Date().toISOString();
      const dailyLog: DailyLog = {
        id: crypto.randomUUID(),
        ...dto,
        createdAt: now,
        updatedAt: now,
      };

      saveDailyLog(dailyLog);
      return Promise.resolve(dailyLog);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(PeriodQueryKeys.dailyLogs());
    },
  });
}

export function useUpdateDailyLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: UpdateDailyLogDto) => {
      const dailyLogs = getDailyLogs();
      const existing = dailyLogs.find((item) => item.id === dto.id);
      if (!existing) throw new Error("Daily log not found");

      const duplicateDate = dailyLogs.find(
        (item) => item.date === dto.date && item.id !== dto.id,
      );
      if (duplicateDate) {
        throw new Error("A daily log already exists for this date");
      }

      const updated: DailyLog = {
        ...existing,
        ...dto,
        updatedAt: new Date().toISOString(),
      };

      saveDailyLog(updated);
      return Promise.resolve(updated);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(PeriodQueryKeys.dailyLogs());
    },
  });
}

export function useDeleteDailyLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => {
      deleteDailyLogFromStorage(id);
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(PeriodQueryKeys.dailyLogs());
    },
  });
}

// lib
import { ISO_DATE_PATTERN, parseLocalDate, toISODateString } from "lib";

/**
 *
 * @param error
 * @param fallback
 * @returns
 */
export const getErrorMessage = (error: unknown, fallback: string): string => {
  if (error instanceof Error) return error.message;
  if (typeof error === "object" && error !== null) {
    const maybeError = error as { message?: string };
    if (typeof maybeError.message === "string") return maybeError.message;
  }
  return fallback;
};

/**
 *
 * @param value
 * @returns
 */
export const isValidIsoDate = (value: string): boolean => {
  if (!ISO_DATE_PATTERN.test(value)) return false;
  const parsed = parseLocalDate(value);
  return toISODateString(parsed) === value;
};

/**
 *
 * @param value
 * @returns
 */
export const toNullableNumber = (value: string): number | null => {
  if (!value) return null;
  const numeric = Number(value);
  if (Number.isNaN(numeric)) return null;
  return numeric;
};

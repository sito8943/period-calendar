export const parseNullableIsoDate = (
  value: string | null | undefined,
): Date | null => {
  if (!value) return null;

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;

  return parsed;
};

export const toNullableIsoString = (
  value: Date | null | undefined,
): string | null => {
  if (!value) return null;
  return value.toISOString();
};

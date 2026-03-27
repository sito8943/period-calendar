export function toISODateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function parseLocalDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function diffInDays(a: string, b: string): number {
  const dateA = parseLocalDate(a);
  const dateB = parseLocalDate(b);
  return Math.round((dateB.getTime() - dateA.getTime()) / (1000 * 60 * 60 * 24));
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function getMonthDays(year: number, month: number): Date[] {
  const days: Date[] = [];
  const count = getDaysInMonth(year, month);
  for (let d = 1; d <= count; d++) {
    days.push(new Date(year, month, d));
  }
  return days;
}

export function formatDate(dateStr: string, locale: string): string {
  const date = parseLocalDate(dateStr);
  return date.toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

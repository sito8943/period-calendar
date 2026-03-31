const WEEKDAYS_ES = ["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"];
const WEEKDAYS_EN = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function getWeekdays(locale: string) {
  return locale.startsWith("es") ? WEEKDAYS_ES : WEEKDAYS_EN;
}

export function isDateInRange(date: Date, start: Date, end: Date): boolean {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const s = new Date(start);
  s.setHours(0, 0, 0, 0);
  const e = new Date(end);
  e.setHours(0, 0, 0, 0);
  return d >= s && d <= e;
}

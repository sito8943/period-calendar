export const AppRoute = {
  Home: "/",
  PeriodLog: "/log",
  PeriodLogById: "/log/:id",
  DailyLogByDate: "/daily-log/:date",
  History: "/history",
  Profile: "/profile",
  NotFound: "*",
} as const;

export const RouteQueryParam = {
  PeriodStartDate: "startDate",
} as const;

export function getPeriodLogDetailRoute(id: string): string {
  return `${AppRoute.PeriodLog}/${id}`;
}

export function getDailyLogRoute(date: string): string {
  return AppRoute.DailyLogByDate.replace(":date", date);
}

export function getPeriodLogRouteWithStartDate(startDate: string): string {
  const searchParams = new URLSearchParams({
    [RouteQueryParam.PeriodStartDate]: startDate,
  });
  return `${AppRoute.PeriodLog}?${searchParams.toString()}`;
}

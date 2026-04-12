export const AppRoute = {
  AuthRoot: "/auth",
  SignIn: "/auth/sign-in",
  SignUp: "/auth/sign-up",
  SignUpConfirmation: "/auth/sign-up-confirmation",
  ForgotPassword: "/auth/forgot-password",
  SignOut: "/sign-out",
  Home: "/",
  PeriodLog: "/log",
  PeriodLogById: "/log/:id",
  DailyLogByDate: "/daily-log/:date",
  History: "/history",
  Profile: "/profile",
  About: "/about-us",
  CookiesPolicy: "/cookies-policy",
  TermsAndConditions: "/terms-and-conditions",
  PrivacyPolicy: "/privacy-policy",
  AuthNotFound: "*",
  NotFound: "*",
} as const;

export const RouteQueryParam = {
  PeriodStartDate: "startDate",
  Email: "email",
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

export function getSignUpConfirmationRoute(email: string): string {
  const searchParams = new URLSearchParams({
    [RouteQueryParam.Email]: email,
  });
  return `${AppRoute.SignUpConfirmation}?${searchParams.toString()}`;
}

import loadable from "@loadable/component";

export const routeComponents = {
  SignIn: loadable(() =>
    import("views").then((module) => ({
      default: module.SignIn,
    })),
  ),
  SignUp: loadable(() =>
    import("views").then((module) => ({
      default: module.SignUp,
    })),
  ),
  SignUpConfirmation: loadable(() =>
    import("views").then((module) => ({
      default: module.SignUpConfirmation,
    })),
  ),
  UpdatePassword: loadable(() =>
    import("views").then((module) => ({
      default: module.UpdatePassword,
    })),
  ),
  ConfirmEmailSuccess: loadable(() =>
    import("views").then((module) => ({
      default: module.ConfirmEmailSuccess,
    })),
  ),
  ConfirmEmailError: loadable(() =>
    import("views").then((module) => ({
      default: module.ConfirmEmailError,
    })),
  ),
  ForgotPassword: loadable(() =>
    import("views").then((module) => ({
      default: module.ForgotPassword,
    })),
  ),
  SignOut: loadable(() =>
    import("views").then((module) => ({
      default: module.SignOut,
    })),
  ),
  Home: loadable(() =>
    import("views").then((module) => ({
      default: module.Home,
    })),
  ),
  PeriodLog: loadable(() =>
    import("views").then((module) => ({
      default: module.PeriodLog,
    })),
  ),
  DailyLog: loadable(() =>
    import("views").then((module) => ({
      default: module.DailyLog,
    })),
  ),
  History: loadable(() =>
    import("views").then((module) => ({
      default: module.History,
    })),
  ),
  Profile: loadable(() =>
    import("views").then((module) => ({
      default: module.Profile,
    })),
  ),
  About: loadable(() =>
    import("views").then((module) => ({
      default: module.About,
    })),
  ),
  CookiesPolicy: loadable(() =>
    import("views").then((module) => ({
      default: module.CookiesPolicy,
    })),
  ),
  TermsAndConditions: loadable(() =>
    import("views").then((module) => ({
      default: module.TermsAndConditions,
    })),
  ),
  PrivacyPolicy: loadable(() =>
    import("views").then((module) => ({
      default: module.PrivacyPolicy,
    })),
  ),
  FeatureUnavailable: loadable(() =>
    import("views").then((module) => ({
      default: module.FeatureUnavailable,
    })),
  ),
  NotFound: loadable(() =>
    import("views").then((module) => ({
      default: module.NotFound,
    })),
  ),
};

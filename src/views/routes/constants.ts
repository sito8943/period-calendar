import loadable from "@loadable/component";

export const routeComponents = {
  SignIn: loadable(() =>
    import("../Auth/SignIn").then((module) => ({
      default: module.SignIn,
    })),
  ),
  SignUp: loadable(() =>
    import("../Auth/SignUp").then((module) => ({
      default: module.SignUp,
    })),
  ),
  SignUpConfirmation: loadable(() =>
    import("../Auth/SignUpConfirmation").then((module) => ({
      default: module.SignUpConfirmation,
    })),
  ),
  UpdatePassword: loadable(() =>
    import("../Auth/UpdatePassword").then((module) => ({
      default: module.UpdatePassword,
    })),
  ),
  ConfirmEmailSuccess: loadable(() =>
    import("../Auth/ConfirmEmailSuccess").then((module) => ({
      default: module.ConfirmEmailSuccess,
    })),
  ),
  ConfirmEmailError: loadable(() =>
    import("../Auth/ConfirmEmailError").then((module) => ({
      default: module.ConfirmEmailError,
    })),
  ),
  ForgotPassword: loadable(() =>
    import("../Auth/ForgotPassword").then((module) => ({
      default: module.ForgotPassword,
    })),
  ),
  SignOut: loadable(() =>
    import("../Auth/SignOut").then((module) => ({
      default: module.SignOut,
    })),
  ),
  Home: loadable(() =>
    import("../Home").then((module) => ({
      default: module.Home,
    })),
  ),
  PeriodLog: loadable(() =>
    import("../PeriodLog").then((module) => ({
      default: module.PeriodLog,
    })),
  ),
  DailyLog: loadable(() =>
    import("../DailyLog").then((module) => ({
      default: module.DailyLog,
    })),
  ),
  History: loadable(() =>
    import("../History").then((module) => ({
      default: module.History,
    })),
  ),
  Profile: loadable(() =>
    import("../Profile").then((module) => ({
      default: module.Profile,
    })),
  ),
  About: loadable(() =>
    import("../Info/About").then((module) => ({
      default: module.About,
    })),
  ),
  CookiesPolicy: loadable(() =>
    import("../Info/CookiesPolicy").then((module) => ({
      default: module.CookiesPolicy,
    })),
  ),
  TermsAndConditions: loadable(() =>
    import("../Info/TermsAndConditions").then((module) => ({
      default: module.TermsAndConditions,
    })),
  ),
  PrivacyPolicy: loadable(() =>
    import("../Info/PrivacyPolicy").then((module) => ({
      default: module.PrivacyPolicy,
    })),
  ),
  FeatureUnavailable: loadable(() =>
    import("../FeatureUnavailable").then((module) => ({
      default: module.FeatureUnavailable,
    })),
  ),
  NotFound: loadable(() =>
    import("../NotFound").then((module) => ({
      default: module.NotFound,
    })),
  ),
};

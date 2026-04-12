export type FeatureUnavailableModule =
  | "history"
  | "periodLog"
  | "dailyLog"
  | "profile"
  | "about"
  | "termsAndConditions"
  | "cookiesPolicy"
  | "privacyPolicy";

export type FeatureUnavailableProps = {
  module: FeatureUnavailableModule;
};

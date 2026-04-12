export type AppFeatures = {
  historyEnabled: boolean;
  periodLogEnabled: boolean;
  dailyLogEnabled: boolean;
  profileEnabled: boolean;
  aboutEnabled: boolean;
  termsAndConditionsEnabled: boolean;
  cookiesPolicyEnabled: boolean;
  privacyPolicyEnabled: boolean;
};

export type AppFeaturesPayload = Partial<AppFeatures>;

export type FeatureFlagKey = keyof AppFeatures;

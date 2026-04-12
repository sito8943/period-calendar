import type { AppFeatures, FeatureFlagKey } from "lib";

export type FeatureFlagsContextType = {
  features: AppFeatures;
  isFeatureEnabled: (key: FeatureFlagKey) => boolean;
  refreshFeatures: () => Promise<AppFeatures>;
  clearFeatures: () => void;
};

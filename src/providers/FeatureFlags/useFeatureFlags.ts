import { useContext } from "react";
import { FeatureFlagsContext } from "./FeatureFlagsContext";
import type { FeatureFlagsContextType } from "./types";

export const useFeatureFlags = (): FeatureFlagsContextType => {
  const context = useContext(FeatureFlagsContext);

  if (!context) {
    throw new Error("useFeatureFlags must be used within FeatureFlagsProvider");
  }

  return context;
};

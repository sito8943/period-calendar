import { useCallback, useMemo, useState } from "react";
import type { BasicProviderPropTypes } from "../types";
import {
  clearPersistedFeatureFlags,
  isFeatureEnabledByDependencies,
  mergeAppFeatures,
  persistFeatureFlags,
  readPersistedFeatureFlags,
} from "lib";
import type { FeatureFlagsContextType } from "./types";
import { FeatureFlagsContext } from "./FeatureFlagsContext";
import { config } from "../../config";

export const FeatureFlagsProvider = ({ children }: BasicProviderPropTypes) => {
  const storageKey = config.featureFlags.storageKey;
  const defaults = config.featureFlags.defaults;

  const [features, setFeatures] = useState(() => {
    const persisted = readPersistedFeatureFlags(storageKey);
    return mergeAppFeatures({ defaults, persisted });
  });

  const clearFeatures = useCallback(() => {
    clearPersistedFeatureFlags(storageKey);
    setFeatures(defaults);
  }, [defaults, storageKey]);

  const refreshFeatures = useCallback(async () => {
    const persisted = readPersistedFeatureFlags(storageKey);
    const merged = mergeAppFeatures({ defaults, persisted });

    setFeatures(merged);
    persistFeatureFlags(storageKey, merged);

    return merged;
  }, [defaults, storageKey]);

  const isFeatureEnabled = useCallback<
    FeatureFlagsContextType["isFeatureEnabled"]
  >((key) => isFeatureEnabledByDependencies(features, key), [features]);

  const value = useMemo(
    () => ({
      features,
      isFeatureEnabled,
      refreshFeatures,
      clearFeatures,
    }),
    [clearFeatures, features, isFeatureEnabled, refreshFeatures],
  );

  return (
    <FeatureFlagsContext.Provider value={value}>
      {children}
    </FeatureFlagsContext.Provider>
  );
};

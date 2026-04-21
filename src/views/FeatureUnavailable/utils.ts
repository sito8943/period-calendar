import type { FeatureUnavailableModule } from "./types";

export const getFeatureUnavailableModuleTranslationKey = (
  module: FeatureUnavailableModule,
): string => {
  return `_pages:featureFlags.modules.${module}`;
};

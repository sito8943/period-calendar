import { useTranslation } from "react-i18next";

import { FeatureUnavailableView } from "@sito/dashboard-app";

import { AppRoutes } from "lib";

import type { FeatureUnavailableProps } from "./types";

export function FeatureUnavailable(props: FeatureUnavailableProps) {
  const { module } = props;
  const { t } = useTranslation();

  return (
    <FeatureUnavailableView
      title={t("_pages:featureFlags.route.title")}
      body={t("_pages:featureFlags.route.body", {
        module: t(`_pages:featureFlags.modules.${module}`),
      })}
      ctaLabel={t("_pages:featureFlags.route.cta")}
      ctaTo={AppRoutes.Home}
    />
  );
}

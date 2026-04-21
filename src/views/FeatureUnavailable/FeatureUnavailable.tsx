import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWarning } from "@fortawesome/free-solid-svg-icons";
import { AppRoute } from "lib";
import { FEATURE_UNAVAILABLE_CLASSNAMES } from "./constants";
import type { FeatureUnavailableProps } from "./types";
import { getFeatureUnavailableModuleTranslationKey } from "./utils";

export function FeatureUnavailable(props: FeatureUnavailableProps) {
  const { module } = props;
  const { t } = useTranslation();

  return (
    <main className={FEATURE_UNAVAILABLE_CLASSNAMES.root}>
      <FontAwesomeIcon
        icon={faWarning}
        className={FEATURE_UNAVAILABLE_CLASSNAMES.icon}
      />
      <h2 className={FEATURE_UNAVAILABLE_CLASSNAMES.title}>
        {t("_pages:featureFlags.route.title")}
      </h2>
      <p className={FEATURE_UNAVAILABLE_CLASSNAMES.body}>
        {t("_pages:featureFlags.route.body", {
          module: t(getFeatureUnavailableModuleTranslationKey(module)),
        })}
      </p>
      <Link to={AppRoute.Home} className={FEATURE_UNAVAILABLE_CLASSNAMES.cta}>
        {t("_pages:featureFlags.route.cta")}
      </Link>
    </main>
  );
}

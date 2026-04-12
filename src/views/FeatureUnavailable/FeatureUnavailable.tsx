import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWarning } from "@fortawesome/free-solid-svg-icons";
import { AppRoute } from "lib";
import type { FeatureUnavailableProps } from "./types";

export function FeatureUnavailable(props: FeatureUnavailableProps) {
  const { module } = props;
  const { t } = useTranslation();

  return (
    <main className="w-full h-full flex flex-col items-center justify-center gap-6 px-4 text-center">
      <FontAwesomeIcon icon={faWarning} className="text-5xl text-warning" />
      <h2 className="text-3xl max-xs:text-2xl">
        {t("_pages:featureFlags.route.title")}
      </h2>
      <p className="text-text-muted max-w-xl">
        {t("_pages:featureFlags.route.body", {
          module: t(`_pages:featureFlags.modules.${module}`),
        })}
      </p>
      <Link to={AppRoute.Home} className="button primary submit !px-10">
        {t("_pages:featureFlags.route.cta")}
      </Link>
    </main>
  );
}

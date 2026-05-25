import { useTranslation } from "react-i18next";

import { NotFoundView } from "@sito/dashboard-app";

import { AppRoutes } from "lib";

export function NotFound() {
  const { t } = useTranslation();

  return (
    <NotFoundView
      title={t("_pages:notFound.title")}
      body={t("_pages:notFound.body")}
      ctaLabel={t("_pages:pages.home")}
      ctaTo={AppRoutes.Home}
    />
  );
}

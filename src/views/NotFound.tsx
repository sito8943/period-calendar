import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { AppRoute } from "lib";

export function NotFound() {
  const { t } = useTranslation();

  return (
    <main className="flex-1 flex flex-col items-center justify-center p-4 text-center">
      <h1 className="text-2xl font-bold text-text mb-2">
        {t("_pages:notFound.title")}
      </h1>
      <p className="text-text-muted mb-6">{t("_pages:notFound.body")}</p>
      <Link
        to={AppRoute.Home}
        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-hover-primary transition-colors"
      >
        {t("_pages:pages.home")}
      </Link>
    </main>
  );
}

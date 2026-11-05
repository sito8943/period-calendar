import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import { Button } from "@sito/dashboard-app";

// providers
import { useConsent } from "providers";

// lib
import { AppRoutes } from "lib";

/**
 * Asks before turning on optional technologies. Accept and reject have the
 * same weight; the choice can be changed in Profile or the cookies policy.
 */
export function DataChoices() {
  const { t } = useTranslation();
  const { isBannerOpen, setAnalytics } = useConsent();

  if (!isBannerOpen) return null;

  return (
    <section
      className="data-choices"
      role="dialog"
      aria-live="polite"
      aria-labelledby="data-choices-title"
    >
      <div className="data-choices-text">
        <h2 id="data-choices-title" className="data-choices-title">
          {t("_pages:cookieBanner.title")}
        </h2>
        <p>
          {t("_pages:cookieBanner.body")}{" "}
          <Link to={AppRoutes.CookiesPolicy} className="data-choices-link">
            {t("_pages:cookieBanner.policy")}
          </Link>
        </p>
      </div>
      <div className="data-choices-actions">
        <Button
          type="button"
          variant="outlined"
          color="primary"
          className="data-choices-button"
          onClick={() => setAnalytics(false)}
        >
          {t("_pages:cookieBanner.reject")}
        </Button>
        <Button
          type="button"
          variant="outlined"
          color="primary"
          className="data-choices-button"
          onClick={() => setAnalytics(true)}
        >
          {t("_pages:cookieBanner.accept")}
        </Button>
      </div>
    </section>
  );
}

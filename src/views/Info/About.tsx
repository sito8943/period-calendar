import { Trans, useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { AppRoute } from "lib";

export function About() {
  const { t } = useTranslation();

  return (
    <main className="py-10 px-5 gap-5">
      <h2 className="text-4xl max-xs:text-2xl">{t("_pages:about.title")}</h2>
      <div className="text-text mt-2">
        <Trans
          i18nKey="_pages:about.body"
          components={{
            p: <p />,
            strong: <strong />,
            a: (
              <a
                href="https://sito8943.com"
                target="_blank"
                rel="noopener noreferrer"
                className="primary underline !font-bold"
              />
            ),
          }}
        />
      </div>

      <section className="mt-8 bg-base p-5 rounded-2xl">
        <h3 className="text-2xl font-bold">{t("_pages:about.legal.title")}</h3>
        <p className="mt-2">{t("_pages:about.legal.body")}</p>
        <ul className="mt-4 list-disc list-inside space-y-1">
          <li>
            <Link
              to={AppRoute.TermsAndConditions}
              className="primary underline !font-bold"
            >
              {t("_pages:about.legal.links.terms")}
            </Link>
          </li>
          <li>
            <Link
              to={AppRoute.PrivacyPolicy}
              className="primary underline !font-bold"
            >
              {t("_pages:about.legal.links.privacy")}
            </Link>
          </li>
          <li>
            <Link
              to={AppRoute.CookiesPolicy}
              className="primary underline !font-bold"
            >
              {t("_pages:about.legal.links.cookies")}
            </Link>
          </li>
        </ul>
        <p className="mt-4 text-sm text-text-muted">
          {t("_pages:about.legal.updated")}
        </p>
      </section>
    </main>
  );
}

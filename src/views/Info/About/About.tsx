import { Trans, useTranslation } from "react-i18next";

import {
  LegalLinksList,
  LegalPage,
  LegalSection,
  richTextComponents,
} from "@sito/dashboard-app";

import { AppRoutes } from "lib";

export function About() {
  const { t } = useTranslation();

  const legalLinks = [
    {
      to: AppRoutes.TermsAndConditions,
      label: t("_pages:about.legal.links.terms"),
    },
    {
      to: AppRoutes.PrivacyPolicy,
      label: t("_pages:about.legal.links.privacy"),
    },
    {
      to: AppRoutes.CookiesPolicy,
      label: t("_pages:about.legal.links.cookies"),
    },
  ];

  return (
    <LegalPage
      title={t("_pages:about.title")}
      intro={
        <Trans
          i18nKey="_pages:about.body"
          components={{
            ...richTextComponents,
            a: (
              <a
                href="https://sito8943.com"
                target="_blank"
                rel="noopener noreferrer"
                className="primary legal-external-link"
              />
            ),
          }}
        />
      }
    >
      <LegalSection
        title={t("_pages:about.legal.title")}
        className="legal-section-offset"
      >
        <p>{t("_pages:about.legal.body")}</p>
        <LegalLinksList links={legalLinks} />
        <p className="legal-updated-text">
          {t("_pages:about.legal.updated")}
        </p>
      </LegalSection>
    </LegalPage>
  );
}

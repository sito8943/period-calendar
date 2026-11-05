import { Trans, useTranslation } from "react-i18next";

import {
  Button,
  LegalPage,
  LegalSection,
  richTextComponents,
  type LegalContentSectionType,
} from "@sito/dashboard-app";

import { AppRoutes } from "lib";

// providers
import { useConsent } from "providers";

export function CookiesPolicy() {
  const { t } = useTranslation();
  const { openBanner } = useConsent();

  const sections = t("_pages:cookiesPolicy.sections", {
    returnObjects: true,
  }) as LegalContentSectionType[];

  return (
    <LegalPage
      title={t("_pages:cookiesPolicy.title")}
      intro={
        <Trans
          i18nKey="_pages:cookiesPolicy.body"
          components={richTextComponents}
        />
      }
    >
      <section className="legal-section-spaced">
        {sections.map((section, index) => (
          <LegalSection key={index} title={section.title}>
            <Trans
              i18nKey={`_pages:cookiesPolicy.sections.${index}.body`}
              values={{
                privacyPolicyHref: AppRoutes.PrivacyPolicy,
                cookiesPolicyHref: AppRoutes.CookiesPolicy,
              }}
              components={richTextComponents}
            />
          </LegalSection>
        ))}
      </section>
      <div className="legal-section-spaced">
        <Button
          type="button"
          variant="outlined"
          color="primary"
          onClick={openBanner}
        >
          {t("_pages:cookieBanner.change")}
        </Button>
      </div>
    </LegalPage>
  );
}

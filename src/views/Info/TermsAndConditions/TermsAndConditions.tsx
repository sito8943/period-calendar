import { Trans, useTranslation } from "react-i18next";

import {
  LegalPage,
  LegalSection,
  richTextComponents,
  type LegalContentSectionType,
} from "@sito/dashboard-app";

import { AppRoutes } from "lib";

export function TermsAndConditions() {
  const { t } = useTranslation();

  const sections = t("_pages:termsAndConditions.sections", {
    returnObjects: true,
  }) as LegalContentSectionType[];

  return (
    <LegalPage
      title={t("_pages:termsAndConditions.title")}
      intro={
        <Trans
          i18nKey="_pages:termsAndConditions.body"
          components={richTextComponents}
        />
      }
    >
      <section className="legal-section-spaced">
        {sections.map((section, index) => (
          <LegalSection key={index} title={section.title}>
            <Trans
              i18nKey={`_pages:termsAndConditions.sections.${index}.body`}
              values={{
                privacyPolicyHref: AppRoutes.PrivacyPolicy,
                cookiesPolicyHref: AppRoutes.CookiesPolicy,
              }}
              components={richTextComponents}
            />
          </LegalSection>
        ))}
      </section>
    </LegalPage>
  );
}

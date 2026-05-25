import { Trans, useTranslation } from "react-i18next";

import {
  LegalPage,
  LegalSection,
  richTextComponents,
  type LegalContentSectionType,
} from "@sito/dashboard-app";

export function PrivacyPolicy() {
  const { t } = useTranslation();

  const sections = t("_pages:privacyPolicy.sections", {
    returnObjects: true,
  }) as LegalContentSectionType[];

  return (
    <LegalPage
      title={t("_pages:privacyPolicy.title")}
      intro={
        <Trans
          i18nKey="_pages:privacyPolicy.body"
          components={richTextComponents}
        />
      }
    >
      <section className="legal-section-spaced">
        {sections.map((section, index) => (
          <LegalSection key={index} title={section.title}>
            <Trans
              i18nKey={`_pages:privacyPolicy.sections.${index}.body`}
              components={richTextComponents}
            />
          </LegalSection>
        ))}
      </section>
    </LegalPage>
  );
}

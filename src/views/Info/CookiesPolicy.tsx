import { Trans, useTranslation } from "react-i18next";
import { AppRoute } from "lib";
import type { TermsSection } from "./types";

export function CookiesPolicy() {
  const { t } = useTranslation();

  const sections = t("_pages:cookiesPolicy.sections", {
    returnObjects: true,
  }) as TermsSection[];

  return (
    <main className="py-10 px-5 gap-5">
      <h2 className="text-4xl max-xs:text-2xl">
        {t("_pages:cookiesPolicy.title")}
      </h2>
      <div className="text-text mt-2">
        <Trans
          i18nKey="_pages:cookiesPolicy.body"
          components={{
            p: <p />,
            strong: <strong />,
            code: <code className="bg-default px-1 rounded" />,
          }}
        />
      </div>

      <section className="mt-6 space-y-6">
        {sections.map((section, index) => (
          <div key={index} className="bg-base p-5 rounded-2xl">
            <h3 className="text-2xl max-sm:text-xl font-bold">{section.title}</h3>
            <div className="mt-2 text-text">
              <Trans
                i18nKey={`_pages:cookiesPolicy.sections.${index}.body`}
                values={{
                  privacyPolicyHref: AppRoute.PrivacyPolicy,
                  cookiesPolicyHref: AppRoute.CookiesPolicy,
                }}
                components={{
                  p: <p />,
                  strong: <strong />,
                  ul: <ul className="list-disc ml-4 space-y-1" />,
                  li: <li />,
                  code: <code className="bg-default px-1 rounded" />,
                  a: <a className="primary underline font-bold!" />,
                }}
              />
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}

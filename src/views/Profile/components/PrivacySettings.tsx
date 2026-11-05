import { useMemo } from "react";
import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import type { Option } from "@sito/dashboard-app";
import { SelectInput } from "@sito/dashboard-app";

// providers
import { useConsent } from "providers";

// constants
import { ANALYTICS_CONSENT_VALUES } from "../constants";

// Withdrawing consent must be as easy as giving it: applied instantly.
export function PrivacySettings() {
  const { t } = useTranslation();
  const { analytics, setAnalytics } = useConsent();

  const options = useMemo(
    () =>
      ANALYTICS_CONSENT_VALUES.map((id) => ({
        id,
        name: t(`_pages:profile.values.analytics.${id}`),
      })) as Option[],
    [t],
  );

  return (
    <div className="profile-card profile-appearance-card">
      <section id="privacy" className="form-section-spacious">
        <div className="form-section-header">
          <h3 className="form-section-title">
            {t("_pages:profile.sections.privacy")}
          </h3>
        </div>
        <SelectInput
          id="profile-analytics"
          label={t("_pages:profile.labels.analytics")}
          options={options}
          value={analytics ? "allowed" : "denied"}
          onChange={(event) =>
            setAnalytics(
              (event.target as HTMLSelectElement).value === "allowed",
            )
          }
        />
        <p className="helper-text">{t("_pages:profile.helper.analytics")}</p>
      </section>
    </div>
  );
}

import { useMemo } from "react";
import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import type { Option } from "@sito/dashboard-app";
import { SelectInput } from "@sito/dashboard-app";

// providers
import { useTheme } from "providers";

// lib
import { THEME_MODES, isThemeMode } from "lib";

// Device-local preference (localStorage), applied instantly: no save button.
// Independent from the girl/boy palette, which is part of the profile form.
export function AppearanceSettings() {
  const { t } = useTranslation();
  const { mode, setMode } = useTheme();

  const themeOptions = useMemo(
    () =>
      THEME_MODES.map((id) => ({
        id,
        name: t(`_pages:profile.values.colorTheme.${id}`),
      })) as Option[],
    [t],
  );

  return (
    <div className="profile-card profile-appearance-card">
      <section id="appearance" className="form-section-spacious">
        <div className="form-section-header">
          <h3 className="form-section-title">
            {t("_pages:profile.sections.appearance")}
          </h3>
        </div>
        <SelectInput
          id="profile-color-theme"
          label={t("_pages:profile.labels.colorTheme")}
          options={themeOptions}
          value={mode}
          onChange={(event) => {
            const next = (event.target as HTMLSelectElement).value;
            if (isThemeMode(next)) setMode(next);
          }}
        />
        <p className="helper-text">{t("_pages:profile.helper.colorTheme")}</p>
      </section>
    </div>
  );
}

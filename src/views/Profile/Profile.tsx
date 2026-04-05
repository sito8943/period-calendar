import { useEffect, useMemo } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

// @sito/dashboard-app
import {
  Button,
  SelectInput,
  State,
  TextInput,
  useNotification,
} from "@sito/dashboard-app";
import type { Option } from "@sito/dashboard-app";

// hooks
import { useProfileSettings, useUpdateProfileSettings } from "hooks";

// components
import { PageHeader } from "components";

// lib
import {
  getStoredPeriodTheme,
  getThemedLanguage,
  toBaseAppLanguage,
  setPeriodTheme,
  type PeriodTheme,
  type ProfileLanguage,
} from "lib";

type ProfileFormType = {
  name: string;
  language: ProfileLanguage;
  theme: PeriodTheme;
};

const normalizeProfileLanguage = (value?: string | null): ProfileLanguage =>
  toBaseAppLanguage(value);

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (error instanceof Error) return error.message;
  if (typeof error === "object" && error !== null) {
    const maybeError = error as { message?: string };
    if (typeof maybeError.message === "string") return maybeError.message;
  }
  return fallback;
};

export function Profile() {
  const { t, i18n } = useTranslation();
  const { showSuccessNotification, showErrorNotification } = useNotification();

  const navigate = useNavigate();

  const profileQuery = useProfileSettings();
  const updateProfile = useUpdateProfileSettings();

  const { control, formState, handleSubmit, reset } = useForm<ProfileFormType>({
    defaultValues: {
      name: "",
      language: normalizeProfileLanguage(
        i18n.resolvedLanguage ?? i18n.language,
      ),
      theme: getStoredPeriodTheme(),
    },
  });

  useEffect(() => {
    if (!profileQuery.data) return;
    const fallbackLanguage = normalizeProfileLanguage(
      i18n.resolvedLanguage ?? i18n.language,
    );
    const profileLanguage = profileQuery.data.updatedAt
      ? normalizeProfileLanguage(profileQuery.data.language)
      : fallbackLanguage;

    reset({
      name: profileQuery.data.name ?? "",
      language: profileLanguage,
      theme: getStoredPeriodTheme(),
    });
  }, [i18n.language, i18n.resolvedLanguage, profileQuery.data, reset]);

  const languageOptions = useMemo(
    () =>
      [
        {
          id: "en",
          name: t("_pages:profile.values.languageEnglish"),
        },
        {
          id: "es",
          name: t("_pages:profile.values.languageSpanish"),
        },
      ] as Option[],
    [t],
  );

  const themeOptions = useMemo(
    () =>
      [
        {
          id: "girl",
          name: t("_pages:profile.values.themeGirl"),
        },
        {
          id: "boy",
          name: t("_pages:profile.values.themeBoy"),
        },
      ] as Option[],
    [t],
  );

  const currentName = useWatch({ control, name: "name" }) ?? "";
  const normalizedName = currentName.trim();
  const formDisabled = profileQuery.isLoading || updateProfile.isPending;
  const saveDisabled =
    formDisabled ||
    !formState.isDirty ||
    !normalizedName.length ||
    normalizedName.length > 120;

  const onSubmit = handleSubmit(async (values) => {
    const payload = {
      name: values.name.trim(),
      language: normalizeProfileLanguage(values.language),
    };

    try {
      await updateProfile.mutateAsync(payload);

      setPeriodTheme(values.theme);
      const themedLanguage = getThemedLanguage(payload.language, values.theme);
      if (i18n.language !== themedLanguage) {
        await i18n.changeLanguage(themedLanguage);
      }

      reset({ ...payload, theme: values.theme });
      showSuccessNotification({
        message: t("_pages:profile.messages.updated"),
      });
    } catch (error) {
      showErrorNotification({
        message: getErrorMessage(
          error,
          t("_pages:profile.messages.updateError"),
        ),
      });
    }
  });

  return (
    <main className="flex-1 p-4 max-w-lg mx-auto w-full">
      <PageHeader title={t("_pages:profile.title")} onBack={() => navigate(-1)} />

      <div className="w-full base-border sm:p-6 p-4 rounded-2xl flex flex-col gap-6">
        <form
          className="flex flex-col gap-6 form-motion-stagger"
          onSubmit={(event) => {
            event.preventDefault();
            void onSubmit(event);
          }}
        >
          <section id="personal" className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <h3 className="text-xs uppercase tracking-wide text-text-muted">
                {t("_pages:profile.sections.personal")}
              </h3>
            </div>

            <Controller
              control={control}
              name="name"
              disabled={formDisabled}
              rules={{
                validate: (value: string) => {
                  const parsedValue = value.trim();
                  if (!parsedValue.length) {
                    return t("_pages:profile.errors.nameRequired");
                  }
                  if (parsedValue.length > 120) {
                    return t("_pages:profile.errors.nameMax");
                  }
                  return true;
                },
              }}
              render={({ field, fieldState }) => (
                <TextInput
                  id="profile-name"
                  required
                  maxLength={120}
                  label={t("_pages:profile.labels.name")}
                  value={field.value ?? ""}
                  helperText={
                    typeof fieldState.error?.message === "string"
                      ? fieldState.error.message
                      : ""
                  }
                  state={fieldState.error ? State.error : State.default}
                  disabled={formDisabled}
                  onBlur={field.onBlur}
                  onChange={(event) =>
                    field.onChange((event.target as HTMLInputElement).value)
                  }
                />
              )}
            />

            <Controller
              control={control}
              name="theme"
              disabled={formDisabled}
              render={({ field }) => (
                <SelectInput
                  id="profile-theme"
                  required
                  label={t("_pages:profile.labels.theme")}
                  options={themeOptions}
                  value={field.value}
                  disabled={formDisabled}
                  onBlur={field.onBlur}
                  onChange={(event) =>
                    field.onChange(
                      (event.target as HTMLSelectElement).value as PeriodTheme,
                    )
                  }
                />
              )}
            />
            <p className="text-sm text-text-muted">
              {t("_pages:profile.helper.theme")}
            </p>

            <Controller
              control={control}
              name="language"
              disabled={formDisabled}
              render={({ field }) => (
                <SelectInput
                  id="profile-language"
                  required
                  label={t("_pages:profile.labels.language")}
                  options={languageOptions}
                  value={normalizeProfileLanguage(field.value)}
                  disabled={formDisabled}
                  onBlur={field.onBlur}
                  onChange={(event) =>
                    field.onChange(
                      normalizeProfileLanguage(
                        (event.target as HTMLSelectElement).value,
                      ),
                    )
                  }
                />
              )}
            />
            <p className="text-sm text-text-muted">
              {t("_pages:profile.helper.language")}
            </p>
          </section>

          <div className="flex">
            <Button
              type="submit"
              variant="submit"
              color="primary"
              className="max-sm:w-full"
              disabled={saveDisabled}
            >
              {t("_pages:profile.actions.save")}
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}

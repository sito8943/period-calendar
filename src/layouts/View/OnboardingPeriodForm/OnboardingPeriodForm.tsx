import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import {
  Button,
  State,
  TextInput,
  useNotification,
} from "@sito/dashboard-app";

// hooks
import { useAddPeriod } from "hooks";

// lib
import { toISODateString } from "lib";

// constants
import { ONBOARDING_PERIOD_FORM_INITIAL_END_DATE } from "./constants";

// types
import type { OnboardingPeriodFormValues } from "./types";

// utils
import { getErrorMessage } from "./utils";

export function OnboardingPeriodForm() {
  const { t } = useTranslation();
  const { showErrorNotification, showSuccessNotification } = useNotification();
  const addPeriod = useAddPeriod();
  const todayStr = toISODateString(new Date());

  const { control, handleSubmit } = useForm<OnboardingPeriodFormValues>({
    defaultValues: {
      startDate: todayStr,
      endDate: ONBOARDING_PERIOD_FORM_INITIAL_END_DATE,
    },
  });

  const formDisabled = addPeriod.isPending;

  const onSubmit = (data: OnboardingPeriodFormValues) => {
    addPeriod.mutate(
      {
        startDate: data.startDate,
        endDate: data.endDate || null,
      },
      {
        onSuccess: () => {
          showSuccessNotification({
            message: t("_pages:periodLog.messages.saved"),
          });
        },
        onError: (error) => {
          showErrorNotification({
            message: getErrorMessage(
              error,
              t("_pages:periodLog.messages.saveError"),
            ),
          });
        },
      },
    );
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-3 form-motion-stagger"
    >
      <Controller
        control={control}
        name="startDate"
        disabled={formDisabled}
        rules={{
          required: t("_pages:periodLog.validation.startRequired"),
        }}
        render={({ field, fieldState }) => (
          <TextInput
            id="onboardingStartDate"
            type="date"
            max={todayStr}
            required
            label={t("_pages:periodLog.startDate")}
            value={field.value ?? ""}
            state={fieldState.error ? State.error : State.default}
            helperText={
              typeof fieldState.error?.message === "string"
                ? fieldState.error.message
                : ""
            }
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
        name="endDate"
        disabled={formDisabled}
        rules={{
          validate: (value, formValues) => {
            if (!value || !formValues.startDate) return true;
            if (value <= formValues.startDate) {
              return t("_pages:periodLog.validation.endAfterStart");
            }
            return true;
          },
        }}
        render={({ field, fieldState }) => (
          <TextInput
            id="onboardingEndDate"
            type="date"
            max={todayStr}
            label={
              <>
                {t("_pages:periodLog.endDate")}{" "}
                <span className="text-text-muted text-xs">
                  ({t("_pages:periodLog.optional")})
                </span>
              </>
            }
            value={field.value ?? ""}
            state={fieldState.error ? State.error : State.default}
            helperText={
              typeof fieldState.error?.message === "string"
                ? fieldState.error.message
                : ""
            }
            disabled={formDisabled}
            onBlur={field.onBlur}
            onChange={(event) =>
              field.onChange((event.target as HTMLInputElement).value)
            }
          />
        )}
      />

      <div className="flex">
        <Button
          type="submit"
          variant="submit"
          color="primary"
          className="max-sm:w-full"
          disabled={formDisabled}
        >
          {t("_pages:periodLog.save")}
        </Button>
      </div>
    </form>
  );
}

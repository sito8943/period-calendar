import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

// @sito/dashboard-app
import {
  Button,
  CheckInput,
  ParagraphInput,
  SelectInput,
  State,
  TextInput,
  useNotification,
} from "@sito/dashboard-app";
import type { Option } from "@sito/dashboard-app";

// hooks
import {
  useAddDailyLog,
  useDeleteDailyLog,
  useDailyLogByDate,
  useUpdateDailyLog,
  useCanGoBack,
} from "hooks";

// components
import { PageHeader } from "components";

// lib
import {
  AppRoutes,
  FLOW_LEVELS,
  SEXUAL_PROTECTION_OPTIONS,
  SYMPTOM_KEYS,
  formatDate,
  getDailyLogRoute,
  toISODateString,
} from "lib";
import type {
  AddDailyLogDto,
  MoodLevel,
  SleepQuality,
  SymptomKey,
  UpdateDailyLogDto,
} from "lib";

// types
import type { DailyLogFormValues } from "./types";

// utils
import { getErrorMessage, isValidIsoDate, toNullableNumber } from "./utils";

export function DailyLog() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { date: routeDate = "" } = useParams<{ date: string }>();
  const canGoBack = useCanGoBack();
  const { showErrorNotification, showSuccessNotification } = useNotification();

  const todayStr = toISODateString(new Date());
  const targetDate = isValidIsoDate(routeDate) ? routeDate : todayStr;

  const existingDailyLog = useDailyLogByDate(targetDate);
  const addDailyLog = useAddDailyLog();
  const updateDailyLog = useUpdateDailyLog();
  const deleteDailyLog = useDeleteDailyLog();

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { isDirty },
  } = useForm<DailyLogFormValues>({
    defaultValues: {
      date: targetDate,
      flow: "",
      symptoms: [],
      hadSex: false,
      protection: "",
      mood: "",
      sleepHours: "",
      sleepQuality: "",
      notes: "",
    },
  });

  const hadSex = watch("hadSex");

  const formDisabled =
    addDailyLog.isPending ||
    updateDailyLog.isPending ||
    deleteDailyLog.isPending;

  const flowOptions = useMemo<Option[]>(
    () => [
      { id: "", name: t("_pages:dailyLog.noFlow") },
      ...FLOW_LEVELS.map((level) => ({
        id: level,
        name: t(`_pages:dailyLog.flowOptions.${level}`),
      })),
    ],
    [t],
  );

  const protectionOptions = useMemo<Option[]>(
    () => [
      { id: "", name: t("_pages:dailyLog.protectionOptions.unknown") },
      ...SEXUAL_PROTECTION_OPTIONS.map((option) => ({
        id: option,
        name: t(`_pages:dailyLog.protectionOptions.${option}`),
      })),
    ],
    [t],
  );

  const moodOptions = useMemo<Option[]>(
    () => [
      { id: "", name: t("_pages:dailyLog.noMood") },
      { id: "1", name: t("_pages:dailyLog.moodOptions.1") },
      { id: "2", name: t("_pages:dailyLog.moodOptions.2") },
      { id: "3", name: t("_pages:dailyLog.moodOptions.3") },
      { id: "4", name: t("_pages:dailyLog.moodOptions.4") },
      { id: "5", name: t("_pages:dailyLog.moodOptions.5") },
    ],
    [t],
  );

  const sleepQualityOptions = useMemo<Option[]>(
    () => [
      { id: "", name: t("_pages:dailyLog.noSleepQuality") },
      { id: "1", name: t("_pages:dailyLog.sleepQualityOptions.1") },
      { id: "2", name: t("_pages:dailyLog.sleepQualityOptions.2") },
      { id: "3", name: t("_pages:dailyLog.sleepQualityOptions.3") },
      { id: "4", name: t("_pages:dailyLog.sleepQualityOptions.4") },
      { id: "5", name: t("_pages:dailyLog.sleepQualityOptions.5") },
    ],
    [t],
  );

  const resolveMutationError = (error: unknown, fallback: string): string => {
    const message = getErrorMessage(error, fallback);
    if (message === "A daily log already exists for this date") {
      return t("_pages:dailyLog.errors.duplicateDate");
    }
    return message;
  };

  useEffect(() => {
    if (routeDate && isValidIsoDate(routeDate)) return;
    navigate(getDailyLogRoute(todayStr), { replace: true });
  }, [navigate, routeDate, todayStr]);

  useEffect(() => {
    if (existingDailyLog) {
      reset({
        date: existingDailyLog.date,
        flow: existingDailyLog.flow ?? "",
        symptoms: existingDailyLog.symptoms,
        hadSex: existingDailyLog.sexualActivity?.hadSex ?? false,
        protection: existingDailyLog.sexualActivity?.protection ?? "",
        mood: existingDailyLog.mood
          ? (String(existingDailyLog.mood) as DailyLogFormValues["mood"])
          : "",
        sleepHours:
          existingDailyLog.sleepHours !== null
            ? String(existingDailyLog.sleepHours)
            : "",
        sleepQuality: existingDailyLog.sleepQuality
          ? (String(
              existingDailyLog.sleepQuality,
            ) as DailyLogFormValues["sleepQuality"])
          : "",
        notes: existingDailyLog.notes,
      });
      return;
    }

    reset({
      date: targetDate,
      flow: "",
      symptoms: [],
      hadSex: false,
      protection: "",
      mood: "",
      sleepHours: "",
      sleepQuality: "",
      notes: "",
    });
  }, [existingDailyLog, reset, targetDate]);

  useEffect(() => {
    if (hadSex) return;
    setValue("protection", "", { shouldValidate: true });
  }, [hadSex, setValue]);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!isDirty) return;
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  const onSubmit = handleSubmit(async (data) => {
    const basePayload: AddDailyLogDto = {
      date: data.date,
      flow: data.flow || null,
      symptoms: [...new Set(data.symptoms)],
      sexualActivity: data.hadSex
        ? {
            hadSex: true,
            protection: data.protection || "unknown",
          }
        : null,
      mood: toNullableNumber(data.mood) as MoodLevel | null,
      sleepHours: toNullableNumber(data.sleepHours),
      sleepQuality: toNullableNumber(data.sleepQuality) as SleepQuality | null,
      notes: data.notes.trim(),
    };

    try {
      if (existingDailyLog) {
        const payload: UpdateDailyLogDto = {
          id: existingDailyLog.id,
          ...basePayload,
        };
        await updateDailyLog.mutateAsync(payload);
      } else {
        await addDailyLog.mutateAsync(basePayload);
      }

      showSuccessNotification({
        message: t("_pages:dailyLog.messages.saved"),
      });
      navigate(AppRoutes.Home);
    } catch (error) {
      showErrorNotification({
        message: resolveMutationError(
          error,
          t("_pages:dailyLog.messages.saveError"),
        ),
      });
    }
  });

  const handleDelete = async () => {
    if (!existingDailyLog) return;
    try {
      await deleteDailyLog.mutateAsync(existingDailyLog.id);
      showSuccessNotification({
        message: t("_pages:dailyLog.messages.deleted"),
      });
      navigate(AppRoutes.Home);
    } catch (error) {
      showErrorNotification({
        message: resolveMutationError(
          error,
          t("_pages:dailyLog.messages.deleteError"),
        ),
      });
    }
  };

  const handleCancel = () => {
    if (isDirty && !window.confirm(t("_pages:dailyLog.discardDialog.title"))) {
      return;
    }
    navigate(AppRoutes.Home);
  };

  const displayDate = useMemo(
    () => formatDate(targetDate, i18n.language),
    [i18n.language, targetDate],
  );

  return (
    <main className="page-content">
      <PageHeader
        title={
          existingDailyLog
            ? t("_pages:dailyLog.editTitle")
            : t("_pages:dailyLog.title")
        }
        onBack={canGoBack ? () => navigate(-1) : undefined}
        subtitle={displayDate}
      />

      <form
        onSubmit={(event) => {
          event.preventDefault();
          void onSubmit(event);
        }}
        className="form-stack form-motion-stagger"
      >
        <Controller
          control={control}
          name="date"
          rules={{
            required: t("_pages:dailyLog.errors.dateRequired"),
            validate: (value) => {
              if (!isValidIsoDate(value)) {
                return t("_pages:dailyLog.errors.dateInvalid");
              }
              if (value > todayStr) {
                return t("_pages:dailyLog.errors.notFuture");
              }
              return true;
            },
          }}
          render={({ field, fieldState }) => (
            <TextInput
              id="dailyDate"
              type="date"
              max={todayStr}
              label={`${t("_pages:dailyLog.date")}*`}
              value={field.value ?? ""}
              disabled={formDisabled}
              state={fieldState.error ? State.error : State.default}
              helperText={
                typeof fieldState.error?.message === "string"
                  ? fieldState.error.message
                  : ""
              }
              onBlur={field.onBlur}
              onChange={(event) =>
                field.onChange((event.target as HTMLInputElement).value)
              }
            />
          )}
        />

        <Controller
          control={control}
          name="flow"
          render={({ field }) => (
            <SelectInput
              id="flow"
              label={t("_pages:dailyLog.flow")}
              value={field.value ?? ""}
              options={flowOptions}
              disabled={formDisabled}
              onBlur={field.onBlur}
              onChange={(event) =>
                field.onChange((event.target as HTMLSelectElement).value)
              }
            />
          )}
        />

        <Controller
          control={control}
          name="symptoms"
          render={({ field }) => (
            <fieldset className="form-section">
              <legend className="form-legend">
                {t("_pages:dailyLog.symptoms")}
              </legend>
              <div className="form-checkbox-grid">
                {SYMPTOM_KEYS.map((symptom) => {
                  const checked = field.value.includes(symptom);
                  return (
                    <CheckInput
                      key={symptom}
                      id={`symptom-${symptom}`}
                      label={t(`_pages:dailyLog.symptomOptions.${symptom}`)}
                      checked={checked}
                      disabled={formDisabled}
                      containerClassName="form-checkbox-card"
                      onChange={(event) => {
                        const isChecked = (event.target as HTMLInputElement)
                          .checked;
                        const current = field.value ?? [];
                        const next = isChecked
                          ? [...current, symptom]
                          : current.filter(
                              (item: SymptomKey) => item !== symptom,
                            );
                        field.onChange([...new Set(next)]);
                      }}
                    />
                  );
                })}
              </div>
            </fieldset>
          )}
        />

        <fieldset className="form-section">
          <legend className="form-legend">
            {t("_pages:dailyLog.sexualActivity")}
          </legend>

          <Controller
            control={control}
            name="hadSex"
            render={({ field }) => (
              <CheckInput
                id="hadSex"
                label={t("_pages:dailyLog.hadSex")}
                checked={field.value}
                disabled={formDisabled}
                onBlur={field.onBlur}
                onChange={(event) =>
                  field.onChange((event.target as HTMLInputElement).checked)
                }
              />
            )}
          />

          {hadSex && (
            <div className="form-inline-appear">
              <Controller
                control={control}
                name="protection"
                render={({ field }) => (
                  <SelectInput
                    id="protection"
                    label={t("_pages:dailyLog.protection")}
                    value={field.value ?? ""}
                    options={protectionOptions}
                    disabled={formDisabled}
                    onBlur={field.onBlur}
                    onChange={(event) =>
                      field.onChange((event.target as HTMLSelectElement).value)
                    }
                  />
                )}
              />
            </div>
          )}
        </fieldset>

        <div className="form-two-column-grid">
          <Controller
            control={control}
            name="mood"
            render={({ field }) => (
              <SelectInput
                id="mood"
                label={t("_pages:dailyLog.mood")}
                value={field.value ?? ""}
                options={moodOptions}
                disabled={formDisabled}
                onBlur={field.onBlur}
                onChange={(event) =>
                  field.onChange((event.target as HTMLSelectElement).value)
                }
              />
            )}
          />

          <Controller
            control={control}
            name="sleepQuality"
            render={({ field }) => (
              <SelectInput
                id="sleepQuality"
                label={t("_pages:dailyLog.sleepQuality")}
                value={field.value ?? ""}
                options={sleepQualityOptions}
                disabled={formDisabled}
                onBlur={field.onBlur}
                onChange={(event) =>
                  field.onChange((event.target as HTMLSelectElement).value)
                }
              />
            )}
          />
        </div>

        <Controller
          control={control}
          name="sleepHours"
          rules={{
            validate: (value) => {
              if (!value) return true;
              const parsed = Number(value);
              if (Number.isNaN(parsed) || parsed < 0 || parsed > 24) {
                return t("_pages:dailyLog.errors.sleepHoursRange");
              }
              return true;
            },
          }}
          render={({ field, fieldState }) => (
            <TextInput
              id="sleepHours"
              type="number"
              step="0.5"
              min="0"
              max="24"
              inputMode="decimal"
              label={t("_pages:dailyLog.sleepHours")}
              value={field.value ?? ""}
              disabled={formDisabled}
              state={fieldState.error ? State.error : State.default}
              helperText={
                typeof fieldState.error?.message === "string"
                  ? fieldState.error.message
                  : ""
              }
              onBlur={field.onBlur}
              onChange={(event) =>
                field.onChange((event.target as HTMLInputElement).value)
              }
            />
          )}
        />

        <Controller
          control={control}
          name="notes"
          render={({ field }) => (
            <ParagraphInput
              id="notes"
              rows={4}
              maxLength={500}
              label={t("_pages:dailyLog.notes")}
              value={field.value ?? ""}
              disabled={formDisabled}
              onBlur={field.onBlur}
              onChange={(event) =>
                field.onChange((event.target as HTMLTextAreaElement).value)
              }
            />
          )}
        />

        <div className="form-actions">
          <Button type="submit" variant="submit" color="primary">
            {t("_pages:dailyLog.save")}
          </Button>

          <Button
            type="button"
            variant="outlined"
            color="primary"
            onClick={handleCancel}
          >
            {t("_pages:dailyLog.cancel")}
          </Button>

          {existingDailyLog && (
            <>
              {showDeleteConfirm ? (
                <div className="daily-log-delete-confirm">
                  <p className="daily-log-delete-title">
                    {t("_pages:dailyLog.deleteDialog.title")}
                  </p>
                  <div className="daily-log-delete-actions">
                    <Button
                      variant="submit"
                      color="primary"
                      onClick={() => setShowDeleteConfirm(false)}
                      className="daily-log-delete-action"
                    >
                      {t("_pages:dailyLog.deleteDialog.cancel")}
                    </Button>
                    <button
                      type="button"
                      onClick={() => void handleDelete()}
                      className="daily-log-delete-confirm-button"
                    >
                      {t("_pages:dailyLog.deleteDialog.confirm")}
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="daily-log-delete-trigger"
                >
                  <FontAwesomeIcon icon={faTrash} />
                  {t("_pages:dailyLog.delete")}
                </button>
              )}
            </>
          )}
        </div>
      </form>
    </main>
  );
}

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

// @sito/dashboard-app
import {
  Button,
  ConfirmationDialog,
  State,
  TextInput,
  useNotification,
} from "@sito/dashboard-app";

// hooks
import {
  usePeriodsList,
  useAddPeriod,
  useUpdatePeriod,
  useDeletePeriod,
} from "hooks";

// components
import { PageHeader } from "components";

// lib
import { toISODateString } from "lib";
import type { FormValues } from "./types";

export function PeriodLog() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { showSuccessNotification } = useNotification();
  const { data: periods = [] } = usePeriodsList();
  const addPeriod = useAddPeriod();
  const updatePeriod = useUpdatePeriod();
  const deletePeriod = useDeletePeriod();

  const isEditing = Boolean(id);
  const existingPeriod = id ? periods.find((p) => p.id === id) : undefined;

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const todayStr = toISODateString(new Date());

  const { control, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: {
      startDate: "",
      endDate: "",
    },
  });

  useEffect(() => {
    if (existingPeriod) {
      reset({
        startDate: existingPeriod.startDate,
        endDate: existingPeriod.endDate ?? "",
      });
    }
  }, [existingPeriod, reset]);

  const onSubmit = (data: FormValues) => {
    const payload = {
      startDate: data.startDate,
      endDate: data.endDate || null,
    };

    if (isEditing && id) {
      updatePeriod.mutate(
        { id, ...payload },
        {
          onSuccess: () => {
            showSuccessNotification({
              message: t("_pages:periodLog.messages.saved"),
            });
            navigate("/");
          },
        },
      );
    } else {
      addPeriod.mutate(payload, {
        onSuccess: () => {
          showSuccessNotification({
            message: t("_pages:periodLog.messages.saved"),
          });
          navigate("/");
        },
      });
    }
  };

  const handleDelete = () => {
    if (!id) return;
    deletePeriod.mutate(id, {
      onSuccess: () => {
        showSuccessNotification({
          message: t("_pages:periodLog.messages.deleted"),
        });
        navigate("/");
      },
    });
  };

  return (
    <main className="flex-1 p-4 max-w-lg mx-auto w-full">
      <PageHeader
        title={
          isEditing
            ? t("_pages:periodLog.editTitle")
            : t("_pages:periodLog.title")
        }
        onBack={() => navigate(-1)}
      />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 form-motion-stagger"
      >
        {/* Start date */}
        <Controller
          control={control}
          name="startDate"
          rules={{
            required: t("_pages:periodLog.validation.startRequired"),
          }}
          render={({ field, fieldState }) => (
            <TextInput
              id="startDate"
              type="date"
              max={todayStr}
              label={t("_pages:periodLog.startDate")}
              value={field.value ?? ""}
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

        {/* End date */}
        <Controller
          control={control}
          name="endDate"
          rules={{
            validate: (value, formValues) => {
              if (!value) return true;
              if (value <= formValues.startDate) {
                return t("_pages:periodLog.validation.endAfterStart");
              }
              return true;
            },
          }}
          render={({ field, fieldState }) => (
            <TextInput
              id="endDate"
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
              onBlur={field.onBlur}
              onChange={(event) =>
                field.onChange((event.target as HTMLInputElement).value)
              }
            />
          )}
        />

        {/* Actions */}
        <div className="flex gap-3 mt-4">
          <Button type="submit" variant="submit" color="primary">
            {t("_pages:periodLog.save")}
          </Button>

          {isEditing && (
            <>
              <Button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                variant="outlined"
                color="error"
                className="px-10"
              >
                <FontAwesomeIcon icon={faTrash} />
                {t("_pages:periodLog.delete")}
              </Button>
              <ConfirmationDialog
                open={showDeleteConfirm}
                title={t("_pages:periodLog.deleteDialog.title")}
                handleClose={() => setShowDeleteConfirm(false)}
                handleSubmit={handleDelete}
                isLoading={deletePeriod.isPending}
              />
            </>
          )}
        </div>
      </form>
    </main>
  );
}

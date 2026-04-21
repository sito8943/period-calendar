import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";

import {
  Button,
  Loading,
  State,
  TextInput,
  useNotification,
  useOptionalAuthContext,
} from "@sito/dashboard-app";

import { AppRoute, supabase } from "lib";
import type { ForgotPasswordFormType } from "./types";
import { mapForgotPasswordErrorKey } from "./utils";
import "./styles.css";

export function ForgotPassword() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const auth = useOptionalAuthContext();
  const accountToken = auth?.account?.token;
  const { showErrorNotification, showSuccessNotification } = useNotification();
  const [submittedEmail, setSubmittedEmail] = useState("");

  const { handleSubmit, control, formState, setError } =
    useForm<ForgotPasswordFormType>({
      defaultValues: {
        email: "",
      },
    });

  useEffect(() => {
    if (accountToken) {
      navigate(AppRoute.Home, { replace: true });
    }
  }, [accountToken, navigate]);

  const onSubmit = handleSubmit(async (values) => {
    if (!supabase) {
      showErrorNotification({
        message: t("_accessibility:errors.forgotPassword.supabaseNotConfigured"),
      });
      return;
    }

    const recoveryRedirectTo =
      typeof window === "undefined"
        ? undefined
        : new URL(AppRoute.SignIn, window.location.origin).toString();

    const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
      ...(recoveryRedirectTo ? { redirectTo: recoveryRedirectTo } : {}),
    });

    if (error) {
      const messageKey = mapForgotPasswordErrorKey(error.message);
      showErrorNotification({ message: t(messageKey) });
      setError("email", {
        type: "manual",
        message: t(messageKey),
      });
      return;
    }

    setSubmittedEmail(values.email);
    showSuccessNotification({
      message: t("_accessibility:messages.forgotPasswordEmailSent"),
    });
  });

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <form onSubmit={onSubmit} className="auth-form blur-appear">
        <h1 className="w-full text-2xl mb-1">
          {t("_pages:auth.forgotPassword.title")}
        </h1>
        <p className="w-full text-sm mb-2">
          {t("_pages:auth.forgotPassword.description")}
        </p>

        <div className="form-container w-full">
          <Controller
            control={control}
            name="email"
            rules={{ required: t("_entities:user.email.required") }}
            render={({ field, fieldState }) => (
              <TextInput
                {...field}
                type="email"
                id="forgot-password-email"
                value={field.value ?? ""}
                inputClassName="peer"
                label={t("_entities:user.email.label")}
                required
                disabled={formState.isSubmitting}
                helperText={fieldState.error?.message}
                state={fieldState.error ? State.error : State.default}
              />
            )}
          />
        </div>

        {!!submittedEmail && (
          <p className="w-full text-sm text-left mt-1">
            {t("_pages:auth.forgotPassword.sent", { email: submittedEmail })}
          </p>
        )}

        <div className="self-start mt-1">
          <p className="ml-1">
            {t("_pages:auth.forgotPassword.toLogin.question")}
            <Link
              to={AppRoute.SignIn}
              className="ml-1 primary text-sm underline text-left"
            >
              {t("_pages:auth.forgotPassword.toLogin.link")}
            </Link>
          </p>
        </div>

        <div className="flex max-xs:flex-col gap-3 mt-4 w-full">
          <Button
            type="submit"
            color="primary"
            variant="submit"
            className="!px-8"
            disabled={formState.isSubmitting}
            aria-label={t("_accessibility:ariaLabels.submit")}
          >
            {formState.isSubmitting && (
              <Loading
                color="stroke-base"
                loaderClass="!w-6"
                className="!w-auto"
                strokeWidth="6"
              />
            )}
            {t("_pages:auth.forgotPassword.submit")}
          </Button>
        </div>
      </form>
    </div>
  );
}

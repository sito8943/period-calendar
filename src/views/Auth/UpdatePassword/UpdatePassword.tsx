import { useMemo } from "react";
import { useMutation } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate } from "react-router-dom";

// @sito/dashboard-app
import {
  Button,
  Loading,
  PasswordInput,
  State,
  extractAuthQueryParamFromLocation,
  extractAuthSessionTokensFromLocation,
  getAuthErrorMessage,
  hasAuthErrorParamsInLocation,
  useNotification,
} from "@sito/dashboard-app";

// lib
import { AppRoutes, AuthRouteQueryParam } from "lib";

// providers
import { useManager } from "providers";

import type { UpdatePasswordFormType } from "./types";
import {
  mapUpdatePasswordErrorKey,
  normalizeRecoveryTokenType,
} from "./utils";

import "../styles.css";

export function UpdatePassword() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { showErrorNotification, showSuccessNotification } = useNotification();
  const manager = useManager();

  const { handleSubmit, control, setError } = useForm<UpdatePasswordFormType>({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const hasAuthErrorParams = useMemo(
    () => hasAuthErrorParamsInLocation(location.hash, location.search),
    [location.hash, location.search],
  );

  const sessionTokens = useMemo(
    () => extractAuthSessionTokensFromLocation(location.hash, location.search),
    [location.hash, location.search],
  );

  const recoveryTokenType = useMemo(
    () =>
      normalizeRecoveryTokenType(
        extractAuthQueryParamFromLocation(
          location.hash,
          location.search,
          AuthRouteQueryParam.Type,
        ),
      ),
    [location.hash, location.search],
  );

  const updatePasswordMutation = useMutation({
    mutationFn: async (values: UpdatePasswordFormType) => {
      if (hasAuthErrorParams) {
        showErrorNotification({
          message: t("_pages:auth.updatePassword.invalidToken"),
        });
        return;
      }

      const tokenHash = extractAuthQueryParamFromLocation(
        location.hash,
        location.search,
        AuthRouteQueryParam.TokenHash,
      );

      try {
        if (tokenHash) {
          if (!recoveryTokenType) {
            showErrorNotification({
              message: t("_pages:auth.updatePassword.invalidToken"),
            });
            return;
          }

          await manager.AuthApi.resetPassword({
            tokenHash,
            type: recoveryTokenType,
            newPassword: values.password,
          });
        } else if (sessionTokens) {
          await manager.AuthApi.resetPassword({
            accessToken: sessionTokens.accessToken,
            refreshToken: sessionTokens.refreshToken,
            newPassword: values.password,
          });
        } else {
          showErrorNotification({
            message: t("_pages:auth.updatePassword.invalidToken"),
          });
          return;
        }
      } catch (error) {
        showErrorNotification({
          message: t(mapUpdatePasswordErrorKey(getAuthErrorMessage(error))),
        });
        return;
      }

      showSuccessNotification({
        message: t("_pages:auth.updatePassword.sent"),
      });

      setTimeout(() => {
        navigate(AppRoutes.SignIn, { replace: true });
      }, 1200);
    },
  });

  const isSubmitting = updatePasswordMutation.isPending;

  const onSubmit = handleSubmit((values) => {
    if (isSubmitting) return;

    if (values.password !== values.confirmPassword) {
      const message = t("_accessibility:errors.differentPasswords");
      setError("confirmPassword", {
        type: "manual",
        message,
      });
      showErrorNotification({ message });
      return;
    }

    updatePasswordMutation.mutate(values);
  });

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <form onSubmit={onSubmit} className="auth-form blur-appear">
        <h1 className="auth-title">
          {t("_pages:auth.updatePassword.title")}
        </h1>

        <div className="form-container w-full">
          <Controller
            control={control}
            name="password"
            rules={{ required: t("_entities:user.password.required") }}
            render={({ field, fieldState }) => (
              <PasswordInput
                {...field}
                id="update-password-password"
                value={field.value ?? ""}
                inputClassName="peer"
                label={t("_entities:user.password.label")}
                required
                disabled={isSubmitting}
                helperText={fieldState.error?.message}
                state={fieldState.error ? State.error : State.default}
              />
            )}
          />

          <Controller
            control={control}
            name="confirmPassword"
            rules={{ required: t("_entities:user.confirmPassword.required") }}
            render={({ field, fieldState }) => (
              <PasswordInput
                {...field}
                id="update-password-confirm-password"
                value={field.value ?? ""}
                inputClassName="peer"
                label={t("_entities:user.confirmPassword.label")}
                required
                disabled={isSubmitting}
                helperText={fieldState.error?.message}
                state={fieldState.error ? State.error : State.default}
              />
            )}
          />
        </div>

        <div className="self-start mt-1">
          <p className="ml-1">
            {t("_pages:auth.updatePassword.toLogin.question")}
            <Link
              to={AppRoutes.SignIn}
              className="ml-1 primary text-sm underline text-left"
            >
              {t("_pages:auth.updatePassword.toLogin.link")}
            </Link>
          </p>
        </div>

        <div className="flex max-xs:flex-col gap-3 mt-4 w-full">
          <Button
            type="submit"
            variant="submit"
            color="primary"
            className="px-8!"
            disabled={isSubmitting}
            aria-label={t("_accessibility:ariaLabels.submit")}
          >
            {isSubmitting && (
              <Loading
                color="stroke-base"
                loaderClass="!w-6"
                className="w-auto!"
                strokeWidth="6"
              />
            )}
            {t("_pages:auth.updatePassword.submit")}
          </Button>
        </div>
      </form>
    </div>
  );
}

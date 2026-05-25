import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

// @sito/dashboard-app
import {
  AuthRecoveryView,
  buildAuthRedirectUrl,
  getAuthErrorMessage,
  useNotification,
  useOptionalAuthContext,
} from "@sito/dashboard-app";
import type { RecoveryFormType } from "@sito/dashboard-app";

// lib
import { AppRoutes } from "lib";

// providers
import { useManager } from "providers";

// utils
import { mapForgotPasswordErrorKey } from "./utils";

export function ForgotPassword() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const auth = useOptionalAuthContext();
  const accountToken = auth?.account?.token;
  const { showErrorNotification, showSuccessNotification } = useNotification();
  const manager = useManager();
  const [submittedEmail, setSubmittedEmail] = useState("");

  useEffect(() => {
    if (accountToken) {
      navigate(AppRoutes.Home, { replace: true });
    }
  }, [accountToken, navigate]);

  const onSubmit = async (values: RecoveryFormType) => {
    await manager.AuthApi.forgotPassword({
      email: values.email,
      redirectTo: buildAuthRedirectUrl(AppRoutes.UpdatePassword),
    });
    setSubmittedEmail(values.email);
    showSuccessNotification({
      message: t("_accessibility:messages.forgotPasswordEmailSent"),
    });
  };

  return (
    <AuthRecoveryView
      title={t("_pages:auth.forgotPassword.title")}
      motion="blur"
      showBackButton
      backTo={AppRoutes.SignIn}
      backButtonLabel={t("_accessibility:buttons.back")}
      description={t("_pages:auth.forgotPassword.description")}
      statusMessage={
        submittedEmail
          ? t("_pages:auth.forgotPassword.sent", { email: submittedEmail })
          : undefined
      }
      statusMessageVariant="success"
      emailLabel={t("_entities:user.email.label")}
      emailRequiredMessage={t("_entities:user.email.required")}
      submitLabel={t("_pages:auth.forgotPassword.submit")}
      submitAriaLabel={t("_accessibility:ariaLabels.submit")}
      signInQuestion={t("_pages:auth.forgotPassword.toLogin.question")}
      signInLabel={t("_pages:auth.forgotPassword.toLogin.link")}
      signInTo={AppRoutes.SignIn}
      onSubmit={onSubmit}
      onError={(error, { setError }) => {
        const messageKey = mapForgotPasswordErrorKey(
          getAuthErrorMessage(error),
        );
        showErrorNotification({ message: t(messageKey) });
        setError("email", {
          type: "manual",
          message: t(messageKey),
        });
      }}
    />
  );
}

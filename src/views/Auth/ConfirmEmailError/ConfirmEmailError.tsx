import { useTranslation } from "react-i18next";

import { AuthConfirmEmailErrorView } from "@sito/dashboard-app";

import { AppRoutes } from "lib";

import "../styles.css";

export function ConfirmEmailError() {
  const { t } = useTranslation();

  return (
    <AuthConfirmEmailErrorView
      title={t("_pages:auth.confirmEmailError.title")}
      showBackButton
      backTo={AppRoutes.SignIn}
      backButtonLabel={t("_accessibility:buttons.back")}
      description={t("_pages:auth.confirmEmailError.description")}
      resendLabel={t("_pages:auth.confirmEmailError.resend")}
      resendAriaLabel={t("_pages:auth.confirmEmailError.resend")}
      toSignInLabel={t("_pages:auth.confirmEmailError.toSignIn")}
      toSignInAriaLabel={t("_pages:auth.confirmEmailError.toSignIn")}
      resendTo={AppRoutes.ForgotPassword}
      signInTo={AppRoutes.SignIn}
    />
  );
}

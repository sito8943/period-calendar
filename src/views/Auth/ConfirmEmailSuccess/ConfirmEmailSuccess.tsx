import { useTranslation } from "react-i18next";

import { AuthConfirmEmailSuccessView } from "@sito/dashboard-app";

import { AppRoutes } from "lib";
import { useManager } from "providers";

import "../styles.css";

export function ConfirmEmailSuccess() {
  const { t } = useTranslation();
  const manager = useManager();

  return (
    <AuthConfirmEmailSuccessView
      authApi={manager.AuthApi}
      title={t("_pages:auth.confirmEmailSuccess.title")}
      showBackButton
      backTo={AppRoutes.SignIn}
      backButtonLabel={t("_accessibility:buttons.back")}
      description={t("_pages:auth.confirmEmailSuccess.description")}
      toSignInLabel={t("_pages:auth.confirmEmailSuccess.toSignIn")}
      toSignInAriaLabel={t("_pages:auth.confirmEmailSuccess.toSignIn")}
      signInTo={AppRoutes.SignIn}
      errorTo={AppRoutes.ConfirmEmailError}
      successTo={AppRoutes.ConfirmEmailSuccess}
    />
  );
}

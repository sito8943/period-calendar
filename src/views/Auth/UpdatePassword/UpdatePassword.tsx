import { useTranslation } from "react-i18next";

import {
  AuthUpdatePasswordView,
  getAuthErrorMessage,
  useNotification,
} from "@sito/dashboard-app";

import { AppRoutes } from "lib";
import { useManager } from "providers";

import { mapUpdatePasswordErrorKey } from "./utils";

import "../styles.css";

export function UpdatePassword() {
  const { t } = useTranslation();
  const manager = useManager();
  const { showErrorNotification, showSuccessNotification } = useNotification();

  return (
    <AuthUpdatePasswordView
      authApi={manager.AuthApi}
      title={t("_pages:auth.updatePassword.title")}
      showBackButton
      backTo={AppRoutes.SignIn}
      backButtonLabel={t("_accessibility:buttons.back")}
      passwordLabel={t("_entities:user.password.label")}
      confirmPasswordLabel={t("_entities:user.confirmPassword.label")}
      passwordRequiredMessage={t("_entities:user.password.required")}
      confirmPasswordRequiredMessage={t(
        "_entities:user.confirmPassword.required",
      )}
      passwordMismatchMessage={t("_accessibility:errors.differentPasswords")}
      submitLabel={t("_pages:auth.updatePassword.submit")}
      submitAriaLabel={t("_accessibility:ariaLabels.submit")}
      signInQuestion={t("_pages:auth.updatePassword.toLogin.question")}
      signInLabel={t("_pages:auth.updatePassword.toLogin.link")}
      signInTo={AppRoutes.SignIn}
      onSuccess={() =>
        showSuccessNotification({
          message: t("_pages:auth.updatePassword.sent"),
        })
      }
      onInvalidToken={() =>
        showErrorNotification({
          message: t("_pages:auth.updatePassword.invalidToken"),
        })
      }
      onPasswordMismatch={() =>
        showErrorNotification({
          message: t("_accessibility:errors.differentPasswords"),
        })
      }
      onError={(error) =>
        showErrorNotification({
          message: t(mapUpdatePasswordErrorKey(getAuthErrorMessage(error))),
        })
      }
    />
  );
}

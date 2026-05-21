import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

// @sito/dashboard-app
import {
  AuthSignUpView,
  buildAuthRedirectUrl,
  getAuthErrorMessage,
  useNotification,
  useOptionalAuthContext,
} from "@sito/dashboard-app";

// lib
import { AppRoutes, getSignUpConfirmationRoute } from "lib";

// providers
import { useManager } from "providers";

// utils
import { mapSignUpErrorKey } from "./utils";

// styles
import "../styles.css";

export function SignUp() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const auth = useOptionalAuthContext();
  const accountToken = auth?.account?.token;
  const { showErrorNotification } = useNotification();
  const manager = useManager();

  useEffect(() => {
    if (accountToken) {
      navigate(AppRoutes.Home, { replace: true });
    }
  }, [accountToken, navigate]);

  return (
    <AuthSignUpView
      title={t("_pages:auth.signUp.title")}
      motion="blur"
      showBackButton
      backTo={AppRoutes.SignIn}
      backButtonLabel={t("_accessibility:buttons.back")}
      nameLabel={t("_entities:user.name.label")}
      emailLabel={t("_entities:user.email.label")}
      passwordLabel={t("_entities:user.password.label")}
      confirmPasswordLabel={t("_entities:user.confirmPassword.label")}
      nameRequiredMessage={t("_entities:user.name.required")}
      emailRequiredMessage={t("_entities:user.email.required")}
      passwordRequiredMessage={t("_entities:user.password.required")}
      confirmPasswordRequiredMessage={t(
        "_entities:user.confirmPassword.required",
      )}
      passwordMismatchMessage={t("_accessibility:errors.differentPasswords")}
      submitLabel={t("_pages:auth.signUp.submit")}
      submitAriaLabel={t("_accessibility:ariaLabels.submit")}
      signInQuestion={t("_pages:auth.signUp.toLogin.question")}
      signInLabel={t("_pages:auth.signUp.toLogin.link")}
      signInTo={AppRoutes.SignIn}
      guestLabel={t("_pages:auth.signUp.guest")}
      guestAriaLabel={t("_accessibility:ariaLabels.startAsGuest")}
      onSubmit={async (values) => {
        const confirmEmailRedirectTo = buildAuthRedirectUrl(
          AppRoutes.ConfirmEmailSuccess,
        );

        const result = await manager.Auth.signUp({
          name: values.name,
          username: values.name,
          email: values.email,
          password: values.password,
          rPassword: values.confirmPassword,
          redirectTo: confirmEmailRedirectTo,
        });

        if (result.status === "confirmation_required") {
          navigate(getSignUpConfirmationRoute(result.email), { replace: true });
          return;
        }

        if (!auth) {
          navigate(AppRoutes.Home, { replace: true });
          return;
        }

        auth.logUser(result.session, true);
        auth.setGuestMode(false);
        navigate(AppRoutes.Home, { replace: true });
      }}
      onStartAsGuest={() => {
        auth?.setGuestMode(true);
        navigate(AppRoutes.Home, { replace: true });
      }}
      onPasswordMismatch={() =>
        showErrorNotification({
          message: t("_accessibility:errors.differentPasswords"),
        })
      }
      onError={(error) => {
        const messageKey = mapSignUpErrorKey(getAuthErrorMessage(error));
        showErrorNotification({ message: t(messageKey) });
      }}
    />
  );
}

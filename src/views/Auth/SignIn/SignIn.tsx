import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

// @sito/dashboard-app
import {
  AuthSignInView,
  getAuthErrorMessage,
  useNotification,
  useOptionalAuthContext,
} from "@sito/dashboard-app";

// lib
import { AppRoutes } from "lib";

// providers
import { useManager } from "providers";

// utils
import { mapSignInErrorKey } from "./utils";

// styles
import "../styles.css";

export function SignIn() {
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
    <AuthSignInView
      title={t("_pages:auth.signIn.title")}
      motion="blur"
      emailLabel={t("_entities:user.email.label")}
      passwordLabel={t("_entities:user.password.label")}
      rememberLabel={t("_pages:auth.signIn.remember")}
      emailRequiredMessage={t("_entities:user.email.required")}
      passwordRequiredMessage={t("_entities:user.password.required")}
      submitLabel={t("_pages:auth.signIn.submit")}
      submitAriaLabel={t("_accessibility:ariaLabels.submit")}
      signUpQuestion={t("_pages:auth.signIn.toRegister.question")}
      signUpLabel={t("_pages:auth.signIn.toRegister.link")}
      signUpTo={AppRoutes.SignUp}
      recoveryQuestion={t("_pages:auth.signIn.accountRecovery.question")}
      recoveryLabel={t("_pages:auth.signIn.accountRecovery.link")}
      recoveryTo={AppRoutes.ForgotPassword}
      guestLabel={t("_pages:auth.signIn.guest")}
      guestAriaLabel={t("_accessibility:ariaLabels.startAsGuest")}
      onSubmit={async (values) => {
        const session = await manager.Auth.login(values);

        if (!auth) {
          navigate(AppRoutes.Home, { replace: true });
          return;
        }

        auth.logUser(session, values.rememberMe);
        auth.setGuestMode(false);
        navigate(AppRoutes.Home, { replace: true });
      }}
      onStartAsGuest={() => {
        auth?.setGuestMode(true);
        navigate(AppRoutes.Home, { replace: true });
      }}
      onError={(error, { setError }) => {
        const messageKey = mapSignInErrorKey(getAuthErrorMessage(error));
        showErrorNotification({ message: t(messageKey) });

        setError("password", {
          type: "manual",
          message: t(messageKey),
        });
      }}
    />
  );
}

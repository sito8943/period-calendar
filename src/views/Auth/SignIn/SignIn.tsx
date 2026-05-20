import { useEffect, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";

// @sito/dashboard-app
import {
  AuthFormShell,
  Button,
  Loading,
  getAuthErrorMessage,
  useNotification,
  useOptionalAuthContext,
  type AuthFormFieldDefinitionType,
} from "@sito/dashboard-app";

// lib
import { AppRoutes } from "lib";

// providers
import { useManager } from "providers";

// types
import type { SignInFormType } from "./types";

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
  const rememberMeRef = useRef(false);

  const { handleSubmit, control, formState, setError } =
    useForm<SignInFormType>({
      defaultValues: {
        email: "",
        password: "",
        rememberMe: false,
      },
    });

  useEffect(() => {
    if (accountToken) {
      navigate(AppRoutes.Home, { replace: true });
    }
  }, [accountToken, navigate]);

  const fields = useMemo<AuthFormFieldDefinitionType<SignInFormType>[]>(
    () => [
      {
        kind: "text",
        name: "email",
        id: "sign-in-email",
        type: "email",
        label: t("_entities:user.email.label"),
        required: true,
        rules: { required: t("_entities:user.email.required") },
      },
      {
        kind: "password",
        name: "password",
        id: "sign-in-password",
        label: t("_entities:user.password.label"),
        required: true,
        rules: { required: t("_entities:user.password.required") },
      },
      {
        kind: "checkbox",
        name: "rememberMe",
        id: "rememberMe",
        label: t("_pages:auth.signIn.remember"),
        containerClassName: "ml-1",
      },
    ],
    [t],
  );

  const onSubmit = handleSubmit(async (values) => {
    rememberMeRef.current = values.rememberMe;
    try {
      const session = await manager.Auth.login(values);

      if (!auth) {
        navigate(AppRoutes.Home, { replace: true });
        return;
      }

      auth.logUser(session, rememberMeRef.current);
      auth.setGuestMode(false);
      navigate(AppRoutes.Home, { replace: true });
    } catch (error) {
      const messageKey = mapSignInErrorKey(getAuthErrorMessage(error));
      showErrorNotification({ message: t(messageKey) });

      setError("password", {
        type: "manual",
        message: t(messageKey),
      });
    }
  });

  const helperLinks = (
    <>
      <p className="auth-form-helper-text">
        {t("_pages:auth.signIn.toRegister.question")}
        <Link to={AppRoutes.SignUp} className="auth-form-helper-link">
          {t("_pages:auth.signIn.toRegister.link")}
        </Link>
      </p>
      <p className="auth-form-helper-text">
        {t("_pages:auth.signIn.accountRecovery.question")}
        <Link to={AppRoutes.ForgotPassword} className="auth-form-helper-link">
          {t("_pages:auth.signIn.accountRecovery.link")}
        </Link>
      </p>
    </>
  );

  const actions = (
    <>
      <Button
        type="submit"
        color="primary"
        variant="submit"
        className="auth-submit-button"
        disabled={formState.isSubmitting}
        aria-label={t("_accessibility:ariaLabels.submit")}
      >
        {formState.isSubmitting && (
          <Loading
            color="stroke-base"
            loaderClass="auth-loading-icon"
            className="auth-loading"
            strokeWidth="6"
          />
        )}
        {t("_pages:auth.signIn.submit")}
      </Button>

      <Button
        type="button"
        variant="outlined"
        disabled={formState.isSubmitting}
        onClick={() => {
          auth?.setGuestMode(true);
          navigate(AppRoutes.Home, { replace: true });
        }}
        aria-label={t("_accessibility:ariaLabels.startAsGuest")}
      >
        {t("_pages:auth.signIn.guest")}
      </Button>
    </>
  );

  return (
    <AuthFormShell
      title={t("_pages:auth.signIn.title")}
      motion="blur"
      control={control}
      fields={fields}
      disabled={formState.isSubmitting}
      onSubmit={(event) => {
        void onSubmit(event);
      }}
      helperLinks={helperLinks}
      actions={actions}
    />
  );
}

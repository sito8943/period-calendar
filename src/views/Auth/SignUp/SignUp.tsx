import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";

// @sito/dashboard-app
import {
  AuthFormShell,
  Button,
  Loading,
  buildAuthRedirectUrl,
  getAuthErrorMessage,
  useNotification,
  useOptionalAuthContext,
  type AuthFormFieldDefinitionType,
} from "@sito/dashboard-app";

// lib
import { AppRoutes, getSignUpConfirmationRoute } from "lib";

// providers
import { useManager } from "providers";

// types
import type { SignUpFormType } from "./types";

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

  const { handleSubmit, control, formState, setError } =
    useForm<SignUpFormType>({
      defaultValues: {
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      },
    });

  useEffect(() => {
    if (accountToken) {
      navigate(AppRoutes.Home, { replace: true });
    }
  }, [accountToken, navigate]);

  const fields = useMemo<AuthFormFieldDefinitionType<SignUpFormType>[]>(
    () => [
      {
        kind: "text",
        name: "name",
        id: "sign-up-name",
        type: "text",
        label: t("_entities:user.name.label"),
        required: true,
        rules: { required: t("_entities:user.name.required") },
      },
      {
        kind: "text",
        name: "email",
        id: "sign-up-email",
        type: "email",
        label: t("_entities:user.email.label"),
        required: true,
        rules: { required: t("_entities:user.email.required") },
      },
      {
        kind: "password",
        name: "password",
        id: "sign-up-password",
        label: t("_entities:user.password.label"),
        required: true,
        rules: { required: t("_entities:user.password.required") },
      },
      {
        kind: "password",
        name: "confirmPassword",
        id: "sign-up-confirm-password",
        label: t("_entities:user.confirmPassword.label"),
        required: true,
        rules: { required: t("_entities:user.confirmPassword.required") },
      },
    ],
    [t],
  );

  const onSubmit = handleSubmit(async (values) => {
    if (values.password !== values.confirmPassword) {
      const errorMessage = t("_accessibility:errors.differentPasswords");
      setError("confirmPassword", {
        type: "manual",
        message: errorMessage,
      });
      showErrorNotification({ message: errorMessage });
      return;
    }

    const confirmEmailRedirectTo = buildAuthRedirectUrl(
      AppRoutes.ConfirmEmailSuccess,
    );

    try {
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
    } catch (error) {
      const messageKey = mapSignUpErrorKey(getAuthErrorMessage(error));
      showErrorNotification({ message: t(messageKey) });
    }
  });

  const helperLinks = (
    <p className="auth-form-helper-text">
      {t("_pages:auth.signUp.toLogin.question")}
      <Link to={AppRoutes.SignIn} className="auth-form-helper-link">
        {t("_pages:auth.signUp.toLogin.link")}
      </Link>
    </p>
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
            className="auth-loading"
            color="stroke-base"
            loaderClass="auth-loading-icon"
            strokeWidth="6"
          />
        )}
        {t("_pages:auth.signUp.submit")}
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
        {t("_pages:auth.signUp.guest")}
      </Button>
    </>
  );

  return (
    <AuthFormShell
      title={t("_pages:auth.signUp.title")}
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

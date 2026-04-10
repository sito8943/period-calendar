import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";

import {
  Button,
  Loading,
  PasswordInput,
  State,
  TextInput,
  mapSupabaseSessionToSessionDto,
  useOptionalAuthContext,
  useNotification,
} from "@sito/dashboard-app";

import { AppRoute, getSignUpConfirmationRoute, supabase } from "lib";
import type { SignUpFormType } from "./types";
import "./styles.css";

const mapSignUpErrorKey = (message: string): string => {
  const normalized = message.toLowerCase();

  if (normalized.includes("already registered") || normalized.includes("already exists")) {
    return "_accessibility:errors.signUp.emailAlreadyInUse";
  }

  return "_accessibility:errors.signUp.generic";
};

export function SignUp() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const auth = useOptionalAuthContext();
  const accountToken = auth?.account?.token;
  const { showErrorNotification } = useNotification();

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
      navigate(AppRoute.Home, { replace: true });
    }
  }, [accountToken, navigate]);

  const onSubmit = handleSubmit(async (values) => {
    if (!supabase || !auth) {
      showErrorNotification({
        message: t("_accessibility:errors.signUp.supabaseNotConfigured"),
      });
      return;
    }

    if (values.password !== values.confirmPassword) {
      const errorMessage = t("_accessibility:errors.differentPasswords");
      setError("confirmPassword", {
        type: "manual",
        message: errorMessage,
      });
      showErrorNotification({ message: errorMessage });
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        data: {
          name: values.name,
          username: values.name,
        },
      },
    });

    if (error) {
      const messageKey = mapSignUpErrorKey(error.message);
      showErrorNotification({ message: t(messageKey) });
      return;
    }

    if (!data.session) {
      navigate(getSignUpConfirmationRoute(values.email), { replace: true });
      return;
    }

    auth.logUser(
      mapSupabaseSessionToSessionDto(data.session, {
        defaultUsername: values.name,
        defaultEmail: values.email,
      }),
      true,
    );

    auth.setGuestMode(false);
    navigate(AppRoute.Home, { replace: true });
  });

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <form onSubmit={onSubmit} className="auth-form blur-appear">
        <h1 className="w-full text-2xl mb-1">{t("_pages:auth.signUp.title")}</h1>

        <div className="form-container w-full">
          <Controller
            control={control}
            name="name"
            rules={{ required: t("_entities:user.name.required") }}
            render={({ field, fieldState }) => (
              <TextInput
                {...field}
                type="text"
                id="sign-up-name"
                value={field.value ?? ""}
                inputClassName="peer"
                label={t("_entities:user.name.label")}
                required
                disabled={formState.isSubmitting}
                helperText={fieldState.error?.message}
                state={fieldState.error ? State.error : State.default}
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            rules={{ required: t("_entities:user.email.required") }}
            render={({ field, fieldState }) => (
              <TextInput
                {...field}
                type="email"
                id="sign-up-email"
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

          <Controller
            control={control}
            name="password"
            rules={{ required: t("_entities:user.password.required") }}
            render={({ field, fieldState }) => (
              <PasswordInput
                {...field}
                id="sign-up-password"
                value={field.value ?? ""}
                inputClassName="peer"
                label={t("_entities:user.password.label")}
                required
                disabled={formState.isSubmitting}
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
                id="sign-up-confirm-password"
                value={field.value ?? ""}
                inputClassName="peer"
                label={t("_entities:user.confirmPassword.label")}
                required
                disabled={formState.isSubmitting}
                helperText={fieldState.error?.message}
                state={fieldState.error ? State.error : State.default}
              />
            )}
          />
        </div>

        <div className="self-start">
          <p className="ml-1">
            {t("_pages:auth.signUp.toLogin.question")}
            <Link to={AppRoute.SignIn} className="ml-1 primary text-sm underline text-left">
              {t("_pages:auth.signUp.toLogin.link")}
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
                className="!w-auto"
                color="stroke-base"
                loaderClass="!w-6"
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
              navigate(AppRoute.Home, { replace: true });
            }}
            aria-label={t("_accessibility:ariaLabels.startAsGuest")}
          >
            {t("_pages:auth.signUp.guest")}
          </Button>
        </div>
      </form>
    </div>
  );
}

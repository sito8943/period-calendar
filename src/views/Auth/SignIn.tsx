import { useEffect, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";

import {
  Button,
  CheckInput,
  Loading,
  PasswordInput,
  State,
  TextInput,
  mapSupabaseSessionToSessionDto,
  useOptionalAuthContext,
  useNotification,
} from "@sito/dashboard-app";

import { AppRoute, supabase } from "lib";
import type { SignInFormType } from "./types";
import "./styles.css";

const mapSignInErrorKey = (message: string): string => {
  const normalized = message.toLowerCase();

  if (
    normalized.includes("invalid login") ||
    normalized.includes("invalid credentials") ||
    normalized.includes("email not confirmed")
  ) {
    return "_accessibility:errors.signIn.invalidCredentials";
  }

  return "_accessibility:errors.signIn.generic";
};

export function SignIn() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const auth = useOptionalAuthContext();
  const accountToken = auth?.account?.token;
  const { showErrorNotification } = useNotification();
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
      navigate(AppRoute.Home, { replace: true });
    }
  }, [accountToken, navigate]);

  const onSubmit = handleSubmit(async (values) => {
    if (!supabase || !auth) {
      showErrorNotification({
        message: t("_accessibility:errors.signIn.supabaseNotConfigured"),
      });
      return;
    }

    rememberMeRef.current = values.rememberMe;

    const { data, error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });

    if (error || !data.session) {
      const messageKey = mapSignInErrorKey(error?.message ?? "");
      showErrorNotification({ message: t(messageKey) });

      setError("password", {
        type: "manual",
        message: t(messageKey),
      });
      return;
    }

    auth.logUser(
      mapSupabaseSessionToSessionDto(data.session, {
        defaultUsername: values.email,
        defaultEmail: values.email,
      }),
      rememberMeRef.current,
    );
    auth.setGuestMode(false);
    navigate(AppRoute.Home, { replace: true });
  });

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <form onSubmit={onSubmit} className="auth-form blur-appear">
        <h1 className="w-full text-2xl mb-1">
          {t("_pages:auth.signIn.title")}
        </h1>

        <div className="form-container w-full">
          <Controller
            control={control}
            name="email"
            rules={{ required: t("_entities:user.email.required") }}
            render={({ field, fieldState }) => (
              <TextInput
                {...field}
                type="email"
                id="sign-in-email"
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
                id="sign-in-password"
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
        </div>

        <div className="self-start mt-1">
          <Controller
            control={control}
            name="rememberMe"
            render={({ field }) => (
              <CheckInput
                id="rememberMe"
                name={field.name}
                label={t("_pages:auth.signIn.remember")}
                checked={!!field.value}
                disabled={formState.isSubmitting}
                containerClassName="ml-1"
                onBlur={field.onBlur}
                onChange={(event) =>
                  field.onChange(event.currentTarget.checked)
                }
              />
            )}
          />
        </div>

        <div className="self-start">
          <p className="ml-1">
            {t("_pages:auth.signIn.toRegister.question")}
            <Link
              to={AppRoute.SignUp}
              className="ml-1 primary text-sm underline text-left"
            >
              {t("_pages:auth.signIn.toRegister.link")}
            </Link>
          </p>
        </div>

        <div className="self-start">
          <p className="ml-1">
            {t("_pages:auth.signIn.accountRecovery.question")}
            <Link
              to={AppRoute.ForgotPassword}
              className="ml-1 primary text-sm underline text-left"
            >
              {t("_pages:auth.signIn.accountRecovery.link")}
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
                color="stroke-base"
                loaderClass="!w-6"
                className="!w-auto"
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
              navigate(AppRoute.Home, { replace: true });
            }}
            aria-label={t("_accessibility:ariaLabels.startAsGuest")}
          >
            {t("_pages:auth.signIn.guest")}
          </Button>
        </div>
      </form>
    </div>
  );
}

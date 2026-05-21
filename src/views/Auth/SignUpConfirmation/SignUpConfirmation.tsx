import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";

// @sito/dashboard-app
import {
  AuthSignUpConfirmationView,
  useOptionalAuthContext,
} from "@sito/dashboard-app";

// lib
import { AppRoutes, RouteQueryParam } from "lib";

export function SignUpConfirmation() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const auth = useOptionalAuthContext();
  const accountToken = auth?.account?.token;

  const email = searchParams.get(RouteQueryParam.Email) ?? "";

  useEffect(() => {
    if (accountToken) {
      navigate(AppRoutes.Home, { replace: true });
    }
  }, [accountToken, navigate]);

  const description = email.length
    ? t("_pages:auth.signUpConfirmation.descriptionWithEmail", {
        email,
      })
    : t("_pages:auth.signUpConfirmation.description");

  return (
    <AuthSignUpConfirmationView
      title={t("_pages:auth.signUpConfirmation.title")}
      description={description}
      motion="blur"
      showBackButton
      backTo={AppRoutes.SignIn}
      backButtonLabel={t("_accessibility:buttons.back")}
      toSignInLabel={t("_pages:auth.signUpConfirmation.cta")}
      toSignInAriaLabel={t("_pages:auth.signUpConfirmation.cta")}
      onSignIn={() => navigate(AppRoutes.SignIn, { replace: true })}
    />
  );
}

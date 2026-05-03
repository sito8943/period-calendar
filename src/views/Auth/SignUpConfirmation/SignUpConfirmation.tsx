import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";

// @sito/dashboard-app
import { Button, useOptionalAuthContext } from "@sito/dashboard-app";

// lib
import { AppRoute, RouteQueryParam } from "lib";

// styles
import "../styles.css";

export function SignUpConfirmation() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const auth = useOptionalAuthContext();
  const accountToken = auth?.account?.token;

  const email = searchParams.get(RouteQueryParam.Email) ?? "";

  useEffect(() => {
    if (accountToken) {
      navigate(AppRoute.Home, { replace: true });
    }
  }, [accountToken, navigate]);

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <form className="auth-form blur-appear">
        <h1 className="auth-title">
          {t("_pages:auth.signUpConfirmation.title")}
        </h1>

        <div className="form-container w-full">
          <p className="w-full text-sm">
            {email.length
              ? t("_pages:auth.signUpConfirmation.descriptionWithEmail", {
                  email,
                })
              : t("_pages:auth.signUpConfirmation.description")}
          </p>
        </div>

        <div className="flex max-xs:flex-col gap-3 mt-4 w-full">
          <Button
            type="button"
            color="primary"
            variant="submit"
            className="px-8!"
            onClick={() => navigate(AppRoute.SignIn, { replace: true })}
            aria-label={t("_pages:auth.signUpConfirmation.cta")}
          >
            {t("_pages:auth.signUpConfirmation.cta")}
          </Button>
        </div>
      </form>
    </div>
  );
}

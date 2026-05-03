import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

// @sito/dashboard-app
import { Button } from "@sito/dashboard-app";

// lib
import { AppRoute } from "lib";

import "../styles.css";

export function ConfirmEmailError() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="auth-form blur-appear">
        <h1 className="auth-title">
          {t("_pages:auth.confirmEmailError.title")}
        </h1>

        <p className="w-full mb-4">
          {t("_pages:auth.confirmEmailError.description")}
        </p>

        <div className="flex max-xs:flex-col gap-3 w-full">
          <Button
            type="button"
            color="primary"
            variant="submit"
            className="px-8!"
            onClick={() => navigate(AppRoute.ForgotPassword, { replace: true })}
            aria-label={t("_pages:auth.confirmEmailError.resend")}
          >
            {t("_pages:auth.confirmEmailError.resend")}
          </Button>

          <Button
            type="button"
            variant="outlined"
            className="px-8!"
            onClick={() => navigate(AppRoute.SignIn, { replace: true })}
            aria-label={t("_pages:auth.confirmEmailError.toSignIn")}
          >
            {t("_pages:auth.confirmEmailError.toSignIn")}
          </Button>
        </div>
      </div>
    </div>
  );
}

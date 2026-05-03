import { useEffect, useMemo } from "react";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

// @sito/dashboard-app
import { Button, Loading } from "@sito/dashboard-app";

// lib
import { AppRoute, AuthRouteQueryParam, supabase } from "lib";

import { normalizeConfirmEmailTokenType } from "./utils";
import {
  extractAuthQueryParamFromLocation,
  hasAuthErrorParamsInLocation,
} from "../utils";

import "../styles.css";

export function ConfirmEmailSuccess() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const hasAuthErrorParams = useMemo(
    () => hasAuthErrorParamsInLocation(location.hash, location.search),
    [location.hash, location.search],
  );

  const tokenHash = useMemo(
    () =>
      extractAuthQueryParamFromLocation(
        location.hash,
        location.search,
        AuthRouteQueryParam.TokenHash,
      ),
    [location.hash, location.search],
  );

  const tokenType = useMemo(
    () =>
      normalizeConfirmEmailTokenType(
        extractAuthQueryParamFromLocation(
          location.hash,
          location.search,
          AuthRouteQueryParam.Type,
        ),
      ),
    [location.hash, location.search],
  );

  const requiresVerification =
    hasAuthErrorParams || tokenHash !== null || tokenType !== null;

  const verifyEmailMutation = useMutation({
    mutationFn: async () => {
      if (!supabase) {
        navigate(AppRoute.ConfirmEmailError, { replace: true });
        return;
      }

      if (hasAuthErrorParams) {
        navigate(AppRoute.ConfirmEmailError, { replace: true });
        return;
      }

      if (!tokenHash || !tokenType) {
        navigate(AppRoute.ConfirmEmailError, { replace: true });
        return;
      }

      const { error } = await supabase.auth.verifyOtp({
        token_hash: tokenHash,
        type: tokenType,
      });

      if (error) {
        navigate(AppRoute.ConfirmEmailError, { replace: true });
        return;
      }

      await supabase.auth.signOut();

      const shouldCleanUrl = location.search.length > 0 || location.hash.length > 0;
      if (shouldCleanUrl) {
        navigate(AppRoute.ConfirmEmailSuccess, { replace: true });
        return;
      }
    },
  });

  const verifyEmail = verifyEmailMutation.mutate;
  const verifyEmailStatus = verifyEmailMutation.status;
  const isVerifyEmailSuccess = verifyEmailMutation.isSuccess;

  useEffect(() => {
    if (!requiresVerification) return;
    if (verifyEmailStatus !== "idle") return;
    verifyEmail();
  }, [requiresVerification, verifyEmail, verifyEmailStatus]);

  const isVerifying =
    requiresVerification && !isVerifyEmailSuccess;

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="auth-form blur-appear">
        <h1 className="auth-title">
          {t("_pages:auth.confirmEmailSuccess.title")}
        </h1>

        <p className="w-full mb-4">
          {t("_pages:auth.confirmEmailSuccess.description")}
        </p>

        <div className="flex max-xs:flex-col gap-3 w-full">
          {isVerifying ? (
            <Loading
              color="stroke-primary"
              loaderClass="!w-6"
              className="w-auto!"
              strokeWidth="6"
            />
          ) : (
            <Button
              type="button"
              color="primary"
              variant="submit"
              className="px-8!"
              onClick={() => navigate(AppRoute.SignIn, { replace: true })}
              aria-label={t("_pages:auth.confirmEmailSuccess.toSignIn")}
            >
              {t("_pages:auth.confirmEmailSuccess.toSignIn")}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

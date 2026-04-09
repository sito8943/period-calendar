import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { SplashScreen, useOptionalAuthContext } from "@sito/dashboard-app";

import { AppRoute } from "lib";

export function SignOut() {
  const navigate = useNavigate();
  const auth = useOptionalAuthContext();

  const logic = useCallback(async () => {
    try {
      auth?.setGuestMode(false);
      await auth?.logoutUser();
    } catch (error) {
      console.error("Error during sign out:", error);
    }

    window.setTimeout(() => {
      navigate(AppRoute.SignIn, { replace: true });
    }, 500);
  }, [auth, navigate]);

  useEffect(() => {
    logic();
  }, [logic]);

  return <SplashScreen />;
}

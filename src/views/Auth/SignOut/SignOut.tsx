import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// @sito/dashboard-app
import { SplashScreen, useOptionalAuthContext } from "@sito/dashboard-app";

// lib
import { AppRoutes } from "lib";

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
      navigate(AppRoutes.SignIn, { replace: true });
    }, 500);
  }, [auth, navigate]);

  useEffect(() => {
    logic();
  }, [logic]);

  return <SplashScreen />;
}

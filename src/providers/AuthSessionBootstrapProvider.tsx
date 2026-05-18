import { useEffect, useRef } from "react";

import {
  mapSupabaseSessionToSessionDto,
  useAuth,
} from "@sito/dashboard-app";

import type { BasicProviderPropTypes } from "./types";
import { config } from "../config";
import { supabase } from "../lib/supabase";

export const AuthSessionBootstrapProvider = ({
  children,
}: BasicProviderPropTypes) => {
  const { logUser, logoutUser } = useAuth();
  const handlingSignOutRef = useRef(false);

  useEffect(() => {
    if (!supabase) return;

    let mounted = true;

    const syncSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (!mounted) return;

      if (error || !data.session) {
        if (handlingSignOutRef.current) return;

        handlingSignOutRef.current = true;

        try {
          await logoutUser();
        } finally {
          if (mounted) {
            window.setTimeout(() => {
              handlingSignOutRef.current = false;
            }, 0);
          } else {
            handlingSignOutRef.current = false;
          }
        }

        return;
      }

      handlingSignOutRef.current = false;
      logUser(
        mapSupabaseSessionToSessionDto(data.session),
        localStorage.getItem(config.auth.remember) === "true",
      );
    };

    void syncSession();

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;

      if (!session) {
        if (handlingSignOutRef.current) return;

        handlingSignOutRef.current = true;

        void logoutUser().finally(() => {
          if (!mounted) {
            handlingSignOutRef.current = false;
            return;
          }

          window.setTimeout(() => {
            handlingSignOutRef.current = false;
          }, 0);
        });

        return;
      }

      handlingSignOutRef.current = false;
      logUser(
        mapSupabaseSessionToSessionDto(session),
        localStorage.getItem(config.auth.remember) === "true",
      );
    });

    return () => {
      mounted = false;
      data.subscription.unsubscribe();
    };
  }, [logUser, logoutUser]);

  return <>{children}</>;
};

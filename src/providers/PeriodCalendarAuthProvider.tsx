import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  AuthContext,
  fromLocal,
  mapSupabaseSessionToSessionDto,
  removeFromLocal,
  type SessionAccountDto,
  type SessionDto,
  toLocal,
} from "@sito/dashboard-app";

import type { BasicProviderPropTypes } from "./types";
import { config } from "../config";
import { supabase } from "../lib/supabase";

export const PeriodCalendarAuthProvider = ({
  children,
}: BasicProviderPropTypes) => {
  const [account, setAccount] = useState<SessionAccountDto>({});
  const authRevisionRef = useRef(0);

  const clearStoredSession = useCallback(() => {
    removeFromLocal(config.auth.user);
    removeFromLocal(config.auth.remember);
    removeFromLocal(config.auth.refreshTokenKey);
    removeFromLocal(config.auth.accessTokenExpiresAtKey);
  }, []);

  const bumpAuthRevision = useCallback(() => {
    authRevisionRef.current += 1;
  }, []);

  const clearSessionState = useCallback(() => {
    bumpAuthRevision();
    setAccount({});
    clearStoredSession();
  }, [bumpAuthRevision, clearStoredSession]);

  const isInGuestMode = useCallback(() => {
    return (
      !!fromLocal(config.auth.guestMode, "boolean") && account.token === undefined
    );
  }, [account.token]);

  const setGuestMode = useCallback((value: boolean) => {
    toLocal(config.auth.guestMode, value);
  }, []);

  const logUser = useCallback((data: SessionDto, rememberMe?: boolean) => {
    if (!data) return;

    bumpAuthRevision();

    const storedRemember = fromLocal(config.auth.remember, "boolean");
    const resolvedRemember =
      rememberMe ??
      (typeof storedRemember === "boolean" ? storedRemember : false);

    setAccount(data);
    removeFromLocal(config.auth.guestMode);
    toLocal(config.auth.user, data.token);
    toLocal(config.auth.remember, resolvedRemember);

    if (typeof data.refreshToken === "string" && data.refreshToken.length) {
      toLocal(config.auth.refreshTokenKey, data.refreshToken);
    } else {
      removeFromLocal(config.auth.refreshTokenKey);
    }

    if (
      typeof data.accessTokenExpiresAt === "string" &&
      data.accessTokenExpiresAt.length
    ) {
      toLocal(config.auth.accessTokenExpiresAtKey, data.accessTokenExpiresAt);
    } else {
      removeFromLocal(config.auth.accessTokenExpiresAtKey);
    }
  }, [bumpAuthRevision]);

  const logoutUser = useCallback(async () => {
    try {
      if (supabase) {
        await supabase.auth.signOut();
      }
    } catch (error) {
      console.error(error);
    }

    clearSessionState();
  }, [clearSessionState]);

  const logUserFromLocal = useCallback(async () => {
    const requestRevision = authRevisionRef.current;

    try {
      if (!supabase) {
        clearSessionState();
        return;
      }

      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;

      if (requestRevision !== authRevisionRef.current) return;

      if (!data.session) {
        clearSessionState();
        return;
      }

      logUser(
        mapSupabaseSessionToSessionDto(data.session),
        fromLocal(config.auth.remember, "boolean") === true,
      );
    } catch (error) {
      console.error(error);
      if (requestRevision !== authRevisionRef.current) return;
      clearSessionState();
    }
  }, [clearSessionState, logUser]);

  useEffect(() => {
    if (!supabase) return;

    let mounted = true;

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;

      if (!session) {
        clearSessionState();
        return;
      }

      logUser(
        mapSupabaseSessionToSessionDto(session),
        fromLocal(config.auth.remember, "boolean") === true,
      );
    });

    void logUserFromLocal();

    return () => {
      mounted = false;
      data.subscription.unsubscribe();
    };
  }, [clearSessionState, logUser, logUserFromLocal]);

  const value = useMemo(() => {
    return {
      account,
      logUser,
      logoutUser,
      logUserFromLocal,
      isInGuestMode,
      setGuestMode,
    };
  }, [
    account,
    logUser,
    logoutUser,
    logUserFromLocal,
    isInGuestMode,
    setGuestMode,
  ]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

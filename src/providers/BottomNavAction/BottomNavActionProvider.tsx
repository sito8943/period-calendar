import { useState, useCallback, useMemo } from "react";

// types
import type { BasicProviderPropTypes } from "../types";

// context
import {
  BottomNavActionContext,
  type BottomNavActionContextType,
} from "./BottomNavActionContext";

export const BottomNavActionProvider = ({
  children,
}: BasicProviderPropTypes) => {
  const [onAction, setOnActionState] = useState<(() => void) | null>(null);

  const setOnAction = useCallback(
    (action: (() => void) | null) => setOnActionState(() => action),
    [],
  );

  const value = useMemo<BottomNavActionContextType>(
    () => ({ onAction, setOnAction }),
    [onAction, setOnAction],
  );

  return (
    <BottomNavActionContext.Provider value={value}>
      {children}
    </BottomNavActionContext.Provider>
  );
};

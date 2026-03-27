import { useContext, useEffect } from "react";
import { BottomNavActionContext } from "./BottomNavActionContext";

export const useBottomNavAction = () => {
  const ctx = useContext(BottomNavActionContext);
  if (!ctx)
    throw new Error(
      "useBottomNavAction must be used within BottomNavActionProvider",
    );
  return ctx;
};

export const useRegisterBottomNavAction = (action: () => void) => {
  const { setOnAction } = useBottomNavAction();

  useEffect(() => {
    setOnAction(action);
    return () => setOnAction(null);
  }, [action, setOnAction]);
};

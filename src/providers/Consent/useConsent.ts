import { useContext } from "react";

// types
import type { ConsentContextType } from "./types";
import { ConsentContext } from "./ConsentContext";

export const useConsent = (): ConsentContextType => {
  const context = useContext(ConsentContext);

  if (!context) {
    throw new Error("useConsent must be used within ConsentProvider");
  }

  return context;
};

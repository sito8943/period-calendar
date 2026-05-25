import type { FallbackProps } from "react-error-boundary";

import { Error } from "@sito/dashboard-app";

const getUnknownErrorMessage = (error: unknown) => {
  if (typeof error === "string") return error;

  if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }

  return undefined;
};

export function ErrorBoundaryFallback({
  error,
  resetErrorBoundary,
}: FallbackProps) {
  const knownError = error instanceof globalThis.Error ? error : undefined;

  return (
    <Error
      error={knownError}
      message={knownError ? undefined : getUnknownErrorMessage(error)}
      resetErrorBoundary={resetErrorBoundary}
    />
  );
}

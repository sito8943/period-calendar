import { ErrorBoundary } from "react-error-boundary";
import { Outlet } from "react-router-dom";

import { AuthShell } from "@sito/dashboard-app";

import { ErrorBoundaryFallback } from "../ErrorBoundaryFallback";

export function Auth() {
  return (
    <AuthShell>
      <ErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
        <Outlet />
      </ErrorBoundary>
    </AuthShell>
  );
}

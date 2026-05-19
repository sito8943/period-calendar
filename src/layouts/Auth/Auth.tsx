import { ErrorBoundary } from "react-error-boundary";
import { Outlet } from "react-router-dom";

import { AuthShell, Error } from "@sito/dashboard-app";

export function Auth() {
  return (
    <AuthShell>
      <ErrorBoundary FallbackComponent={Error}>
        <Outlet />
      </ErrorBoundary>
    </AuthShell>
  );
}

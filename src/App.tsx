import { Suspense } from "react";

// @sito/dashboard-app
import { SplashScreen } from "@sito/dashboard-app";

// routes
import { Routes } from "./Routes";

// components
import { DataChoices, UpdateDialog } from "components";

function App() {
  return (
    <Suspense fallback={<SplashScreen />}>
      <Routes />
      <UpdateDialog />
      <DataChoices />
    </Suspense>
  );
}

export default App;

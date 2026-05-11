import { Suspense } from "react";

// @sito/dashboard-app
import { SplashScreen } from "@sito/dashboard-app";

// routes
import { Routes } from "./Routes";

// components
import { UpdateDialog } from "components";

function App() {
  return (
    <Suspense fallback={<SplashScreen />}>
      <Routes />
      <UpdateDialog />
    </Suspense>
  );
}

export default App;

import { Suspense } from "react";

// @sito/dashboard-app
import { SplashScreen } from "@sito/dashboard-app";

// routes
import { Routes } from "./Routes";

function App() {
  return (
    <Suspense fallback={<SplashScreen />}>
      <Routes />
    </Suspense>
  );
}

export default App;

import ReactDOM from "react-dom/client";
import "react-tooltip/dist/react-tooltip.css";

// app
import App from "./App";
import { initPeriodTheme } from "lib";

// fonts
// @ts-expect-error -- fontsource packages lack type declarations
import "@fontsource/poppins";
// @ts-expect-error -- fontsource packages lack type declarations
import "@fontsource/roboto";

// styles
import "./index.css";

// providers
import { PeriodCalendarProvider } from "providers";

// i18
import "./i18";

initPeriodTheme();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <PeriodCalendarProvider>
    <App />
  </PeriodCalendarProvider>,
);

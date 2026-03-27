import loadable from "@loadable/component";

// layouts
import { View } from "./layouts";
import { BrowserRouter, Routes as ReactRoutes, Route } from "react-router-dom";

// views
const Home = loadable(() =>
  import("views").then((module) => ({
    default: module.Home,
  })),
);
const PeriodLog = loadable(() =>
  import("views").then((module) => ({
    default: module.PeriodLog,
  })),
);
const History = loadable(() =>
  import("views").then((module) => ({
    default: module.History,
  })),
);
const NotFound = loadable(() =>
  import("views").then((module) => ({
    default: module.NotFound,
  })),
);

export const Routes = () => {
  return (
    <BrowserRouter>
      <ReactRoutes>
        <Route path="/" element={<View />}>
          <Route index element={<Home />} />
          <Route path="/log" element={<PeriodLog />} />
          <Route path="/log/:id" element={<PeriodLog />} />
          <Route path="/history" element={<History />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </ReactRoutes>
    </BrowserRouter>
  );
};

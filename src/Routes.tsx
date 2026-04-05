import loadable from "@loadable/component";

// layouts
import { View } from "./layouts";
import { BrowserRouter, Routes as ReactRoutes, Route } from "react-router-dom";
import { AppRoute } from "lib";

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
const DailyLog = loadable(() =>
  import("views").then((module) => ({
    default: module.DailyLog,
  })),
);
const History = loadable(() =>
  import("views").then((module) => ({
    default: module.History,
  })),
);
const Profile = loadable(() =>
  import("views").then((module) => ({
    default: module.Profile,
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
        <Route path={AppRoute.Home} element={<View />}>
          <Route index element={<Home />} />
          <Route path={AppRoute.PeriodLog} element={<PeriodLog />} />
          <Route path={AppRoute.PeriodLogById} element={<PeriodLog />} />
          <Route path={AppRoute.DailyLogByDate} element={<DailyLog />} />
          <Route path={AppRoute.History} element={<History />} />
          <Route path={AppRoute.Profile} element={<Profile />} />
          <Route path={AppRoute.NotFound} element={<NotFound />} />
        </Route>
      </ReactRoutes>
    </BrowserRouter>
  );
};

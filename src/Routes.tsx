import loadable from "@loadable/component";

// layouts
import { Auth, View } from "./layouts";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes as ReactRoutes,
} from "react-router-dom";
import { AppRoute } from "lib";

// views
const SignIn = loadable(() =>
  import("views").then((module) => ({
    default: module.SignIn,
  })),
);
const SignUp = loadable(() =>
  import("views").then((module) => ({
    default: module.SignUp,
  })),
);
const SignUpConfirmation = loadable(() =>
  import("views").then((module) => ({
    default: module.SignUpConfirmation,
  })),
);
const ForgotPassword = loadable(() =>
  import("views").then((module) => ({
    default: module.ForgotPassword,
  })),
);
const SignOut = loadable(() =>
  import("views").then((module) => ({
    default: module.SignOut,
  })),
);
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
        <Route path={AppRoute.AuthRoot} element={<Auth />}>
          <Route
            index
            element={<Navigate to={AppRoute.SignIn} replace />}
          />
          <Route path={AppRoute.SignIn} element={<SignIn />} />
          <Route path={AppRoute.SignUp} element={<SignUp />} />
          <Route
            path={AppRoute.SignUpConfirmation}
            element={<SignUpConfirmation />}
          />
          <Route
            path={AppRoute.ForgotPassword}
            element={<ForgotPassword />}
          />
          <Route path={AppRoute.AuthNotFound} element={<NotFound />} />
        </Route>
        <Route path={AppRoute.SignOut} element={<SignOut />} />
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

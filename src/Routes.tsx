// layouts
import { Auth, View } from "./layouts";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes as ReactRoutes,
} from "react-router-dom";
import { AppRoute } from "lib";
import { useFeatureFlags } from "providers";
import { routeComponents } from "./views/routes";

export const Routes = () => {
  const { isFeatureEnabled } = useFeatureFlags();
  const {
    SignIn,
    SignUp,
    SignUpConfirmation,
    UpdatePassword,
    ConfirmEmailSuccess,
    ConfirmEmailError,
    ForgotPassword,
    SignOut,
    Home,
    PeriodLog,
    DailyLog,
    History,
    Profile,
    About,
    CookiesPolicy,
    TermsAndConditions,
    PrivacyPolicy,
    FeatureUnavailable,
    NotFound,
  } = routeComponents;

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
            path={AppRoute.UpdatePassword}
            element={<UpdatePassword />}
          />
          <Route
            path={AppRoute.ConfirmEmailSuccess}
            element={<ConfirmEmailSuccess />}
          />
          <Route
            path={AppRoute.ConfirmEmailError}
            element={<ConfirmEmailError />}
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
          <Route
            path={AppRoute.PeriodLog}
            element={
              isFeatureEnabled("periodLogEnabled") ? (
                <PeriodLog />
              ) : (
                <FeatureUnavailable module="periodLog" />
              )
            }
          />
          <Route
            path={AppRoute.PeriodLogById}
            element={
              isFeatureEnabled("periodLogEnabled") ? (
                <PeriodLog />
              ) : (
                <FeatureUnavailable module="periodLog" />
              )
            }
          />
          <Route
            path={AppRoute.DailyLogByDate}
            element={
              isFeatureEnabled("dailyLogEnabled") ? (
                <DailyLog />
              ) : (
                <FeatureUnavailable module="dailyLog" />
              )
            }
          />
          <Route
            path={AppRoute.History}
            element={
              isFeatureEnabled("historyEnabled") ? (
                <History />
              ) : (
                <FeatureUnavailable module="history" />
              )
            }
          />
          <Route
            path={AppRoute.Profile}
            element={
              isFeatureEnabled("profileEnabled") ? (
                <Profile />
              ) : (
                <FeatureUnavailable module="profile" />
              )
            }
          />
          <Route
            path={AppRoute.About}
            element={
              isFeatureEnabled("aboutEnabled") ? (
                <About />
              ) : (
                <FeatureUnavailable module="about" />
              )
            }
          />
          <Route
            path={AppRoute.CookiesPolicy}
            element={
              isFeatureEnabled("cookiesPolicyEnabled") ? (
                <CookiesPolicy />
              ) : (
                <FeatureUnavailable module="cookiesPolicy" />
              )
            }
          />
          <Route
            path={AppRoute.TermsAndConditions}
            element={
              isFeatureEnabled("termsAndConditionsEnabled") ? (
                <TermsAndConditions />
              ) : (
                <FeatureUnavailable module="termsAndConditions" />
              )
            }
          />
          <Route
            path={AppRoute.PrivacyPolicy}
            element={
              isFeatureEnabled("privacyPolicyEnabled") ? (
                <PrivacyPolicy />
              ) : (
                <FeatureUnavailable module="privacyPolicy" />
              )
            }
          />
          <Route path={AppRoute.NotFound} element={<NotFound />} />
        </Route>
      </ReactRoutes>
    </BrowserRouter>
  );
};

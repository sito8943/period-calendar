// layouts
import { Auth, View } from "./layouts";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes as ReactRoutes,
} from "react-router-dom";
import { AppRoutes } from "lib";
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
        <Route path={AppRoutes.AuthRoot} element={<Auth />}>
          <Route
            index
            element={<Navigate to={AppRoutes.SignIn} replace />}
          />
          <Route path={AppRoutes.SignIn} element={<SignIn />} />
          <Route path={AppRoutes.SignUp} element={<SignUp />} />
          <Route
            path={AppRoutes.SignUpConfirmation}
            element={<SignUpConfirmation />}
          />
          <Route
            path={AppRoutes.UpdatePassword}
            element={<UpdatePassword />}
          />
          <Route
            path={AppRoutes.ConfirmEmailSuccess}
            element={<ConfirmEmailSuccess />}
          />
          <Route
            path={AppRoutes.ConfirmEmailError}
            element={<ConfirmEmailError />}
          />
          <Route
            path={AppRoutes.ForgotPassword}
            element={<ForgotPassword />}
          />
          <Route path={AppRoutes.AuthNotFound} element={<NotFound />} />
        </Route>
        <Route path={AppRoutes.SignOut} element={<SignOut />} />
        <Route path={AppRoutes.Home} element={<View />}>
          <Route index element={<Home />} />
          <Route
            path={AppRoutes.PeriodLog}
            element={
              isFeatureEnabled("periodLogEnabled") ? (
                <PeriodLog />
              ) : (
                <FeatureUnavailable module="periodLog" />
              )
            }
          />
          <Route
            path={AppRoutes.PeriodLogById}
            element={
              isFeatureEnabled("periodLogEnabled") ? (
                <PeriodLog />
              ) : (
                <FeatureUnavailable module="periodLog" />
              )
            }
          />
          <Route
            path={AppRoutes.DailyLogByDate}
            element={
              isFeatureEnabled("dailyLogEnabled") ? (
                <DailyLog />
              ) : (
                <FeatureUnavailable module="dailyLog" />
              )
            }
          />
          <Route
            path={AppRoutes.History}
            element={
              isFeatureEnabled("historyEnabled") ? (
                <History />
              ) : (
                <FeatureUnavailable module="history" />
              )
            }
          />
          <Route
            path={AppRoutes.Profile}
            element={
              isFeatureEnabled("profileEnabled") ? (
                <Profile />
              ) : (
                <FeatureUnavailable module="profile" />
              )
            }
          />
          <Route
            path={AppRoutes.About}
            element={
              isFeatureEnabled("aboutEnabled") ? (
                <About />
              ) : (
                <FeatureUnavailable module="about" />
              )
            }
          />
          <Route
            path={AppRoutes.CookiesPolicy}
            element={
              isFeatureEnabled("cookiesPolicyEnabled") ? (
                <CookiesPolicy />
              ) : (
                <FeatureUnavailable module="cookiesPolicy" />
              )
            }
          />
          <Route
            path={AppRoutes.TermsAndConditions}
            element={
              isFeatureEnabled("termsAndConditionsEnabled") ? (
                <TermsAndConditions />
              ) : (
                <FeatureUnavailable module="termsAndConditions" />
              )
            }
          />
          <Route
            path={AppRoutes.PrivacyPolicy}
            element={
              isFeatureEnabled("privacyPolicyEnabled") ? (
                <PrivacyPolicy />
              ) : (
                <FeatureUnavailable module="privacyPolicy" />
              )
            }
          />
          <Route path={AppRoutes.NotFound} element={<NotFound />} />
        </Route>
      </ReactRoutes>
    </BrowserRouter>
  );
};

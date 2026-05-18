import { TabsLayout, useOptionalAuthContext } from "@sito/dashboard-app";
import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { AppRoutes } from "lib";

import { PeriodOnboardingStep } from "./PeriodOnboardingStep";

import type { PeriodOnboardingProps, PeriodOnboardingStepType } from "./types";

interface PeriodOnboardingFlowProps extends PeriodOnboardingProps {
  steps: PeriodOnboardingStepType[];
}

export function PeriodOnboardingFlow(props: PeriodOnboardingFlowProps) {
  const {
    steps,
    signInPath = AppRoutes.SignIn,
    guestPath = AppRoutes.Home,
    onSkip,
    onSignIn,
    onStartAsGuest,
  } = props;
  const navigate = useNavigate();
  const auth = useOptionalAuthContext();
  const [currentStep, setCurrentStep] = useState(1);

  const handleSkip = useCallback(() => {
    if (onSkip) {
      onSkip();
      return;
    }

    navigate(signInPath);
  }, [navigate, onSkip, signInPath]);

  const handleSignIn = useCallback(() => {
    if (onSignIn) {
      onSignIn();
      return;
    }

    navigate(signInPath);
  }, [navigate, onSignIn, signInPath]);

  const handleStartAsGuest = useCallback(() => {
    if (onStartAsGuest) {
      onStartAsGuest();
      return;
    }

    auth?.setGuestMode(true);
    navigate(guestPath);
  }, [auth, guestPath, navigate, onStartAsGuest]);

  const onboardingTabs = useMemo(
    () =>
      steps.map((step, index) => {
        const stepId = index + 1;

        return {
          id: stepId,
          label: "",
          content: (
            <PeriodOnboardingStep
              key={stepId}
              {...step}
              final={stepId === steps.length}
              onClickNext={() => setCurrentStep((prev) => prev + 1)}
              onSkip={handleSkip}
              onStartAsGuest={handleStartAsGuest}
              onSignIn={handleSignIn}
            />
          ),
        };
      }),
    [handleSignIn, handleSkip, handleStartAsGuest, steps],
  );

  return (
    <div className="onboarding-main">
      <TabsLayout
        currentTab={currentStep}
        onTabChange={(id) => setCurrentStep(Number(id))}
        tabs={onboardingTabs}
        useLinks={false}
      />
    </div>
  );
}

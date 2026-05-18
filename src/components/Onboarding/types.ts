import type { ReactNode } from "react";
import type { OnboardingPropsType } from "@sito/dashboard-app";

export type PeriodOnboardingProps = Omit<OnboardingPropsType, "steps">;

export interface PeriodOnboardingStepType {
  title: ReactNode;
  body: ReactNode;
  content?: ReactNode;
  image?: string;
  alt?: string;
}

export interface PeriodOnboardingStepPropsType
  extends PeriodOnboardingStepType {
  final?: boolean;
  onClickNext: () => void;
  onSkip: () => void;
  onStartAsGuest: () => void;
  onSignIn: () => void;
}

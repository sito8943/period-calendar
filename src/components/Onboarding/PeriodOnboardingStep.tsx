import { Button } from "@sito/dashboard-app";
import { useTranslation } from "react-i18next";

import type { PeriodOnboardingStepPropsType } from "./types";

export function PeriodOnboardingStep(props: PeriodOnboardingStepPropsType) {
  const {
    title,
    body,
    content,
    image = "",
    alt = "",
    final = false,
    onClickNext,
    onSkip,
    onStartAsGuest,
    onSignIn,
  } = props;
  const { t } = useTranslation();

  return (
    <div className="big-appear step-container">
      {image ? <img src={image} alt={alt} /> : null}
      {title != null ? <h2 className="step-title">{title}</h2> : null}
      {body != null ? <div className="step-body">{body}</div> : null}
      {content != null ? <div className="step-content">{content}</div> : null}
      <div className="step-actions">
        {final ? (
          <>
            <Button
              color="primary"
              variant="outlined"
              className="step-button"
              onClick={onStartAsGuest}
              aria-label={t("_accessibility:ariaLabels.start")}
            >
              {t("_accessibility:buttons.startAsGuest")}
            </Button>
            <Button
              color="primary"
              variant="submit"
              className="step-button"
              onClick={onSignIn}
              aria-label={t("_accessibility:ariaLabels.start")}
            >
              {t("_accessibility:buttons.signIn")}
            </Button>
          </>
        ) : (
          <>
            <Button
              color="primary"
              variant="outlined"
              className="step-button"
              onClick={onSkip}
              aria-label={t("_accessibility:ariaLabels.skip")}
            >
              {t("_accessibility:buttons.skip")}
            </Button>
            <Button
              color="primary"
              variant="outlined"
              className="step-button"
              onClick={onClickNext}
              aria-label={t("_accessibility:ariaLabels.next")}
            >
              {t("_accessibility:buttons.next")}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

export type ConsentContextType = {
  /** null until the user chooses. */
  analytics: boolean | null;
  /** The banner is shown: no choice yet, or the user asked to change it. */
  isBannerOpen: boolean;
  setAnalytics: (allowed: boolean) => void;
  /** Shows the banner again (cookies policy, "change preferences"). */
  openBanner: () => void;
};

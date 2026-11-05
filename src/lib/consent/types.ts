/** The user's choice for optional, non-essential technologies. */
export type StoredConsent = {
  /** Anonymous feature usage counts (sito-feature-usage). */
  analytics: boolean;
  version: number;
  /** ISO date of the choice, kept as proof of consent. */
  decidedAt: string;
};

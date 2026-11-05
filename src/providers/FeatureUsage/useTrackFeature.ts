// @sito/feature-usage
import { useTrack } from "@sito/feature-usage/react";

// lib
import type { PeriodCalendarFeature } from "lib";

/** `const track = useTrackFeature(); track("page.home")`: typed to the period calendar catalogue. */
export const useTrackFeature = () => useTrack<PeriodCalendarFeature>();

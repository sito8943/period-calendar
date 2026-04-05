import { DEFAULT_HISTORY_INDEX } from "./constants";
import type { BrowserHistoryState } from "./types";

export function getHistoryIndex(): number {
  if (typeof window === "undefined") return DEFAULT_HISTORY_INDEX;

  const historyState = window.history.state as BrowserHistoryState | null;
  if (typeof historyState?.idx !== "number") return DEFAULT_HISTORY_INDEX;

  return historyState.idx;
}

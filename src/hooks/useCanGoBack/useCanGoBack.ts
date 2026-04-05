import { DEFAULT_HISTORY_INDEX } from "./constants";
import { getHistoryIndex } from "./utils";

export function useCanGoBack(): boolean {
  return getHistoryIndex() > DEFAULT_HISTORY_INDEX;
}

import { probeServerReachability as probeServerReachabilityFromLibrary } from "@sito/dashboard-app";

import { onlineStatusOptions } from "./constants";

export const probeServerReachability = () => {
  return probeServerReachabilityFromLibrary(onlineStatusOptions);
};

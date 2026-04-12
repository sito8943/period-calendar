import { useMemo, useState } from "react";

// @sito/dashboard-app
import { Drawer, Navbar } from "@sito/dashboard-app";

// menu
import { getFeatureFilteredMenuMap } from "../../views/menuMap";
import { useFeatureFlags } from "providers";

function Header() {
  const [showDrawer, setShowDrawer] = useState(false);
  const { isFeatureEnabled } = useFeatureFlags();

  const featureFilteredMenuMap = useMemo(
    () => getFeatureFilteredMenuMap(isFeatureEnabled),
    [isFeatureEnabled],
  );

  return (
    <>
      <Drawer
        menuMap={featureFilteredMenuMap}
        open={showDrawer}
        onClose={() => setShowDrawer(false)}
      />
      <Navbar openDrawer={() => setShowDrawer(true)} />
    </>
  );
}

export default Header;

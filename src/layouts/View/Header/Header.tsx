import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import { Drawer, Navbar } from "@sito/dashboard-app";

// menu
import { getFeatureFilteredMenuMap } from "../../../views/menuMap";

// providers
import { useFeatureFlags } from "providers";

function Header() {
  const { i18n } = useTranslation();
  const [showDrawer, setShowDrawer] = useState(false);
  const { isFeatureEnabled } = useFeatureFlags();

  const featureFilteredMenuMap = useMemo(
    () => getFeatureFilteredMenuMap(isFeatureEnabled, i18n.resolvedLanguage),
    [i18n.resolvedLanguage, isFeatureEnabled],
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

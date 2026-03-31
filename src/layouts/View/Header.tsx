import { useState } from "react";

// @sito/dashboard-app
import { Drawer, Navbar } from "@sito/dashboard-app";

// menu
import { menuMap } from "../../views/menuMap";

function Header() {
  const [showDrawer, setShowDrawer] = useState(false);

  return (
    <>
      <Drawer
        menuMap={menuMap}
        open={showDrawer}
        onClose={() => setShowDrawer(false)}
      />
      <Navbar openDrawer={() => setShowDrawer(true)} />
    </>
  );
}

export default Header;

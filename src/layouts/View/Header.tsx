import { useState } from "react";

// @sito/dashboard-app
import { Navbar } from "@sito/dashboard-app";

// components
import { Drawer } from "components";

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

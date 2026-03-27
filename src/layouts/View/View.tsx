import { Outlet, useNavigate, useLocation, Link } from "react-router-dom";
import type { To } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import type { ComponentType } from "react";

// @sito/dashboard-app
import {
  ConfigProvider,
  NavbarProvider,
  Notification,
} from "@sito/dashboard-app";
import type { BaseLinkPropsType } from "@sito/dashboard-app";

// components
import { BottomNavigation } from "components";
import Header from "./Header";
import Footer from "./Footer";

// providers
import { BottomNavActionProvider } from "providers";

export function View() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <ConfigProvider
      navigate={(route) => navigate(route as To)}
      location={location}
      linkComponent={Link as unknown as ComponentType<BaseLinkPropsType>}
    >
      <NavbarProvider>
        <BottomNavActionProvider>
          <Header />
          <Outlet />
          <Footer />
          <BottomNavigation />
          <Tooltip id="tooltip" />
          <Notification />
        </BottomNavActionProvider>
      </NavbarProvider>
    </ConfigProvider>
  );
}

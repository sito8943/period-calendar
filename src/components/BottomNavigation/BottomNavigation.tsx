import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

// @sito/dashboard-app
import { Button } from "@sito/dashboard-app";
import { AppRoute } from "lib";

// views
import { bottomMap } from "../../views/bottomMap";

// utils
import { isPathActive } from "./utils";

// components
import { NavLink } from "./NavLink";

export const BottomNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const leftItems = useMemo(
    () => bottomMap.filter((item) => item.position === "left"),
    [],
  );

  const rightItems = useMemo(
    () => bottomMap.filter((item) => item.position === "right"),
    [],
  );

  return (
    <nav className="fixed -bottom-1 left-0 right-0 z-20 bg-base border-t border-border sm:hidden">
      <div className="flex items-center justify-around h-16">
        {leftItems.map((item) => (
          <NavLink
            key={item.path}
            item={item}
            isActive={isPathActive(location.pathname, item.path)}
          />
        ))}

        <div className="flex items-center justify-center flex-1">
          <Button
            variant="submit"
            color="primary"
            onClick={() => navigate(AppRoute.PeriodLog)}
            className="rounded-full! w-12! h-12! min-w-0! p-0! flex items-center justify-center shadow-lg -mt-4"
            aria-label="Log period"
          >
            <FontAwesomeIcon icon={faPlus} className="text-lg" />
          </Button>
        </div>

        {rightItems.map((item) => (
          <NavLink
            key={item.path}
            item={item}
            isActive={isPathActive(location.pathname, item.path)}
          />
        ))}
      </div>
    </nav>
  );
};

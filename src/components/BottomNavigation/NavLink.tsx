import { Link } from "react-router-dom";

// @sito/dashboard-app
import { useTranslation } from "@sito/dashboard-app";

// types
import type { BottomNavItemType } from "./types";

/**
 * NavLink component that renders a navigation link for the bottom navigation bar.
 * @param item - The navigation item containing path, icon, page name, and position.
 * @param isActive - Boolean indicating whether the link is currently active (matches the current path).
 * @returns A Link component styled based on its active state, displaying an icon and page name.
 */
export const NavLink = ({
  item,
  isActive,
}: {
  item: BottomNavItemType;
  isActive: boolean;
}) => {
  const { t } = useTranslation();

  return (
    <Link
      to={item.path}
      className={`flex flex-col items-center justify-center gap-0.5 flex-1 py-2 transition-colors ${
        isActive ? "text-hover-primary" : "text-text-muted/60"
      }`}
      aria-label={t(`_pages:pages.${item.page}`)}
    >
      <span className="text-lg">{item.icon}</span>
      <span className="text-[10px] leading-tight">
        {t(`_pages:pages.${item.page}`)}
      </span>
    </Link>
  );
};

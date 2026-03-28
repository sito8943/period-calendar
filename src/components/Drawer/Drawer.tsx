import { useCallback, useEffect, useMemo } from "react";
import { useConfig, useTranslation } from "@sito/dashboard-app";

// types
import type { MenuItemType } from "../../views/types";

// styles
import "./styles.css";

type DrawerProps = {
  open: boolean;
  onClose: () => void;
  menuMap: MenuItemType<string>[];
};

export function Drawer({ open, onClose, menuMap }: DrawerProps) {
  const { t } = useTranslation();
  const { linkComponent } = useConfig();
  const Link = linkComponent;

  const onEscapePress = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onClose();
      }
    },
    [onClose, open],
  );

  useEffect(() => {
    document.addEventListener("keydown", onEscapePress);
    return () => {
      document.removeEventListener("keydown", onEscapePress);
    };
  }, [onEscapePress]);

  const isActive = useCallback(
    (path?: string) => path === location.pathname,
    [],
  );

  const renderItems = useMemo(() => {
    return menuMap.map((link, i) => {
      const key = (link.page as string) ?? String(i);
      const liClass = `drawer-list-item ${
        isActive(link.path) ? "active" : ""
      } animated`;

      if (link.type === "divider") {
        return (
          <li key={key} className={liClass}>
            <hr className="drawer-divider" />
          </li>
        );
      }

      return (
        <li key={key} className={liClass}>
          <Link
            aria-disabled={!open}
            to={link.path ?? "/"}
            className="drawer-link"
            onClick={onClose}
          >
            {link.icon}
            {t(`_pages:pages.${link.page}`)}
          </Link>
        </li>
      );
    });
  }, [Link, isActive, open, menuMap, t, onClose]);

  return (
    <div
      aria-disabled={!open}
      className={`${open ? "opened" : "closed"} drawer-backdrop`}
      onClick={() => onClose()}
    >
      <aside
        className={`${open ? "opened" : "closed"} drawer animated`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="drawer-header-container">
          <h2 className="drawer-header">{t("_pages:home.appName")}</h2>
        </div>
        <ul className="flex flex-col">{renderItems}</ul>
      </aside>
    </div>
  );
}

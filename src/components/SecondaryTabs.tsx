import { useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import Icon from "./Icon";
import type { IconName } from "./Icon";
import { t } from "../lib/i18n";

export type SecondaryTab = { to: string; label: string; icon: IconName };

export default function SecondaryTabs({ tabs }: { tabs: SecondaryTab[] }) {
  const { pathname } = useLocation();
  const rowRef = useRef<HTMLDivElement>(null);

  // On phones the row scrolls; bring the current tab into view so the page
  // always shows where you are.
  useEffect(() => {
    const row = rowRef.current;
    const active = row?.querySelector<HTMLElement>('[aria-current="page"]');
    if (!row || !active) return;
    const r = row.getBoundingClientRect();
    const a = active.getBoundingClientRect();
    const offset = row.scrollLeft + a.left - r.left - (r.width - a.width) / 2;
    row.scrollTo({ left: Math.max(0, offset) });
  }, [pathname]);

  return (
    <div className="border-b border-[color:var(--color-border)] bg-white">
      <div
        ref={rowRef}
        className="scrollbar-hide mx-auto flex max-w-[1280px] gap-6 overflow-x-auto px-4 md:gap-8 md:px-10"
      >
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              `flex min-h-11 shrink-0 items-center gap-2 border-b-2 py-4 t-body-sm font-semibold transition-colors duration-150 ${
                isActive
                  ? "border-[color:var(--color-ink)] text-[color:var(--color-ink)]"
                  : "border-transparent text-[color:var(--color-muted)] hover:text-[color:var(--color-ink)]"
              }`
            }
          >
            <Icon name={tab.icon} size={18} />
            {t(tab.label)}
          </NavLink>
        ))}
      </div>
    </div>
  );
}

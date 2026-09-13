import { NavLink } from "react-router-dom";
import Icon from "./Icon";
import type { IconName } from "./Icon";

export type SecondaryTab = { to: string; label: string; icon: IconName };

export default function SecondaryTabs({ tabs }: { tabs: SecondaryTab[] }) {
  return (
    <div className="border-b border-[color:var(--color-border)] bg-white">
      <div className="mx-auto flex max-w-[1440px] gap-1 overflow-x-auto px-4 md:px-[60px]">
        {tabs.map((t) => (
          <NavLink
            key={t.to}
            to={t.to}
            className={({ isActive }) =>
              `flex shrink-0 items-center gap-2 border-b-2 px-4 py-4 text-sm font-medium transition-colors ${
                isActive
                  ? "border-[#222] text-[#222]"
                  : "border-transparent text-[color:var(--color-muted)] hover:text-[#222]"
              }`
            }
          >
            <Icon name={t.icon} size={18} />
            {t.label}
          </NavLink>
        ))}
      </div>
    </div>
  );
}

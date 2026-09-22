import type { ReactNode } from "react";
import Icon, { type IconName } from "./Icon";

// The one empty state for every list: icon disc, title, an optional line
// of help and an optional action.
export default function EmptyState({
  icon,
  title,
  description,
  action,
  className = "mt-6",
}: {
  icon: IconName;
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-col items-center rounded-2xl border border-[color:var(--color-border)] bg-white px-6 py-16 text-center ${className}`}
    >
      <span className="flex size-14 items-center justify-center rounded-full bg-[color:var(--color-surface-soft)]">
        <Icon
          name={icon}
          size={26}
          className="text-[color:var(--color-ink-soft)]"
        />
      </span>
      <p className="mt-4 t-h4">{title}</p>
      {description && (
        <p className="mt-1.5 max-w-sm t-body-sm">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

import type { RefObject } from "react";
import Icon from "./Icon";

// Section title with optional prev/next controls sitting top-right. The
// controls page whatever carousel track they are handed.
export default function SectionHeader({
  title,
  subtitle,
  trackRef,
  action,
}: {
  title: string;
  subtitle?: string;
  /** When given, renders prev/next buttons that page this track. */
  trackRef?: RefObject<HTMLDivElement | null>;
  action?: React.ReactNode;
}) {
  function page(direction: -1 | 1) {
    const track = trackRef?.current;
    if (!track) return;
    track.scrollBy({ left: direction * Math.round(track.clientWidth * 0.9) });
  }

  return (
    <div className="mb-6 flex items-end justify-between gap-4 md:mb-8">
      <div>
        <h2 className="t-h3">{title}</h2>
        {subtitle && (
          <p className="t-body mt-1.5 text-[color:var(--color-muted)]">
            {subtitle}
          </p>
        )}
      </div>

      {trackRef && (
        <div className="flex shrink-0 items-center gap-2">
          {([-1, 1] as const).map((direction) => (
            <button
              key={direction}
              type="button"
              onClick={() => page(direction)}
              aria-label={direction === -1 ? "Previous" : "Next"}
              className="icon-btn icon-btn-arrow size-10"
            >
              <Icon
                name={direction === -1 ? "chevron-left" : "chevron-right"}
                size={18}
                strokeWidth={2.2}
              />
            </button>
          ))}
        </div>
      )}
      {action}
    </div>
  );
}

import { useNavigate } from "react-router-dom";
import Icon from "./Icon";
import Header from "./Header";
import CurrencySwitcher from "./CurrencySwitcher";

// Replaces the default logo/nav Header on the search results page.
// Mobile: a compact bar (back, truncated route, date, edit) takes over the
// whole top area. Desktop: the normal logo Header stays, with a pill-style
// trip-summary bar underneath it — matching the two different reference
// designs for this page.
export default function SearchSummaryHeader({
  pickup,
  dropoff,
  dateLabel,
  timeLabel,
  onEdit,
}: {
  pickup: string;
  dropoff: string;
  dateLabel: string;
  timeLabel: string;
  onEdit: () => void;
}) {
  const navigate = useNavigate();
  return (
    <>
      {/* Mobile */}
      <header className="relative z-20 border-b border-[color:var(--color-border)] bg-white lg:hidden">
        <div className="mx-auto flex max-w-[1440px] items-center gap-3 px-4 py-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Back"
            className="flex size-9 shrink-0 items-center justify-center rounded-full hover:bg-neutral-100"
          >
            <Icon name="chevron-left" size={20} className="text-[color:var(--color-ink)]" />
          </button>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-[color:var(--color-ink)]">
              {pickup} <span className="text-[color:var(--color-muted)]">&ndash;</span> {dropoff}
            </p>
            <p className="truncate text-xs text-[color:var(--color-muted)]">
              {dateLabel}, {timeLabel}
            </p>
          </div>

          <button
            type="button"
            onClick={onEdit}
            aria-label="Edit search"
            className="flex size-9 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-[color:var(--color-ink)] hover:bg-neutral-200"
          >
            <Icon name="edit" size={15} />
          </button>

          <CurrencySwitcher className="shrink-0 border-l border-[color:var(--color-border)] pl-2" />
        </div>
      </header>

      {/* Desktop */}
      <div className="hidden lg:block">
        <Header />
        <div className="border-b border-[color:var(--color-border)] bg-white py-4">
          <div className="mx-auto flex max-w-[1440px] items-center justify-center gap-3 px-[60px]">
            <div className="flex items-center gap-4 rounded-xl border border-[color:var(--color-border)] px-4 py-3">
              <div className="flex items-center gap-2 text-sm">
                <Icon name="location" size={16} className="text-[color:var(--color-ink)]" />
                <span className="font-bold text-[color:var(--color-ink)]">{pickup}</span>
              </div>
              <Icon name="arrow-left" size={15} className="rotate-180 text-[color:var(--color-muted)]" />
              <div className="flex items-center gap-2 text-sm">
                <Icon name="location" size={16} className="text-[color:var(--color-ink)]" />
                <span className="font-bold text-[color:var(--color-ink)]">{dropoff}</span>
              </div>
              <span className="h-6 w-px bg-[color:var(--color-border)]" />
              <div className="flex items-center gap-1.5 text-sm">
                <Icon name="calendar" size={16} className="text-[color:var(--color-ink)]" />
                <span className="font-semibold text-[color:var(--color-ink)]">{dateLabel}</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm">
                <Icon name="clock" size={16} className="text-[color:var(--color-ink)]" />
                <span className="font-semibold text-[color:var(--color-ink)]">{timeLabel}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={onEdit}
              aria-label="Edit search"
              className="flex size-[52px] shrink-0 items-center justify-center rounded-xl bg-[color:var(--color-ink)] text-white hover:bg-black"
            >
              <Icon name="edit" size={18} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

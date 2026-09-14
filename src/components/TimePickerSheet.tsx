import { type RefObject } from "react";
import Icon from "./Icon";
import AnchoredPopover from "./AnchoredPopover";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { TIME_OPTIONS } from "../lib/timeOptions";

// Time-only picker — the counterpart to DatePickerSheet, so tapping a
// "Pick up time" field gets a list of times instead of a calendar.
// Mobile (or no anchor given): bottom sheet. Desktop with an anchorRef:
// portaled dropdown anchored to the trigger.
export default function TimePickerSheet({
  label,
  value,
  anchorRef,
  onSelect,
  onClose,
}: {
  label: string;
  value: string;
  anchorRef?: RefObject<HTMLElement | null>;
  onSelect: (time: string) => void;
  onClose: () => void;
}) {
  const isDesktop = useMediaQuery("(min-width: 768px)") && !!anchorRef;

  const options = (
    <div className="flex-1 overflow-y-auto">
      {TIME_OPTIONS.map((t) => (
        <button
          key={t}
          type="button"
          onClick={() => onSelect(t)}
          className={`flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-neutral-50 md:px-3 md:py-2.5 ${
            t === value ? "font-bold text-[color:var(--color-ink)]" : "text-[color:var(--color-ink-soft)]"
          }`}
        >
          <span className="flex items-center gap-2.5 text-sm">
            <Icon name="clock" size={16} className="shrink-0 text-[color:var(--color-ink)]" />
            {t}
          </span>
          {t === value && <Icon name="check" size={15} className="text-[color:var(--color-ink)]" />}
        </button>
      ))}
    </div>
  );

  if (isDesktop && anchorRef) {
    return (
      <>
        <button aria-label="Close" onClick={onClose} className="fixed inset-0 z-[59] cursor-default" />
        <AnchoredPopover anchorRef={anchorRef} width={220} maxHeight={320}>
          {options}
        </AnchoredPopover>
      </>
    );
  }

  return (
    <>
      <button aria-label="Close" onClick={onClose} className="fixed inset-0 z-[59] cursor-default bg-black/40" />
      <div className="fixed inset-x-0 bottom-0 z-[60] flex max-h-[70svh] flex-col rounded-t-2xl bg-white pb-[env(safe-area-inset-bottom)]">
        <div className="flex shrink-0 items-center justify-between border-b border-[color:var(--color-border)] px-4 py-4">
          <h2 className="text-base font-bold text-[color:var(--color-ink)]">{label}</h2>
          <button type="button" onClick={onClose} aria-label="Close">
            <Icon name="close" size={20} className="text-[color:var(--color-ink)]" />
          </button>
        </div>
        {options}
      </div>
    </>
  );
}

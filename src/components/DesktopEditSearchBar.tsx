import { useRef, useState } from "react";
import Icon from "./Icon";
import LocationPickerSheet from "./LocationPickerSheet";
import DatePickerSheet from "./DatePickerSheet";
import type { EditSearchValue } from "./EditSearchModal";

function formatDate(d: Date) {
  return d.toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" });
}

// Desktop-only "Edit search" experience: a dropdown panel anchored below the
// header (dark overlay over the page beneath it), with pickup/drop-off/date
// fields in one row — each field opens its own small anchored popover
// instead of a full-screen modal. Mobile keeps the full-screen
// EditSearchModal; this is purely the desktop counterpart.
export default function DesktopEditSearchBar({
  initial,
  onClose,
  onSearch,
}: {
  initial: EditSearchValue;
  onClose: () => void;
  onSearch: (value: EditSearchValue) => void;
}) {
  const [value, setValue] = useState<EditSearchValue>(initial);
  const [activeField, setActiveField] = useState<"pickup" | "dropoff" | "date" | null>(null);

  const pickupRef = useRef<HTMLDivElement>(null);
  const dropoffRef = useRef<HTMLDivElement>(null);
  const pickupDateRef = useRef<HTMLDivElement>(null);
  const pickupTimeRef = useRef<HTMLDivElement>(null);
  const dropoffDateRef = useRef<HTMLDivElement>(null);
  const dropoffTimeRef = useRef<HTMLDivElement>(null);

  const isReturn = value.tripMode === "return";

  function fieldBox(
    ref: React.RefObject<HTMLDivElement | null>,
    icon: "location" | "calendar" | "clock",
    label: string,
    text: string,
    onClick: () => void,
  ) {
    return (
      <div ref={ref} className="relative min-w-[160px] flex-1">
        <button
          type="button"
          onClick={onClick}
          className="flex h-[52px] w-full items-center gap-2 rounded-xl border border-[color:var(--color-border)] px-3 text-left hover:border-[color:var(--color-ink)]"
        >
          <Icon name={icon} size={17} className="shrink-0 text-[color:var(--color-ink)]" />
          <span className="min-w-0 flex-1">
            <span className="block text-[10px] text-[color:var(--color-ink-soft)]">{label}</span>
            <span className="block truncate text-sm font-bold text-[color:var(--color-ink)]">{text}</span>
          </span>
        </button>
      </div>
    );
  }

  return (
    <>
      <button aria-label="Close" onClick={onClose} className="fixed inset-0 z-20 cursor-default bg-black/40" />
      <div className="fixed inset-x-0 top-0 z-30 border-b border-[color:var(--color-border)] bg-white shadow-[0px_8px_24px_rgba(0,0,0,0.12)]">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 flex size-8 items-center justify-center rounded-full hover:bg-neutral-100"
        >
          <Icon name="close" size={18} className="text-[color:var(--color-ink)]" />
        </button>

        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center gap-3 px-[60px] py-5">
          {fieldBox(pickupRef, "location", "Pick up location", value.pickup, () =>
            setActiveField(activeField === "pickup" ? null : "pickup"),
          )}
          {fieldBox(dropoffRef, "location", "Drop off location", value.dropoff, () =>
            setActiveField(activeField === "dropoff" ? null : "dropoff"),
          )}
          {fieldBox(pickupDateRef, "calendar", "Pick up date", formatDate(value.pickupDate), () =>
            setActiveField(activeField === "date" ? null : "date"),
          )}
          {fieldBox(pickupTimeRef, "clock", "Pick up time", value.pickupTime, () =>
            setActiveField(activeField === "date" ? null : "date"),
          )}
          {isReturn &&
            fieldBox(
              dropoffDateRef,
              "calendar",
              "Drop off date",
              value.dropoffDate ? formatDate(value.dropoffDate) : "Select",
              () => setActiveField(activeField === "date" ? null : "date"),
            )}
          {isReturn &&
            fieldBox(dropoffTimeRef, "clock", "Drop off time", value.dropoffTime, () =>
              setActiveField(activeField === "date" ? null : "date"),
            )}

          <button
            type="button"
            onClick={() => onSearch(value)}
            className="flex h-[52px] shrink-0 items-center gap-2 rounded-xl bg-[color:var(--color-ink)] px-6 text-sm font-bold text-white hover:bg-black"
          >
            <Icon name="search" size={16} />
            Update
          </button>
        </div>

        {activeField === "pickup" && (
          <LocationPickerSheet
            label="Pick up location"
            anchorRef={pickupRef}
            onSelect={(v) => {
              setValue((s) => ({ ...s, pickup: v }));
              setActiveField(null);
            }}
            onClose={() => setActiveField(null)}
          />
        )}
        {activeField === "dropoff" && (
          <LocationPickerSheet
            label="Drop off location"
            anchorRef={dropoffRef}
            onSelect={(v) => {
              setValue((s) => ({ ...s, dropoff: v }));
              setActiveField(null);
            }}
            onClose={() => setActiveField(null)}
          />
        )}
        {activeField === "date" && (
          <DatePickerSheet
            mode={isReturn ? "range" : "single"}
            anchorRef={pickupDateRef}
            initialPickup={value.pickupDate}
            initialDropoff={value.dropoffDate ?? undefined}
            initialPickupTime={value.pickupTime}
            initialDropoffTime={value.dropoffTime}
            onConfirm={({ pickup, pickupTime, dropoff, dropoffTime }) => {
              setValue((s) => ({
                ...s,
                pickupDate: pickup,
                pickupTime,
                dropoffDate: dropoff ?? s.dropoffDate,
                dropoffTime: dropoffTime ?? s.dropoffTime,
              }));
              setActiveField(null);
            }}
            onClose={() => setActiveField(null)}
          />
        )}
      </div>
    </>
  );
}

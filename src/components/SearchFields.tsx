import { useRef, useState } from "react";
import type { ReactNode } from "react";
import Icon from "./Icon";
import { Checkbox } from "./CheckboxRow";
import LocationPickerSheet from "./LocationPickerSheet";
import DatePickerSheet from "./DatePickerSheet";
import type { SearchValue } from "../lib/booking";
import { daysBetween } from "../lib/tripDuration";
import { durationLabel, isDayBased } from "../lib/booking";

// The one search form used on Home, the results header and the edit-search
// sheet. Every booking type gets the same fields — pick-up, an optional
// different drop-off, and a pick-up / drop-off date and time — so the types
// differ only in what those fields mean, not in what the user has to fill.
export default function SearchFields({
  value,
  onChange,
  layout = "stack",
  anchored = false,
  showDuration = true,
  action,
}: {
  value: SearchValue;
  onChange: (next: SearchValue) => void;
  /** "row" lays the fields out horizontally from lg; "stack" keeps a column. */
  layout?: "row" | "stack";
  /** Open the pickers as popovers anchored to the field (desktop); otherwise as sheets. */
  anchored?: boolean;
  showDuration?: boolean;
  /** Search / Update button, rendered at the end of the field row. */
  action?: ReactNode;
}) {
  const [active, setActive] = useState<"pickup" | "dropoff" | "date" | null>(
    null,
  );
  const [note, setNote] = useState<string | null>(null);
  const pickupRef = useRef<HTMLDivElement>(null);
  const dropoffRef = useRef<HTMLDivElement>(null);
  const dateRef = useRef<HTMLDivElement>(null);

  const differentDropoff = value.dropoff !== value.pickup;
  const dayBased = isDayBased(value.type);
  const startLabel = value.type === "self-drive" ? "Collect" : "Pick up";
  const endLabel = value.type === "self-drive" ? "Return" : "Drop off";

  function fmtDate(d: Date) {
    return d.toLocaleDateString(undefined, { day: "numeric", month: "short" });
  }

  function setDifferentDropoff(on: boolean) {
    onChange({
      ...value,
      dropoff: on
        ? value.dropoff !== value.pickup
          ? value.dropoff
          : ""
        : value.pickup,
    });
    if (on) setActive("dropoff");
  }

  function handleDates(r: {
    pickup: Date;
    pickupTime: string;
    dropoff?: Date;
    dropoffTime?: string;
  }) {
    const dropoffDate = r.dropoff ?? r.pickup;
    const dropoffTime = r.dropoffTime ?? value.dropoffTime;
    let next: SearchValue = {
      ...value,
      pickupDate: r.pickup,
      pickupTime: r.pickupTime,
      dropoffDate,
      dropoffTime,
    };
    // A ride is a same-day booking. Asking for the car past that day is a
    // rental, so switch the type rather than refuse the dates.
    if (value.type === "daily" && daysBetween(r.pickup, dropoffDate) > 0) {
      next = { ...next, type: "rental" };
      setNote(
        "Overnight trips are booked as a rental — we've switched you over.",
      );
    } else {
      setNote(null);
    }
    setActive(null);
    onChange(next);
  }

  const fieldClass =
    "flex h-[58px] w-full items-center gap-2 rounded-xl border border-[color:var(--color-border)] bg-white px-3 text-left transition-colors hover:border-[color:var(--color-ink)] lg:h-[56px]";
  const labelClass =
    "whitespace-nowrap t-label text-[color:var(--color-ink-soft)]";
  const valueClass =
    "truncate t-body-sm font-bold text-[color:var(--color-ink-87)]";
  const row = layout === "row";
  const selfDrive = value.type === "self-drive";

  return (
    <div className="flex flex-col">
      {/* Sits between the type tabs and the fields, with the duration beside
          it, so the row reads as the settings for the search. */}
      {/* Checkbox above the fields on every screen; the duration sits beside
          it on desktop and moves below the fields, centred, on phones. */}
      <div className="order-1 mb-3 flex flex-wrap items-center gap-x-5 gap-y-1.5">
        <Checkbox
          inline
          checked={differentDropoff}
          onChange={setDifferentDropoff}
          label={
            selfDrive
              ? "Return the car to a different location"
              : "Drop off at a different location"
          }
        />
        {showDuration && (
          <p className="hidden t-body-sm font-semibold text-[color:var(--color-success)] lg:block">
            Duration: {durationLabel(value)}
          </p>
        )}
      </div>
      {showDuration && (
        <p className="order-3 mt-3 text-center t-body-sm font-semibold text-[color:var(--color-success)] lg:hidden">
          Duration: {durationLabel(value)}
        </p>
      )}

      <div
        className={`order-2 flex flex-col gap-3 ${row ? "lg:flex-row lg:items-start" : ""}`}
      >
        {/* Pick-up location */}
        <div
          ref={pickupRef}
          className={`relative ${row ? "lg:min-w-0 lg:flex-1" : ""}`}
        >
          <button
            type="button"
            onClick={() => setActive(active === "pickup" ? null : "pickup")}
            className={fieldClass}
          >
            <Icon
              name="location"
              size={20}
              className="shrink-0 text-[color:var(--color-ink)]"
            />
            <span className="flex min-w-0 flex-col gap-1">
              <span className={labelClass}>
                {selfDrive
                  ? differentDropoff
                    ? "Collect at"
                    : "Collect & return at"
                  : differentDropoff
                    ? "Pick up"
                    : "Pick up & drop off"}
              </span>
              <span className={valueClass}>{value.pickup}</span>
            </span>
          </button>
          {active === "pickup" && (
            <LocationPickerSheet
              label={selfDrive ? "Collect at" : "Pick up"}
              anchorRef={anchored ? pickupRef : undefined}
              onSelect={(v) => {
                onChange({
                  ...value,
                  pickup: v,
                  dropoff: differentDropoff ? value.dropoff : v,
                });
                setActive(null);
              }}
              onClose={() => setActive(null)}
            />
          )}
        </div>

        {/* Swap the two places. Sits on the seam between the fields: at the
            right on phones (stacked), centred on desktop (side by side). */}
        {differentDropoff && (
          <button
            type="button"
            onClick={() =>
              onChange({
                ...value,
                pickup: value.dropoff,
                dropoff: value.pickup,
              })
            }
            aria-label="Swap pick-up and drop-off"
            className={`icon-btn icon-btn-filled z-10 -my-[26px] mr-3 size-9 self-end border-2 border-white ${
              row
                ? "lg:mx-[-26px] lg:my-0 lg:mr-[-26px] lg:mt-[10px] lg:self-start"
                : ""
            }`}
          >
            <Icon
              name="swap"
              size={16}
              strokeWidth={2.3}
              className={row ? "lg:rotate-90" : ""}
            />
          </button>
        )}

        {/* Drop-off location, only when it differs */}
        {differentDropoff && (
          <div
            ref={dropoffRef}
            className={`relative ${row ? "lg:min-w-0 lg:flex-1" : ""}`}
          >
            <button
              type="button"
              onClick={() => setActive(active === "dropoff" ? null : "dropoff")}
              className={fieldClass}
            >
              <Icon
                name="location"
                size={20}
                className="shrink-0 text-[color:var(--color-ink)]"
              />
              <span className="flex min-w-0 flex-col gap-1">
                <span className={labelClass}>
                  {selfDrive ? "Return at" : "Drop off"}
                </span>
                <span
                  className={
                    value.dropoff
                      ? valueClass
                      : "t-body-sm text-[color:var(--color-muted)]"
                  }
                >
                  {value.dropoff || "Choose a place"}
                </span>
              </span>
            </button>
            {active === "dropoff" && (
              <LocationPickerSheet
                label={selfDrive ? "Return at" : "Drop off"}
                anchorRef={anchored ? dropoffRef : undefined}
                onSelect={(v) => {
                  onChange({ ...value, dropoff: v });
                  setActive(null);
                }}
                onClose={() => setActive(null)}
              />
            )}
          </div>
        )}

        {/* Dates */}
        <div
          ref={dateRef}
          className={`relative ${row ? "lg:min-w-0 lg:flex-[1.4]" : ""}`}
        >
          <div className="flex overflow-hidden rounded-xl border border-[color:var(--color-border)] bg-white lg:h-[56px]">
            <button
              type="button"
              onClick={() => setActive(active === "date" ? null : "date")}
              className="flex h-14 min-w-0 flex-1 items-center gap-2 px-3 text-left transition-colors hover:bg-[color:var(--color-surface-soft)] lg:h-full"
            >
              <Icon
                name="calendar"
                size={20}
                className="shrink-0 text-[color:var(--color-ink)]"
              />
              <span className="flex min-w-0 flex-col gap-1">
                <span className={labelClass}>{startLabel}</span>
                <span className={valueClass}>
                  {fmtDate(value.pickupDate)}, {value.pickupTime}
                </span>
              </span>
            </button>
            <div className="w-px bg-[color:var(--color-border)]" />
            <button
              type="button"
              onClick={() => setActive(active === "date" ? null : "date")}
              className="flex h-14 min-w-0 flex-1 items-center gap-2 px-3 text-left transition-colors hover:bg-[color:var(--color-surface-soft)] lg:h-full"
            >
              <Icon
                name={dayBased ? "calendar" : "clock"}
                size={20}
                className="shrink-0 text-[color:var(--color-ink)]"
              />
              <span className="flex min-w-0 flex-col gap-1">
                <span className={labelClass}>{endLabel}</span>
                <span className={valueClass}>
                  {fmtDate(value.dropoffDate)}, {value.dropoffTime}
                </span>
              </span>
            </button>
          </div>
          {active === "date" && (
            <DatePickerSheet
              mode="range"
              anchorRef={anchored ? dateRef : undefined}
              initialPickup={value.pickupDate}
              initialDropoff={value.dropoffDate}
              initialPickupTime={value.pickupTime}
              initialDropoffTime={value.dropoffTime}
              pickupLabel={startLabel}
              dropoffLabel={endLabel}
              onConfirm={handleDates}
              onClose={() => setActive(null)}
            />
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>

      {note && (
        <p className="order-4 mt-2 t-caption text-[color:var(--color-ink-soft)]">
          {note}
        </p>
      )}
    </div>
  );
}

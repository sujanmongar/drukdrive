import { useRef, useState } from "react";
import Icon from "./Icon";
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
}: {
  value: SearchValue;
  onChange: (next: SearchValue) => void;
  /** "row" lays the fields out horizontally from lg; "stack" keeps a column. */
  layout?: "row" | "stack";
  /** Open the pickers as popovers anchored to the field (desktop); otherwise as sheets. */
  anchored?: boolean;
  showDuration?: boolean;
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
  const labelClass = "text-[11px] text-[color:var(--color-ink-soft)]";
  const valueClass =
    "truncate text-sm font-bold text-[color:var(--color-ink-87)]";
  const row = layout === "row";
  const selfDrive = value.type === "self-drive";

  return (
    <div>
      {/* Sits between the type tabs and the fields, so it reads as a setting
          for the search rather than a stray field. */}
      <label className="mb-3 flex w-fit cursor-pointer items-center gap-2 t-body-sm text-[color:var(--color-ink)]">
        <input
          type="checkbox"
          checked={differentDropoff}
          onChange={(e) => setDifferentDropoff(e.target.checked)}
          className="size-4 accent-[color:var(--color-ink)]"
        />
        {selfDrive
          ? "Return the car to a different location"
          : "Drop off at a different location"}
      </label>

      <div
        className={`flex flex-col gap-3 ${row ? "lg:flex-row lg:items-start" : ""}`}
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
                    ? "Collect the car at"
                    : "Collect and return the car at"
                  : differentDropoff
                    ? "Pick up location"
                    : "Pick up and drop off location"}
              </span>
              <span className={valueClass}>{value.pickup}</span>
            </span>
          </button>
          {active === "pickup" && (
            <LocationPickerSheet
              label={selfDrive ? "Collect the car at" : "Pick up location"}
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
                  {selfDrive ? "Return the car at" : "Drop off location"}
                </span>
                <span
                  className={
                    value.dropoff
                      ? valueClass
                      : "text-sm text-[color:var(--color-muted)]"
                  }
                >
                  {value.dropoff || "Choose a place"}
                </span>
              </span>
            </button>
            {active === "dropoff" && (
              <LocationPickerSheet
                label={selfDrive ? "Return the car at" : "Drop off location"}
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
                <span className={labelClass}>{startLabel} date & time</span>
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
                <span className={labelClass}>{endLabel} date & time</span>
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
      </div>

      {showDuration && (
        <p className="mt-3 t-body-sm font-semibold text-[color:var(--color-success)]">
          Duration: {durationLabel(value)}
        </p>
      )}
      {note && (
        <p className="mt-2 t-caption text-[color:var(--color-ink-soft)]">
          {note}
        </p>
      )}
    </div>
  );
}

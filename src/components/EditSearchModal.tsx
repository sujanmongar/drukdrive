import { useState } from "react";
import Icon from "./Icon";
import LocationPickerSheet from "./LocationPickerSheet";
import DatePickerSheet from "./DatePickerSheet";
import BookingTypeTabs from "./BookingTypeTabs";
import type { BookingType } from "../lib/routes";

export type EditSearchValue = {
  type: BookingType;
  tripMode: "one-way" | "return";
  pickup: string;
  dropoff: string;
  pickupDate: Date;
  pickupTime: string;
  dropoffDate: Date | null;
  dropoffTime: string;
};

export default function EditSearchModal({
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

  // Field set follows the booking type, the same way it does on Home.
  const showTripModeTabs = value.type === "daily";
  const isSingleLocation = value.type === "outstation" || value.type === "self-drive";
  const showSecondDate =
    value.type === "rental" || value.type === "self-drive" || (value.type === "daily" && value.tripMode === "return");
  const dateMode = showSecondDate ? "range" : "single";

  function formatDate(d: Date) {
    return d.toLocaleDateString(undefined, { day: "numeric", month: "short" });
  }

  return (
    <div className="fixed inset-0 z-[55] flex items-start justify-center bg-black/40 p-0 sm:items-center sm:p-4">
      <div className="flex h-full w-full flex-col bg-white sm:h-auto sm:max-w-[440px] sm:rounded-2xl">
        <div className="flex items-center gap-4 border-b border-[color:var(--color-border)] p-4">
          <button type="button" onClick={onClose} aria-label="Close">
            <Icon name="close" size={22} className="text-[color:var(--color-ink)]" />
          </button>
          <h2 className="text-lg font-bold text-[color:var(--color-ink)]">Edit your search</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <BookingTypeTabs value={value.type} onChange={(t) => setValue((v) => ({ ...v, type: t }))} />

          {showTripModeTabs && (
            <div className="mt-5 flex gap-5 border-b border-[color:var(--color-border)]">
              {(["one-way", "return"] as const).map((m) => {
                const active = value.tripMode === m;
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setValue((v) => ({ ...v, tripMode: m }))}
                    className={`pb-2.5 text-sm transition-colors ${
                      active ? "border-b-2 border-[color:var(--color-ink)] font-bold text-[color:var(--color-ink)]" : "text-[color:var(--color-muted)]"
                    }`}
                  >
                    {m === "one-way" ? "One Way" : "Return"}
                  </button>
                );
              })}
            </div>
          )}

          <div className="mt-5 flex flex-col gap-3">
            <button
              type="button"
              onClick={() => setActiveField("pickup")}
              className="flex h-[58px] items-center gap-2 rounded-xl border border-[color:var(--color-border)] px-3 text-left hover:border-[color:var(--color-ink)]"
            >
              <Icon name="location" size={20} className="shrink-0 text-[color:var(--color-ink)]" />
              <span className="flex min-w-0 flex-col gap-1">
                <span className="text-[11px] text-[color:var(--color-ink-soft)]">
                  {isSingleLocation ? "Location" : "Pick up location"}
                </span>
                <span className="truncate text-sm font-bold text-[color:var(--color-ink)]">{value.pickup}</span>
              </span>
            </button>
            {!isSingleLocation && (
              <button
                type="button"
                onClick={() => setActiveField("dropoff")}
                className="flex h-[58px] items-center gap-2 rounded-xl border border-[color:var(--color-border)] px-3 text-left hover:border-[color:var(--color-ink)]"
              >
                <Icon name="location" size={20} className="shrink-0 text-[color:var(--color-ink)]" />
                <span className="flex min-w-0 flex-col gap-1">
                  <span className="text-[11px] text-[color:var(--color-ink-soft)]">Drop off location</span>
                  <span className="truncate text-sm font-bold text-[color:var(--color-ink)]">{value.dropoff}</span>
                </span>
              </button>
            )}

            {showSecondDate ? (
              <div className="flex overflow-hidden rounded-xl border border-[color:var(--color-border)]">
                <button
                  type="button"
                  onClick={() => setActiveField("date")}
                  className="flex h-14 flex-1 items-center gap-2 px-3 text-left hover:bg-neutral-50"
                >
                  <Icon name="calendar" size={20} className="shrink-0 text-[color:var(--color-ink)]" />
                  <span className="flex min-w-0 flex-col gap-1">
                    <span className="text-[11px] text-[color:var(--color-ink-soft)]">Pick up date</span>
                    <span className="truncate text-sm font-bold text-[color:var(--color-ink)]">
                      {formatDate(value.pickupDate)} {value.pickupTime}
                    </span>
                  </span>
                </button>
                <div className="w-px bg-[color:var(--color-border)]" />
                <button
                  type="button"
                  onClick={() => setActiveField("date")}
                  className="flex h-14 flex-1 items-center gap-2 px-3 text-left hover:bg-neutral-50"
                >
                  <Icon name="calendar" size={20} className="shrink-0 text-[color:var(--color-ink)]" />
                  <span className="flex min-w-0 flex-col gap-1">
                    <span className="text-[11px] text-[color:var(--color-ink-soft)]">Drop off date</span>
                    <span className="truncate text-sm font-bold text-[color:var(--color-ink)]">
                      {value.dropoffDate ? `${formatDate(value.dropoffDate)} ${value.dropoffTime}` : "Select"}
                    </span>
                  </span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setActiveField("date")}
                className="flex h-14 items-center gap-2 rounded-xl border border-[color:var(--color-border)] px-3 text-left hover:bg-neutral-50"
              >
                <Icon name="calendar" size={20} className="shrink-0 text-[color:var(--color-ink)]" />
                <span className="flex min-w-0 flex-col gap-1">
                  <span className="text-[11px] text-[color:var(--color-ink-soft)]">Pick up date</span>
                  <span className="truncate text-sm font-bold text-[color:var(--color-ink)]">
                    {formatDate(value.pickupDate)} {value.pickupTime}
                  </span>
                </span>
              </button>
            )}
          </div>
        </div>

        <div className="border-t border-[color:var(--color-border)] p-4">
          <button
            type="button"
            onClick={() => onSearch(value)}
            className="w-full rounded-xl bg-[color:var(--color-ink)] py-4 text-base font-bold text-white transition-colors hover:bg-black"
          >
            Search
          </button>
        </div>
      </div>

      {activeField === "pickup" && (
        <LocationPickerSheet
          label="Pick up location"
          onSelect={(v) => {
            setValue((prev) => ({ ...prev, pickup: v }));
            setActiveField(null);
          }}
          onClose={() => setActiveField(null)}
        />
      )}
      {activeField === "dropoff" && (
        <LocationPickerSheet
          label="Drop off location"
          onSelect={(v) => {
            setValue((prev) => ({ ...prev, dropoff: v }));
            setActiveField(null);
          }}
          onClose={() => setActiveField(null)}
        />
      )}
      {activeField === "date" && (
        <DatePickerSheet
          mode={dateMode}
          initialPickup={value.pickupDate}
          initialDropoff={value.dropoffDate ?? undefined}
          initialPickupTime={value.pickupTime}
          initialDropoffTime={value.dropoffTime}
          onConfirm={({ pickup: p, pickupTime: pt, dropoff: d, dropoffTime: dt }) => {
            setValue((prev) => ({
              ...prev,
              pickupDate: p,
              pickupTime: pt,
              dropoffDate: d ?? prev.dropoffDate,
              dropoffTime: dt ?? prev.dropoffTime,
            }));
            setActiveField(null);
          }}
          onClose={() => setActiveField(null)}
        />
      )}
    </div>
  );
}

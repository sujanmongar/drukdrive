import { useMemo, useState, type RefObject } from "react";
import Icon from "./Icon";
import { useMediaQuery } from "../hooks/useMediaQuery";
import AnchoredPopover from "./AnchoredPopover";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const TIME_OPTIONS = ["06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"];

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

// Mon=0 .. Sun=6
function mondayIndex(year: number, month: number, day: number) {
  const jsDay = new Date(year, month, day).getDay(); // Sun=0..Sat=6
  return (jsDay + 6) % 7;
}

function formatShort(date: Date) {
  return `${date.toLocaleDateString(undefined, { weekday: "short" })}, ${date.getDate()} ${MONTH_NAMES[date.getMonth()].slice(0, 3)}`;
}

function MonthGrid({
  year,
  month,
  pickupDate,
  dropoffDate,
  onPick,
}: {
  year: number;
  month: number;
  pickupDate: Date | null;
  dropoffDate: Date | null;
  onPick: (d: Date) => void;
}) {
  const total = daysInMonth(year, month);
  const firstOffset = mondayIndex(year, month, 1);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const cells: (number | null)[] = [...Array(firstOffset).fill(null), ...Array.from({ length: total }, (_, i) => i + 1)];

  function isSameDay(a: Date | null, y: number, m: number, d: number) {
    return !!a && a.getFullYear() === y && a.getMonth() === m && a.getDate() === d;
  }

  return (
    <div>
      <p className="mb-3 text-base font-bold text-[#222]">
        {MONTH_NAMES[month]} {year}
      </p>
      <div className="grid grid-cols-7 gap-y-2 text-center">
        {cells.map((d, i) => {
          if (d === null) return <div key={`empty-${i}`} />;
          const date = new Date(year, month, d);
          const past = date < today;
          const isPickup = isSameDay(pickupDate, year, month, d);
          const isDropoff = isSameDay(dropoffDate, year, month, d);
          const inRange =
            pickupDate && dropoffDate && date > pickupDate && date < dropoffDate;
          return (
            <button
              key={d}
              type="button"
              disabled={past}
              onClick={() => onPick(date)}
              className={`mx-auto flex size-9 items-center justify-center rounded-full text-sm transition-colors ${
                past
                  ? "text-neutral-300"
                  : isPickup || isDropoff
                    ? "bg-[#222] font-bold text-white"
                    : inRange
                      ? "bg-neutral-100 text-[#222]"
                      : "text-[#222] hover:bg-neutral-100"
              }`}
            >
              {d}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function DatePickerSheet({
  mode,
  anchorRef,
  initialPickup,
  initialDropoff,
  initialPickupTime = "10:00",
  initialDropoffTime = "13:00",
  onConfirm,
  onClose,
}: {
  mode: "single" | "range";
  anchorRef?: RefObject<HTMLElement | null>;
  initialPickup?: Date;
  initialDropoff?: Date;
  initialPickupTime?: string;
  initialDropoffTime?: string;
  onConfirm: (result: { pickup: Date; pickupTime: string; dropoff?: Date; dropoffTime?: string }) => void;
  onClose: () => void;
}) {
  const isDesktop = useMediaQuery("(min-width: 768px)") && !!anchorRef;
  const [pickupDate, setPickupDate] = useState<Date | null>(initialPickup ?? null);
  const [dropoffDate, setDropoffDate] = useState<Date | null>(mode === "range" ? initialDropoff ?? null : null);
  const [pickupTime, setPickupTime] = useState(initialPickupTime);
  const [dropoffTime, setDropoffTime] = useState(initialDropoffTime);

  const base = new Date();
  const months = useMemo(
    () =>
      Array.from({ length: 3 }, (_, i) => {
        const d = new Date(base.getFullYear(), base.getMonth() + i, 1);
        return { year: d.getFullYear(), month: d.getMonth() };
      }),
    [],
  );

  function handlePick(date: Date) {
    if (mode === "single") {
      setPickupDate(date);
      return;
    }
    if (!pickupDate || (pickupDate && dropoffDate)) {
      setPickupDate(date);
      setDropoffDate(null);
    } else if (date < pickupDate) {
      setDropoffDate(pickupDate);
      setPickupDate(date);
    } else {
      setDropoffDate(date);
    }
  }

  function handleConfirm() {
    if (!pickupDate) return;
    onConfirm({
      pickup: pickupDate,
      pickupTime,
      dropoff: mode === "range" ? dropoffDate ?? undefined : undefined,
      dropoffTime: mode === "range" ? dropoffTime : undefined,
    });
  }

  const content = (
    <>
      <div className="flex shrink-0 items-center justify-between border-b border-[color:var(--color-border)] p-4 md:p-3">
        <button type="button" onClick={onClose} aria-label="Close" className="md:hidden">
          <Icon name="close" size={22} className="text-[#222]" />
        </button>
        <p className="text-sm font-semibold text-[#222]">Select {mode === "range" ? "dates" : "a date"}</p>
        <span className="w-[22px] md:hidden" />
      </div>

      <div className="grid shrink-0 grid-cols-7 gap-y-2 border-b border-[color:var(--color-border)] px-4 py-3 text-center text-xs font-semibold text-[color:var(--color-muted)] md:px-3 md:py-2">
        {WEEKDAYS.map((w) => (
          <span key={w}>{w}</span>
        ))}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 md:px-3 md:py-3">
        <div className="flex flex-col gap-8">
          {months.map(({ year, month }) => (
            <MonthGrid
              key={`${year}-${month}`}
              year={year}
              month={month}
              pickupDate={pickupDate}
              dropoffDate={dropoffDate}
              onPick={handlePick}
            />
          ))}
        </div>
      </div>

      <div className="shrink-0 border-t border-[color:var(--color-border)] p-4">
        <div className={`mb-4 flex ${mode === "range" ? "divide-x divide-[color:var(--color-border)]" : ""}`}>
          <div className="flex-1 pr-3">
            <p className="text-xs text-[color:var(--color-muted)]">Pick up</p>
            <p className="text-sm font-bold text-[#222]">{pickupDate ? formatShort(pickupDate) : "Select date"}</p>
            <select
              value={pickupTime}
              onChange={(e) => setPickupTime(e.target.value)}
              className="mt-0.5 rounded-md bg-transparent text-sm font-semibold text-[color:var(--color-success)] outline-none"
            >
              {TIME_OPTIONS.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
          {mode === "range" && (
            <div className="flex-1 pl-3">
              <p className="text-xs text-[color:var(--color-muted)]">Drop off</p>
              <p className="text-sm font-bold text-[#222]">
                {dropoffDate ? formatShort(dropoffDate) : "Select date"}
              </p>
              <select
                value={dropoffTime}
                onChange={(e) => setDropoffTime(e.target.value)}
                className="mt-0.5 rounded-md bg-transparent text-sm font-semibold text-[color:var(--color-success)] outline-none"
              >
                {TIME_OPTIONS.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={handleConfirm}
          disabled={!pickupDate || (mode === "range" && !dropoffDate)}
          className="w-full rounded-xl bg-[#222] py-4 text-base font-bold text-white transition-colors hover:bg-black disabled:cursor-not-allowed disabled:opacity-40"
        >
          Select
        </button>
      </div>
    </>
  );

  if (isDesktop && anchorRef) {
    return (
      <>
        <button aria-label="Close" onClick={onClose} className="fixed inset-0 z-[59] cursor-default" />
        <AnchoredPopover anchorRef={anchorRef} width={380} maxHeight={440}>
          {content}
        </AnchoredPopover>
      </>
    );
  }

  return (
    <>
      <button
        aria-label="Close"
        onClick={onClose}
        className="fixed inset-0 z-[59] cursor-default bg-black/40"
      />
      <div className="fixed inset-x-0 top-0 z-[60] flex h-full flex-col bg-white">{content}</div>
    </>
  );
}

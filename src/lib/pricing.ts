// Shared fare math so the price shown on Review, Details, Payment, Success,
// Confirmation and Invoice all agree with each other (no backend — this is
// the one source of truth for the calculation).

import type { Booking } from "./booking";
import { bookingDays, isDayBased, isRoundTrip, rideHours } from "./booking";

export const TAX_RATE = 0.1;
/** Hours in a chargeable day; a daily ride is billed by the hour at this rate. */
const HOURS_PER_DAY = 8;
/** Self-drive deposit, held at pick-up and refunded on return. */
const DEPOSIT_DAYS = 2;

export type AddOn = {
  id: string;
  name: string;
  description: string;
  pricePerDay: number;
  /** What the add-on is for, in one line. */
  purpose: string;
  /** How it works, step by step. */
  howItWorks: string[];
};

// Optional extras, priced per day.
export const addOns: AddOn[] = [
  {
    id: "lmc",
    name: "Last-minute cancellation",
    description:
      "Cancel free of charge up until 1 hour before pick-up instead of 24 hours.",
    pricePerDay: 3.5,
    purpose:
      "For plans that might change — a delayed flight, a shifted meeting, a change of heart.",
    howItWorks: [
      "Without it, a booking cancelled inside 24 hours of pick-up forfeits the amount paid.",
      "With it, you can cancel from your bookings page up to 1 hour before pick-up and the amount paid is refunded in full.",
      "The add-on fee itself is not refundable.",
    ],
  },
  {
    id: "rsa",
    name: "Roadside assistance",
    description:
      "24/7 help on the road — breakdown, flat tyre or a replacement vehicle sent to you.",
    pricePerDay: 2,
    purpose:
      "For long mountain routes where the nearest garage can be hours away.",
    howItWorks: [
      "Call the DrukDrive helpline any time during your trip; the number is on your booking confirmation.",
      "We send the nearest partner mechanic for a breakdown, flat tyre or battery.",
      "If the vehicle can't continue, a replacement is sent to you at no extra cost.",
    ],
  },
];

export function isAddOnId(id: string) {
  return addOns.some((a) => a.id === id);
}
export function parseAddOnIds(raw: string | null): string[] {
  if (!raw) return [];
  return raw.split(",").filter(isAddOnId);
}

export type FareLine = {
  label: string;
  amount: number;
  kind?: "base" | "addon" | "tax" | "discount";
};

export type Fare = {
  /** What the base line covers, e.g. "3 hrs" or "5 days". */
  unit: string;
  days: number;
  base: number;
  addOnsTotal: number;
  taxes: number;
  /** Everything payable to DrukDrive. */
  total: number;
  /** Refundable deposit for self-drive, held at pick-up; not part of total. */
  deposit: number;
  lines: FareLine[];
};

const r2 = (n: number) => Math.round(n * 100) / 100;

export function computeFare(
  booking: Booking,
  pricePerDay: number,
  fmt: (n: number) => string = (n) => `$${n.toFixed(2)}`,
): Fare {
  const days = bookingDays(booking);
  const lines: FareLine[] = [];
  let base: number;
  let unit: string;

  if (isDayBased(booking.type)) {
    base = r2(pricePerDay * days);
    unit = `${days} day${days === 1 ? "" : "s"}`;
    lines.push({
      label: `${fmt(pricePerDay)} × ${unit}`,
      amount: base,
      kind: "base",
    });
  } else {
    // Daily ride: hourly rate for the booked window, never less than the
    // driving time for the route (both ways on a round trip).
    const hourly = r2(pricePerDay / HOURS_PER_DAY);
    const hours = rideHours(booking);
    base = r2(hourly * hours);
    unit = `${hours} hr${hours === 1 ? "" : "s"}${isRoundTrip(booking) ? ", round trip" : ""}`;
    lines.push({
      label: `${fmt(hourly)}/hr × ${hours} hr${hours === 1 ? "" : "s"}`,
      amount: base,
      kind: "base",
    });
  }

  let addOnsTotal = 0;
  for (const a of addOns) {
    if (!booking.addOnIds.includes(a.id)) continue;
    const amt = r2(a.pricePerDay * days);
    addOnsTotal = r2(addOnsTotal + amt);
    lines.push({ label: a.name, amount: amt, kind: "addon" });
  }

  const taxes = r2((base + addOnsTotal) * TAX_RATE);
  lines.push({ label: "Taxes & fees", amount: taxes, kind: "tax" });
  const total = r2(base + addOnsTotal + taxes);
  const deposit =
    booking.type === "self-drive" ? r2(pricePerDay * DEPOSIT_DAYS) : 0;

  return { unit, days, base, addOnsTotal, taxes, total, deposit, lines };
}

/** How much is paid at booking versus at pick-up, by type. */
export function paymentSplit(booking: Booking, total: number) {
  // Daily rides are small and paid in full; rentals and self-drive pay half
  // now and the balance at pick-up.
  if (booking.type === "daily") return { now: total, later: 0 };
  const now = r2(total / 2);
  return { now, later: r2(total - now) };
}

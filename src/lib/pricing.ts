// Shared fare math so the price shown on Review, Details, Payment, Success,
// Confirmation and Invoice all agree with each other (no backend — this is
// the one source of truth for the calculation).

import type { Booking, SearchValue } from "./booking";
import type { BookingType } from "./routes";
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
  /** Which bookings offer it. */
  availableFor: (type: BookingType) => boolean;
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
    // A same-day ride is small enough that the 24-hour rule is fine.
    availableFor: (type) => type !== "daily",
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
    availableFor: () => true,
  },
  {
    id: "guide",
    name: "Licensed guide",
    description:
      "A licensed Bhutanese guide travels with you — required for most sights outside Thimphu and Paro.",
    pricePerDay: 25,
    purpose:
      "For visitors touring beyond Thimphu and Paro, where a licensed guide is required at dzongs and monasteries.",
    howItWorks: [
      "A guide licensed by the Department of Tourism joins you from the first pick-up.",
      "They handle route permits and entry at monuments, and speak English and Dzongkha.",
      "The guide's meals and accommodation on overnight trips are included in this price.",
    ],
    availableFor: (type) => type === "rental",
  },
];

export function addOnsFor(type: BookingType): AddOn[] {
  return addOns.filter((a) => a.availableFor(type));
}

export const PROMO_CODES: Record<string, number> = {
  DRUK10: 0.1,
  WELCOME: 0.05,
};

/** Discount for a promo code against a total; 0 when the code is unknown. */
export function promoDiscount(code: string | null, total: number): number {
  const rate = code ? PROMO_CODES[code.toUpperCase()] : undefined;
  return rate ? Math.round(total * rate * 100) / 100 : 0;
}

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

/** The price a result card shows for this search: the trip total for a
 *  daily ride, the per-day rate for anything booked by the day. */
export function displayPrice(
  search: SearchValue,
  pricePerDay: number,
): { amount: number; unit: string; note: string } {
  if (isDayBased(search.type)) {
    return { amount: pricePerDay, unit: "/day", note: "+ taxes & fees" };
  }
  const { total } = computeFare(
    { ...search, vehicleId: null, addOnIds: [] },
    pricePerDay,
  );
  return { amount: total, unit: "/trip", note: "incl. taxes & fees" };
}

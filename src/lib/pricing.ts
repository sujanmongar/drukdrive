// Shared fare math so the price shown on Review, Details, Payment, Payment
// Success, Confirmation and Invoice all agree with each other for a live
// booking (no backend — this is the one source of truth for the calculation).

export const RENTAL_DAYS = 3;
export const TAX_RATE = 0.1;

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

// Optional extras offered on the review step, priced per day.
export const addOns: AddOn[] = [
  {
    id: "lmc",
    name: "Last-minute cancellation",
    description: "Cancel free of charge up until 1 hour before pick-up instead of 24 hours.",
    pricePerDay: 3.5,
    purpose: "For plans that might change — a delayed flight, a shifted meeting, a change of heart.",
    howItWorks: [
      "Without it, a booking cancelled inside 24 hours of pick-up forfeits the amount paid.",
      "With it, you can cancel from your bookings page up to 1 hour before pick-up and the amount paid is refunded in full.",
      "The add-on fee itself is not refundable.",
    ],
  },
  {
    id: "rsa",
    name: "Roadside assistance",
    description: "24/7 help on the road — breakdown, flat tyre or a replacement vehicle sent to you.",
    pricePerDay: 2,
    purpose: "For long mountain routes where the nearest garage can be hours away.",
    howItWorks: [
      "Call the DrukDrive helpline any time during your trip; the number is on your booking confirmation.",
      "We send the nearest partner mechanic for a breakdown, flat tyre or battery.",
      "If the vehicle can't continue, a replacement is sent to you at no extra cost.",
    ],
  },
];

export function parseAddOnIds(raw: string | null): string[] {
  if (!raw) return [];
  return raw.split(",").filter((id) => addOns.some((a) => a.id === id));
}

export function computeFare(pricePerDay: number, addOnIds: string[] = []) {
  const baseFare = Math.round(pricePerDay * RENTAL_DAYS * 100) / 100;
  const addOnsTotal =
    Math.round(
      addOns.filter((a) => addOnIds.includes(a.id)).reduce((sum, a) => sum + a.pricePerDay * RENTAL_DAYS, 0) * 100,
    ) / 100;
  const taxes = Math.round((baseFare + addOnsTotal) * TAX_RATE * 100) / 100;
  const total = Math.round((baseFare + addOnsTotal + taxes) * 100) / 100;
  return { baseFare, addOnsTotal, taxes, total };
}

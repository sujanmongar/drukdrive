// Shared fare math so the price shown on Vehicle Details, Payment, Payment
// Success, Confirmation and Invoice all agree with each other for a live
// booking (no backend — this is the one source of truth for the calculation).

export const RENTAL_DAYS = 3;
export const TAX_RATE = 0.1;

export function computeFare(pricePerDay: number) {
  const baseFare = Math.round(pricePerDay * RENTAL_DAYS * 100) / 100;
  const taxes = Math.round(baseFare * TAX_RATE * 100) / 100;
  const total = Math.round((baseFare + taxes) * 100) / 100;
  return { baseFare, taxes, total };
}

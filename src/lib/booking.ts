import type { BookingType } from "./routes";
import {
  combineDateTime,
  daysBetween,
  daysHoursBetween,
  estimateDurationHours,
  formatDayHour,
} from "./tripDuration";
import { formatTripDate } from "./formatTripDate";
import { t, tn } from "./i18n";

export type ClientType = "local" | "tourist";

// What the search widget collects. One shape for every booking type: where,
// optionally where else, and a pick-up / drop-off date and time.
export type SearchValue = {
  type: BookingType;
  pickup: string;
  /** Same as `pickup` when the car comes back to where it started. */
  dropoff: string;
  pickupDate: Date;
  pickupTime: string;
  dropoffDate: Date;
  dropoffTime: string;
};

// One booking, carried through every checkout step in the URL. Every page
// reads this instead of picking loose params, so a type or date can never
// be dropped between steps.
export type Booking = SearchValue & {
  vehicleId: string | null;
  addOnIds: string[];
};

export const DEFAULT_PICKUP = "Thimphu, Druk School";
export const DEFAULT_DROPOFF = "Punakha, Taxi Parking";

export const bookingTypes: BookingType[] = ["daily", "rental", "self-drive"];

export function isBookingType(v: string | null): v is BookingType {
  return bookingTypes.includes(v as BookingType);
}

/** Types booked by the day rather than by the trip. */
export function isDayBased(type: BookingType) {
  return type === "rental" || type === "self-drive";
}

/** A daily ride that ends where it started: the driver waits and brings you back. */
export function isRoundTrip(b: SearchValue) {
  return b.dropoff === b.pickup;
}

/** Sensible drop-off date for a type: same day for a ride, next day for a rental. */
export function defaultDropoffDate(type: BookingType, pickupDate: Date): Date {
  const d = new Date(pickupDate);
  if (isDayBased(type)) d.setDate(d.getDate() + 1);
  return d;
}

/** Number of chargeable days: at least one, counted from start to end. */
export function bookingDays(b: SearchValue): number {
  if (!isDayBased(b.type)) return 1;
  return Math.max(1, daysBetween(b.pickupDate, b.dropoffDate));
}

/** Hours the car is booked for, from pick-up time to drop-off time. */
export function windowHours(b: SearchValue): number {
  const { days, hours } = daysHoursBetween(
    combineDateTime(b.pickupDate, b.pickupTime),
    combineDateTime(b.dropoffDate, b.dropoffTime),
  );
  return days * 24 + hours;
}

/** Hours a daily ride is billed for: the booked window, but never less than
 *  the driving time (both ways on a round trip), and at least one hour. */
export function rideHours(b: SearchValue): number {
  const route =
    estimateDurationHours(b.pickup, b.dropoff) * (isRoundTrip(b) ? 2 : 1);
  return Math.max(1, Math.round(Math.max(windowHours(b), route)));
}

/** "Duration: …" text under the search widget. */
export function durationLabel(b: SearchValue): string {
  if (isDayBased(b.type)) {
    const days = bookingDays(b);
    return tn(days, "{n} day", "{n} days");
  }
  return formatDayHour({ days: 0, hours: rideHours(b) });
}

export function defaultSearch(type: BookingType = "daily"): SearchValue {
  const pickupDate = new Date();
  return {
    type,
    pickup: DEFAULT_PICKUP,
    dropoff: DEFAULT_PICKUP,
    pickupDate,
    pickupTime: "10:00",
    dropoffDate: defaultDropoffDate(type, pickupDate),
    dropoffTime: type === "daily" ? "16:00" : "10:00",
  };
}

export function parseSearch(params: URLSearchParams): SearchValue {
  const typeParam = params.get("type");
  const type = isBookingType(typeParam) ? typeParam : "daily";
  const pickupDateParam = params.get("pickupDate");
  const dropoffDateParam = params.get("dropoffDate");
  const pickupDate = pickupDateParam ? new Date(pickupDateParam) : new Date();
  const pickup = params.get("pickup") || DEFAULT_PICKUP;
  return {
    type,
    pickup,
    dropoff: params.get("dropoff") || pickup,
    pickupDate,
    pickupTime: params.get("pickupTime") || "10:00",
    dropoffDate: dropoffDateParam
      ? new Date(dropoffDateParam)
      : defaultDropoffDate(type, pickupDate),
    dropoffTime:
      params.get("dropoffTime") || (type === "daily" ? "16:00" : "10:00"),
  };
}

export function parseBooking(
  params: URLSearchParams,
  validAddOn: (id: string) => boolean,
): Booking {
  return {
    ...parseSearch(params),
    vehicleId: params.get("vehicleId"),
    addOnIds: (params.get("addons") || "").split(",").filter(validAddOn),
  };
}

/** Serialises a search or booking into the params every step expects. */
export function bookingToParams(
  b: SearchValue & Partial<Booking>,
  extra: Record<string, string> = {},
): URLSearchParams {
  const params = new URLSearchParams({
    type: b.type,
    pickup: b.pickup,
    dropoff: b.dropoff,
    pickupDate: b.pickupDate.toISOString(),
    pickupTime: b.pickupTime,
    dropoffDate: b.dropoffDate.toISOString(),
    dropoffTime: b.dropoffTime,
    // Display string kept for the post-payment pages that only show it.
    date: formatTripDate(b.pickupDate, b.pickupTime),
  });
  if (b.vehicleId) params.set("vehicleId", b.vehicleId);
  if (b.addOnIds?.length) params.set("addons", b.addOnIds.join(","));
  for (const [k, v] of Object.entries(extra)) params.set(k, v);
  return params;
}

export function formatPickup(b: SearchValue) {
  return formatTripDate(b.pickupDate, b.pickupTime);
}
export function formatDropoff(b: SearchValue) {
  return formatTripDate(b.dropoffDate, b.dropoffTime);
}

/** The payment method rides in the URL in English ("Net Banking (Bank of
 *  Bhutan)"); this shows it in the current language. */
export function paymentMethodLabel(method: string) {
  const bank = method.match(/^Net Banking \((.+)\)$/)?.[1];
  return bank ? t("Net Banking ({bank})", { bank }) : t(method);
}

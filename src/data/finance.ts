import { tx } from "../lib/i18n";

// Account statements for both sides of the marketplace, built from the
// same bookings the rest of the app shows. Amounts are USD, like every
// price in mockData, and are formatted for display by useCurrency().

export type Side = "debit" | "credit";

export type LedgerEntry = {
  id: string;
  /** ISO date, so entries sort and group by month. */
  date: string;
  kind: LedgerKind;
  particulars: string;
  bookingId?: string;
  amount: number;
  status?: "Pending";
};

export type LedgerKind =
  // renter
  | "charge"
  | "payment"
  | "credit-note"
  | "debit-note"
  | "refund"
  // driver
  | "fare"
  | "cancellation-fee"
  | "service-fee"
  | "payout";

/** Which column each kind lands in. Renter: charges are debits, money in is
 *  a credit. Driver: what you earn is a credit, fees and payouts debits. */
export const sideOf: Record<LedgerKind, Side> = {
  charge: "debit",
  "debit-note": "debit",
  refund: "debit",
  payment: "credit",
  "credit-note": "credit",
  fare: "credit",
  "cancellation-fee": "credit",
  "service-fee": "debit",
  payout: "debit",
};

export const kindLabel: Record<LedgerKind, string> = {
  charge: tx("Booking"),
  payment: tx("Payment"),
  "credit-note": tx("Credit note"),
  "debit-note": tx("Debit note"),
  refund: tx("Refund"),
  fare: tx("Trip fare"),
  "cancellation-fee": tx("Cancellation fee"),
  "service-fee": tx("Service fee"),
  payout: tx("Payout"),
};

/** Filter choices per side, in the order they read best. */
export const kindFilters = {
  customer: ["charge", "payment", "credit-note", "debit-note", "refund"],
  driver: ["fare", "cancellation-fee", "service-fee", "payout"],
} as const satisfies Record<string, readonly LedgerKind[]>;

// Karma as a renter: a cancelled rental (half paid, credited, refunded),
// a finished daily ride with one extra hour, and today's paid booking.
export const customerLedger: LedgerEntry[] = [
  {
    id: "INV-GI1671176980",
    date: "2026-08-28",
    kind: "charge",
    bookingId: "GI1671176980",
    particulars: tx("Rental · Toyota Hiace Bus, 1 day"),
    amount: 53,
  },
  {
    id: "PAY-260828",
    date: "2026-08-28",
    kind: "payment",
    bookingId: "GI1671176980",
    particulars: tx("Half now · Bank of Bhutan net banking"),
    amount: 26.5,
  },
  {
    id: "CN-GI1671176980",
    date: "2026-09-01",
    kind: "credit-note",
    bookingId: "GI1671176980",
    particulars: tx("Cancelled more than 24 h before pick-up"),
    amount: 53,
  },
  {
    id: "RF-GI1671176980",
    date: "2026-09-03",
    kind: "refund",
    bookingId: "GI1671176980",
    particulars: tx("Refund to Bank of Bhutan ••3310"),
    amount: 26.5,
  },
  {
    id: "INV-GI1671177201",
    date: "2026-09-17",
    kind: "charge",
    bookingId: "GI1671177201",
    particulars: tx("Daily ride · Hyundai Santa Fe, Paro Airport → Thimphu"),
    amount: 54,
  },
  {
    id: "PAY-260917",
    date: "2026-09-17",
    kind: "payment",
    bookingId: "GI1671177201",
    particulars: tx("Paid in full · Visa ••4242"),
    amount: 54,
  },
  {
    id: "DN-GI1671177201",
    date: "2026-09-19",
    kind: "debit-note",
    bookingId: "GI1671177201",
    particulars: tx("1 extra hour on the trip"),
    amount: 6,
  },
  {
    id: "PAY-260919",
    date: "2026-09-19",
    kind: "payment",
    bookingId: "GI1671177201",
    particulars: tx("Extra hour paid to the driver · mBoB"),
    amount: 6,
  },
  {
    id: "INV-GI1671177263",
    date: "2026-09-22",
    kind: "charge",
    bookingId: "GI1671177263",
    particulars: tx("Daily ride · Toyota Prado GX, Thimphu → Punakha"),
    amount: 58,
  },
  {
    id: "PAY-260922",
    date: "2026-09-22",
    kind: "payment",
    bookingId: "GI1671177263",
    particulars: tx("Paid in full · Visa ••4242"),
    amount: 58,
  },
];

// Karma as a driver: three finished trips and one late cancellation, each
// with DrukDrive's 10% service fee, and one payout so far.
export const driverLedger: LedgerEntry[] = [
  {
    id: "FR-HBTTB6619087",
    date: "2026-08-08",
    kind: "fare",
    bookingId: "HBTTB6619087",
    particulars: "Sonam Wangmo · Paro Airport → Thimphu",
    amount: 58,
  },
  {
    id: "SF-HBTTB6619087",
    date: "2026-08-08",
    kind: "service-fee",
    bookingId: "HBTTB6619087",
    particulars: tx("DrukDrive service fee, 10%"),
    amount: 5.8,
  },
  {
    id: "FR-HBTTB7741203",
    date: "2026-08-23",
    kind: "fare",
    bookingId: "HBTTB7741203",
    particulars: "Pema Yangzom · Thimphu → Dochula Pass",
    amount: 58,
  },
  {
    id: "SF-HBTTB7741203",
    date: "2026-08-23",
    kind: "service-fee",
    bookingId: "HBTTB7741203",
    particulars: tx("DrukDrive service fee, 10%"),
    amount: 5.8,
  },
  {
    id: "PO-260825",
    date: "2026-08-25",
    kind: "payout",
    particulars: tx("Payout to Bank of Bhutan ••4821"),
    amount: 104.4,
  },
  {
    id: "FR-HBTTB0982764",
    date: "2026-09-07",
    kind: "fare",
    bookingId: "HBTTB0982764",
    particulars: tx("Tenzin Namgay · Phuentsholing round trip"),
    amount: 53,
  },
  {
    id: "SF-HBTTB0982764",
    date: "2026-09-07",
    kind: "service-fee",
    bookingId: "HBTTB0982764",
    particulars: tx("DrukDrive service fee, 10%"),
    amount: 5.3,
  },
  {
    id: "CF-HBTTB9283434",
    date: "2026-09-19",
    kind: "cancellation-fee",
    bookingId: "HBTTB9283434",
    particulars: tx("Karma Choden cancelled within 24 h · 25% of the fare"),
    amount: 14.5,
  },
  {
    id: "SF-HBTTB9283434",
    date: "2026-09-19",
    kind: "service-fee",
    bookingId: "HBTTB9283434",
    particulars: tx("DrukDrive service fee, 10%"),
    amount: 1.45,
  },
];

/** Where payouts go; shown on the withdraw sheet. */
export const payoutAccount = "Bank of Bhutan ••4821";

/** Signed effect on the balance: credits add, debits subtract. */
export const signed = (e: LedgerEntry) =>
  sideOf[e.kind] === "credit" ? e.amount : -e.amount;

/** Round to cents so sums of .1s and .05s stay exact on screen. */
export const r2 = (n: number) => Math.round(n * 100) / 100;

import type { BookingType } from "./routes";
import type { ClientType } from "./booking";

// What each booking type includes, excludes and asks the customer to read,
// with the few lines that differ for visitors. Kept as data so the review
// and details steps stay thin.

export function inclusionsFor(type: BookingType, client: ClientType): string[] {
  switch (type) {
    case "daily":
      return [
        "Professional driver",
        "Fuel and tolls",
        "Door-to-door pick-up and drop-off",
        "Waiting time on a round trip",
        "Free cancellation up to 24 hours before pick-up",
      ];
    case "rental":
      return [
        "Professional driver for the whole period",
        "Fuel and tolls",
        "Unlimited kilometres within Bhutan",
        "One meal stop each day",
        ...(client === "tourist"
          ? ["Route permits arranged by the driver"]
          : []),
        "Free cancellation up to 24 hours before pick-up",
      ];
    case "self-drive":
      return [
        "Unlimited kilometres within Bhutan",
        "Third-party insurance",
        "24/7 helpline",
        "Full tank at collection, return it full",
        "Free cancellation up to 24 hours before collection",
      ];
  }
}

export function exclusionsFor(type: BookingType, client: ClientType): string[] {
  switch (type) {
    case "daily":
      return [
        "Parking and entry fees",
        "Extra stops beyond the route",
        "Overnight stays (book a rental)",
      ];
    case "rental":
      return [
        "Parking and entry permits",
        "Driver accommodation on overnight trips",
        ...(client === "tourist" ? ["Sustainable Development Fee"] : []),
      ];
    case "self-drive":
      return [
        "Fuel used",
        "Driver",
        "Traffic fines and tolls",
        "Damage above the deposit",
      ];
  }
}

export type Note = { title: string; items: string[] };

export function notesFor(type: BookingType, client: ClientType): Note[] {
  const payment =
    type === "daily"
      ? "The full fare is paid now; nothing is due to the driver."
      : client === "tourist"
        ? "Half the fare is paid now by card. The other half is paid to the driver at pick-up in cash (Nu) or by card."
        : "Half the fare is paid now. The other half is paid to the driver at pick-up by mBoB, card or cash.";
  const common: Note = {
    title: "Payment and cancellation",
    items: [
      payment,
      "Cancel free of charge up to 24 hours before pick-up; later cancellations forfeit the amount paid.",
    ],
  };
  switch (type) {
    case "daily":
      return [
        common,
        {
          title: "On the day",
          items: [
            "Your driver's name, photo and number are shared 2 hours before pick-up.",
            "The driver waits up to 15 minutes at pick-up; on a round trip, waiting time is included.",
            "AC is switched off on steep climbs.",
          ],
        },
      ];
    case "rental":
      return [
        common,
        {
          title: "During the rental",
          items: [
            "The driver is with you from pick-up to drop-off each day; the car is not driven overnight.",
            "Up to 8 hours a day are included; longer days are settled with the driver.",
            ...(client === "tourist"
              ? [
                  "Route permits beyond Thimphu and Paro are arranged by the driver; carry your passport.",
                ]
              : []),
            "AC is switched off on steep climbs.",
          ],
        },
      ];
    case "self-drive":
      return [
        common,
        {
          title: "Driver requirements",
          items: [
            client === "tourist"
              ? "Self drive is open to Indian licence holders only; other visitors are not licensed to drive in Bhutan."
              : "A valid Bhutanese driving licence held for at least 1 year.",
            "Driver aged 21 or over.",
            "A refundable deposit is held at collection and released within 3 days of return.",
          ],
        },
        {
          title: "The car",
          items: [
            "Return with a full tank or fuel is charged at cost.",
            "Fines during the rental are the driver's responsibility.",
          ],
        },
      ];
  }
}

/** Fields the details step asks for, beyond name, phone and email. */
export function identityLabel(client: ClientType) {
  return client === "tourist" ? "Passport number" : "CID number";
}

export function needsFlightNumber(
  client: ClientType,
  pickup: string,
  dropoff: string,
) {
  return client === "tourist" && /airport/i.test(pickup + " " + dropoff);
}

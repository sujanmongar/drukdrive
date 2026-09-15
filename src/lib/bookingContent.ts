import type { BookingType } from "./routes";

// What each booking type includes and what to read before booking. Kept as
// data so the review step stays thin.

export function inclusionsFor(type: BookingType): string[] {
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
        "Route permits arranged by the driver",
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

export type Note = { title: string; items: string[] };

export function notesFor(type: BookingType): Note[] {
  const common: Note = {
    title: "Payment and cancellation",
    items: [
      type === "daily"
        ? "The full fare is paid now; nothing is due to the driver."
        : "Half the fare is paid now. The other half is paid to the driver at pick-up by mBoB, card or cash (Nu).",
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
            "Route permits beyond Thimphu and Paro are arranged by the driver; carry your passport or CID.",
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
            "A valid Bhutanese or Indian driving licence held for at least 1 year. Bhutan does not accept international driving permits.",
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

export function needsFlightNumber(pickup: string, dropoff: string) {
  return /airport/i.test(pickup + " " + dropoff);
}

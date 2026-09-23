import type { BookingType } from "./routes";
import { tx } from "./i18n";

// What each booking type includes and what to read before booking. Kept as
// data so the review step stays thin.

export function inclusionsFor(type: BookingType): string[] {
  switch (type) {
    case "daily":
      return [
        tx("Professional driver"),
        tx("Fuel and tolls"),
        tx("Door-to-door pick-up and drop-off"),
        tx("Waiting time on a round trip"),
        tx("Free cancellation up to 24 hours before pick-up"),
      ];
    case "rental":
      return [
        tx("Professional driver for the whole period"),
        tx("Fuel and tolls"),
        tx("Unlimited kilometres within Bhutan"),
        tx("One meal stop each day"),
        tx("Route permits arranged by the driver"),
        tx("Free cancellation up to 24 hours before pick-up"),
      ];
    case "self-drive":
      return [
        tx("Unlimited kilometres within Bhutan"),
        tx("Third-party insurance"),
        tx("24/7 helpline"),
        tx("Full tank at collection, return it full"),
        tx("Free cancellation up to 24 hours before collection"),
      ];
  }
}

export type Note = { title: string; items: string[] };

export function notesFor(type: BookingType): Note[] {
  const common: Note = {
    title: tx("Payment and cancellation"),
    items: [
      type === "daily"
        ? tx("The full fare is paid now; nothing is due to the driver.")
        : tx(
            "Half the fare is paid now. The other half is paid to the driver at pick-up by mBoB, card or cash (Nu).",
          ),
      tx(
        "Cancel free of charge up to 24 hours before pick-up; later cancellations forfeit the amount paid.",
      ),
    ],
  };
  switch (type) {
    case "daily":
      return [
        common,
        {
          title: tx("On the day"),
          items: [
            tx(
              "Your driver's name, photo and number are shared 2 hours before pick-up.",
            ),
            tx(
              "The driver waits up to 15 minutes at pick-up; on a round trip, waiting time is included.",
            ),
            tx("AC is switched off on steep climbs."),
          ],
        },
      ];
    case "rental":
      return [
        common,
        {
          title: tx("During the rental"),
          items: [
            tx(
              "The driver is with you from pick-up to drop-off each day; the car is not driven overnight.",
            ),
            tx(
              "Up to 8 hours a day are included; longer days are settled with the driver.",
            ),
            tx(
              "Route permits beyond Thimphu and Paro are arranged by the driver; carry your passport or CID.",
            ),
            tx("AC is switched off on steep climbs."),
          ],
        },
      ];
    case "self-drive":
      return [
        common,
        {
          title: tx("Driver requirements"),
          items: [
            tx(
              "A valid Bhutanese or Indian driving licence held for at least 1 year. Bhutan does not accept international driving permits.",
            ),
            tx("Driver aged 21 or over."),
            tx(
              "A refundable deposit is held at collection and released within 3 days of return.",
            ),
          ],
        },
        {
          title: tx("The car"),
          items: [
            tx("Return with a full tank or fuel is charged at cost."),
            tx("Fines during the rental are the driver's responsibility."),
          ],
        },
      ];
  }
}

export function needsFlightNumber(pickup: string, dropoff: string) {
  return /airport/i.test(pickup + " " + dropoff);
}

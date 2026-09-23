// Content for the informational / legal pages linked from the footer, the
// sign-in/sign-up agreement text, and the checkout agreement text. Keyed by
// route path so StaticPage.tsx can look itself up from the URL.

import { tx } from "../lib/i18n";

export type StaticPageContent = {
  title: string;
  intro: string;
  sections: { heading: string; body: string }[];
};

export const staticPages: Record<string, StaticPageContent> = {
  "/about": {
    title: tx("About DrukDrive"),
    intro: tx(
      "DrukDrive connects travelers with verified local drivers and vehicle owners across Bhutan, making it simple to book a comfortable, reliable ride for a daily ride, a multi-day rental, or a self-drive trip.",
    ),
    sections: [
      {
        heading: tx("Our mission"),
        body: tx(
          "Bhutan's roads reward slow, careful travel — and so does finding the right vehicle for the trip. DrukDrive exists to make that matching simple: real vehicles, real drivers, transparent pricing, and a booking flow that works the same whether you're planning weeks ahead or the night before.",
        ),
      },
      {
        heading: tx("How it works"),
        body: tx(
          "Riders search by route and date, compare vehicles from local operators, and book in a few steps with a choice of payment methods. Vehicle owners list their fleet, manage bookings from a driver dashboard, and get paid directly for completed trips.",
        ),
      },
    ],
  },
  "/blog": {
    title: tx("DrukDrive Blog"),
    intro: tx(
      "Notes on road trips, driving conditions, and getting around Bhutan — updated as new posts are published.",
    ),
    sections: [
      {
        heading: tx("Driving Bhutan's mountain passes: what to expect"),
        body: tx(
          "From Thimphu to Punakha, most inter-town routes climb and descend through switchback passes. Vehicles built for these roads — and drivers who know them — make a real difference to trip comfort and travel time.",
        ),
      },
      {
        heading: tx("Choosing the right vehicle for your group"),
        body: tx(
          "A Sedan SUV suits a couple exploring Thimphu and Paro; larger groups touring further afield are usually better served by a Mini Bus or Bus. DrukDrive's category filters make it quick to compare seat count, fuel type and price side by side.",
        ),
      },
    ],
  },
  "/legal/privacy": {
    title: tx("Privacy Policy"),
    intro: tx(
      "This is a front-end prototype and does not collect, store, or transmit real personal data to any server — everything you enter stays in your browser's local storage. This page describes the policy DrukDrive would follow in production.",
    ),
    sections: [
      {
        heading: tx("What we'd collect"),
        body: tx(
          "Account details you provide (name, email, phone), booking details (pickup/drop-off, dates, vehicle selected), and payment confirmation status — never full card numbers, which would be handled by a PCI-compliant payment processor, not stored by DrukDrive directly.",
        ),
      },
      {
        heading: tx("How we'd use it"),
        body: tx(
          "To create and manage bookings, connect riders with drivers, send booking confirmations and receipts, and improve the reliability of the service. We would not sell personal data to third parties.",
        ),
      },
      {
        heading: tx("Your choices"),
        body: tx(
          "You could request a copy of your data or its deletion at any time through account settings or by contacting support.",
        ),
      },
    ],
  },
  "/legal/terms": {
    title: tx("Terms of Service"),
    intro: tx(
      "The terms below describe how DrukDrive's booking platform would be used in production.",
    ),
    sections: [
      {
        heading: tx("Bookings"),
        body: tx(
          "A booking is confirmed once payment (in full or the agreed partial amount) is received. Vehicle owners are responsible for the condition and roadworthiness of listed vehicles; riders are responsible for providing accurate pickup and contact details.",
        ),
      },
      {
        heading: tx("Cancellations"),
        body: tx(
          "Most bookings can be cancelled free of charge up to 24 hours before the scheduled pickup time, from My Bookings. Cancellations made after that window may be subject to the operator's cancellation policy.",
        ),
      },
      {
        heading: tx("Conduct"),
        body: tx(
          "Riders and drivers are both expected to treat each other with courtesy and to communicate delays or changes as early as possible.",
        ),
      },
    ],
  },
  "/legal/user-agreement": {
    title: tx("User Agreement"),
    intro: tx(
      "By creating a DrukDrive account, you agree to use the platform responsibly and in line with the terms below.",
    ),
    sections: [
      {
        heading: tx("Account responsibility"),
        body: tx(
          "You're responsible for keeping your account credentials secure and for the accuracy of the information you provide, including contact details used for booking confirmations.",
        ),
      },
      {
        heading: tx("Fair use"),
        body: tx(
          "The platform is for genuine booking and vehicle-listing activity. Automated scraping, fraudulent bookings, and misrepresenting a vehicle's condition or availability are not permitted.",
        ),
      },
    ],
  },
  "/legal/refund-policy": {
    title: tx("Refund Policy"),
    intro: tx("How refunds are handled for cancelled or disputed bookings."),
    sections: [
      {
        heading: tx("Cancelled before pickup"),
        body: tx(
          "Bookings cancelled more than 24 hours before the scheduled pickup are refunded in full to the original payment method within 5–7 business days.",
        ),
      },
      {
        heading: tx("Cancelled within 24 hours"),
        body: tx(
          "Late cancellations may be refunded partially, depending on the vehicle operator's individual policy shown at the time of booking.",
        ),
      },
      {
        heading: tx("Disputed trips"),
        body: tx(
          "If a trip didn't go as booked — wrong vehicle, no-show driver, or a significant discrepancy — contact support with your booking reference and we'll review it for a refund or credit.",
        ),
      },
    ],
  },
  "/help": {
    title: tx("Help & FAQ"),
    intro: tx(
      "Common questions about booking, payments, and managing a trip. For anything else, reach out to support from your account.",
    ),
    sections: [
      {
        heading: tx("How do I change my pickup time?"),
        body: tx(
          "Open the booking from My Bookings and use Edit Search before checkout, or contact your driver directly using the phone number on your confirmation once a trip is booked.",
        ),
      },
      {
        heading: tx("What payment methods are accepted?"),
        body: tx(
          "Net banking (Bank of Bhutan, Bhutan National Bank, Druk PNB Bank, T Bank) and debit/credit cards (Visa, Mastercard and more) are supported at checkout.",
        ),
      },
      {
        heading: tx("Can I pay partially now and the rest later?"),
        body: tx(
          "Yes — at Review Your Booking you can choose to pay half now and the remaining balance directly to the driver within 45 minutes of pickup.",
        ),
      },
    ],
  },
  "/affiliates": {
    title: tx("Affiliates"),
    intro: tx(
      "Partner with DrukDrive to offer vehicle bookings to your own audience, and earn a commission on completed trips.",
    ),
    sections: [
      {
        heading: tx("Who it's for"),
        body: tx(
          "Travel bloggers, tour operators, and hospitality partners who want to offer their audience a simple way to book verified transport across Bhutan.",
        ),
      },
      {
        heading: tx("How it works"),
        body: tx(
          "Affiliates get a referral link and a dashboard showing referred bookings and commission earned, paid out monthly.",
        ),
      },
    ],
  },
  "/advertise": {
    title: tx("Advertise with us"),
    intro: tx(
      "Reach travelers actively planning trips across Bhutan by featuring your vehicle fleet or travel service on DrukDrive.",
    ),
    sections: [
      {
        heading: tx("Featured listings"),
        body: tx(
          "Vehicle operators can boost visibility for specific listings during high-demand travel seasons.",
        ),
      },
      {
        heading: tx("Get in touch"),
        body: tx(
          "Advertising packages are arranged directly with the DrukDrive team — contact support to discuss options for your fleet or service.",
        ),
      },
    ],
  },
  "/rewards": {
    title: tx("Rewards"),
    intro: tx(
      "Earn credit toward future trips every time you book with DrukDrive.",
    ),
    sections: [
      {
        heading: tx("How you earn"),
        body: tx(
          "A small percentage of every completed booking is returned as ride credit, visible in your account's Finance tab.",
        ),
      },
      {
        heading: tx("How you redeem"),
        body: tx(
          "Ride credit is applied automatically at checkout when available, reducing the amount due at payment.",
        ),
      },
    ],
  },
  "/partners": {
    title: tx("Partners"),
    intro: tx(
      "DrukDrive works with local vehicle owners, tour operators, and hospitality businesses across Bhutan.",
    ),
    sections: [
      {
        heading: tx("Become a vehicle partner"),
        body: tx(
          "List your vehicle from the driver dashboard's My Vehicle tab — add your vehicle's details, set a daily price, and start receiving bookings.",
        ),
      },
      {
        heading: tx("Business partnerships"),
        body: tx(
          "Hotels, tour operators and travel agencies can integrate DrukDrive bookings into their own guest experience — contact support to discuss a partnership.",
        ),
      },
    ],
  },
  "/careers": {
    title: tx("Careers"),
    intro: tx(
      "DrukDrive is a small team building transport infrastructure for Bhutan's tourism and local travel needs.",
    ),
    sections: [
      {
        heading: tx("Open roles"),
        body: tx(
          "There are no open roles listed right now — check back soon, or reach out if you think you'd be a great fit for where we're headed.",
        ),
      },
    ],
  },
};

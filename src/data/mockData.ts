// Dummy data for the DrukDrive prototype. No backend — everything here is
// static fixture data used to make the flows feel real.

export type VehicleCategory =
  "Prime SUV" | "Sedan SUV" | "Mini Bus" | "Bus" | "Two Wheels";

// Rental-industry style class shown under a car's name ("or similar Compact"),
// so the listing reads as a class of vehicle rather than that exact car.
export const vehicleClassOf: Record<VehicleCategory, string> = {
  "Prime SUV": tx("Luxury SUV"),
  "Sedan SUV": tx("Compact"),
  "Mini Bus": tx("People Carrier"),
  Bus: tx("Coach"),
  "Two Wheels": tx("Motorbike"),
};

import { routes, type BookingType } from "../lib/routes";
import { tx } from "../lib/i18n";

/** Which vehicles make sense for a booking type: no self-driving a bus, no
 *  bike taxis on chauffeured trips. */
export function vehiclesForType(list: Vehicle[], type: BookingType): Vehicle[] {
  if (type === "self-drive")
    return list.filter(
      (v) => v.category !== "Bus" && v.category !== "Mini Bus",
    );
  return list.filter((v) => v.category !== "Two Wheels");
}

// The fixed labels in the unions below (category, fuel, gearbox, status)
// stay English in the data because code compares them; this list only
// registers them for translation. Screens show them with t(value).
export const unionLabels = [
  tx("Prime SUV"),
  tx("Sedan SUV"),
  tx("Mini Bus"),
  tx("Bus"),
  tx("Two Wheels"),
  tx("Petrol"),
  tx("Diesel"),
  tx("Electric"),
  tx("Automatic"),
  tx("Manual"),
  tx("Upcoming"),
  tx("Completed"),
  tx("Cancelled"),
  tx("Active"),
  tx("Under review"),
];

export type Vehicle = {
  id: string;
  name: string;
  brand: string;
  category: VehicleCategory;
  seats: number;
  fuel: "Petrol" | "Diesel" | "Electric";
  transmission: "Automatic" | "Manual";
  ac: boolean;
  location: string;
  type: string;
  pricePerDay: number;
  strikePrice?: number;
  rating: number;
  reviewCount: number;
};

export const vehicles: Vehicle[] = [
  {
    id: "toyota-prado-gx",
    name: "Toyota Prado GX",
    brand: "Toyota",
    category: "Prime SUV",
    seats: 5,
    fuel: "Petrol",
    transmission: "Automatic",
    ac: true,
    location: "Thimphu",
    type: tx("Tourist Standard Vehicle"),
    pricePerDay: 58,
    strikePrice: 68,
    rating: 4.8,
    reviewCount: 132,
  },
  {
    id: "toyota-coaster-bus",
    name: "Toyota Coaster Bus",
    brand: "Toyota",
    category: "Bus",
    seats: 21,
    fuel: "Diesel",
    transmission: "Manual",
    ac: true,
    location: "Thimphu",
    type: tx("Tourist Standard Vehicle"),
    pricePerDay: 56,
    rating: 4.6,
    reviewCount: 58,
  },
  {
    id: "toyota-hiace-bus",
    name: "Toyota Hiace Bus",
    brand: "Toyota",
    category: "Mini Bus",
    seats: 9,
    fuel: "Diesel",
    transmission: "Manual",
    ac: true,
    location: "Paro",
    type: tx("Tourist Standard Vehicle"),
    pricePerDay: 53,
    rating: 4.5,
    reviewCount: 41,
  },
  {
    id: "hyundai-santa-fe",
    name: "Hyundai Santa Fe",
    brand: "Hyundai",
    category: "Sedan SUV",
    seats: 5,
    fuel: "Petrol",
    transmission: "Automatic",
    ac: true,
    location: "Punakha",
    type: tx("Tourist Standard Vehicle"),
    pricePerDay: 54,
    strikePrice: 60,
    rating: 4.7,
    reviewCount: 96,
  },
  {
    id: "toyota-innova",
    name: "Toyota Innova Crysta",
    brand: "Toyota",
    category: "Prime SUV",
    seats: 7,
    fuel: "Diesel",
    transmission: "Automatic",
    ac: true,
    location: "Thimphu",
    type: tx("Tourist Standard Vehicle"),
    pricePerDay: 62,
    rating: 4.9,
    reviewCount: 210,
  },
  {
    id: "hyundai-creta",
    name: "Hyundai Creta",
    brand: "Hyundai",
    category: "Sedan SUV",
    seats: 5,
    fuel: "Petrol",
    transmission: "Automatic",
    ac: true,
    location: "Paro",
    type: tx("Tourist Standard Vehicle"),
    pricePerDay: 50,
    rating: 4.6,
    reviewCount: 74,
  },
  {
    id: "royal-enfield-meteor",
    name: "Royal Enfield Meteor 350",
    brand: "Royal Enfield",
    category: "Two Wheels",
    seats: 2,
    fuel: "Petrol",
    transmission: "Manual",
    ac: false,
    location: "Thimphu",
    type: tx("Self Drive Vehicle"),
    pricePerDay: 22,
    rating: 4.7,
    reviewCount: 39,
  },
  {
    id: "maruti-ertiga",
    name: "Maruti Ertiga",
    brand: "Maruti",
    category: "Sedan SUV",
    seats: 7,
    fuel: "Petrol",
    transmission: "Manual",
    ac: true,
    location: "Thimphu",
    type: tx("Tourist Standard Vehicle"),
    pricePerDay: 45,
    rating: 4.4,
    reviewCount: 53,
  },
  {
    id: "mahindra-scorpio",
    name: "Mahindra Scorpio",
    brand: "Mahindra",
    category: "Prime SUV",
    seats: 7,
    fuel: "Diesel",
    transmission: "Manual",
    ac: true,
    location: "Punakha",
    type: tx("Tourist Standard Vehicle"),
    pricePerDay: 60,
    strikePrice: 66,
    rating: 4.5,
    reviewCount: 47,
  },
  {
    id: "honda-city",
    name: "Honda City",
    brand: "Honda",
    category: "Sedan SUV",
    seats: 5,
    fuel: "Petrol",
    transmission: "Automatic",
    ac: true,
    location: "Paro",
    type: tx("Tourist Standard Vehicle"),
    pricePerDay: 48,
    rating: 4.6,
    reviewCount: 61,
  },
  {
    id: "tata-nexon",
    name: "Tata Nexon",
    brand: "Tata",
    category: "Sedan SUV",
    seats: 5,
    fuel: "Diesel",
    transmission: "Manual",
    ac: true,
    location: "Thimphu",
    type: tx("Tourist Standard Vehicle"),
    pricePerDay: 47,
    rating: 4.3,
    reviewCount: 29,
  },
];

export const recentSearches = [
  {
    id: "s1",
    title: "Toyota Prado GX",
    route: "Thimphu → Punakha",
    date: "2026-12-11",
    vehicleId: "toyota-prado-gx",
    pickup: "Thimphu, Druk School",
    dropoff: "Punakha, Khuruthang Taxi Parking",
  },
  {
    id: "s2",
    title: "Hyundai Santa Fe",
    route: "Thimphu → Paro",
    date: "2026-11-27",
    vehicleId: "hyundai-santa-fe",
    pickup: "Thimphu, Memorial Chorten",
    dropoff: "Paro, International Airport",
  },
  {
    id: "s3",
    title: "Toyota Hiace Bus",
    route: "Phuentsholing → Thimphu",
    date: "2026-10-12",
    vehicleId: "toyota-hiace-bus",
    pickup: "Phuentsholing, Terminal",
    dropoff: "Thimphu, Clock Tower Square",
  },
];

export const popularCarTypes: {
  category: VehicleCategory;
  label: string;
  vehicleId: string;
}[] = [
  {
    category: "Prime SUV",
    label: tx("Prime SUV"),
    vehicleId: "toyota-prado-gx",
  },
  {
    category: "Mini Bus",
    label: tx("Mini Bus"),
    vehicleId: "toyota-hiace-bus",
  },
  { category: "Bus", label: tx("Bus"), vehicleId: "toyota-coaster-bus" },
  {
    category: "Sedan SUV",
    label: tx("Sedan SUV"),
    vehicleId: "hyundai-santa-fe",
  },
];

export const faqs = [
  {
    q: tx("Which kinds of cars can I hire on DrukDrive?"),
    a: tx(
      "On DrukDrive you can find deals on all types of car hire, including small, medium, large, SUV, van, luxury, people movers and commercial vehicles.",
    ),
  },
  {
    q: tx("How do I find the best car hire deals?"),
    a: tx(
      "Compare prices across verified local operators and filter by vehicle type, seats and price to find the best deal for your trip.",
    ),
  },
  {
    q: tx("Is there a speed limit?"),
    a: tx(
      "Yes — speed limits in Bhutan are generally 50 km/h in towns and 30-80 km/h on highways depending on the road.",
    ),
  },
  {
    q: tx("Are there any restricted areas?"),
    a: tx(
      "Some regions require a permit. Your driver or the DrukDrive support team can help arrange the right permits.",
    ),
  },
  {
    q: tx("Can new drivers hire a car?"),
    a: tx(
      "Most self-drive rentals require a minimum of 1 year of driving experience and a valid international license.",
    ),
  },
  {
    q: tx("Can I return a hire car to a different location?"),
    a: tx(
      "Yes, one-way rentals are available for an additional drop-off fee depending on distance.",
    ),
  },
  {
    q: tx("Can I extend / cancel / modify?"),
    a: tx(
      "You can modify or cancel most bookings free of charge up to 24 hours before pickup from My Bookings.",
    ),
  },
  {
    q: tx("Booking criteria & documents?"),
    a: tx(
      "You'll need a valid ID, driving license (for self-drive) and the reference ID sent to your email after booking.",
    ),
  },
  {
    q: tx("What is the minimum age to hire a car?"),
    a: tx("The minimum age to hire a self-drive vehicle is 21 years old."),
  },
];

export type Booking = {
  id: string;
  /** date: local ISO date-time, e.g. "2026-09-24T10:00"; shown with formatDateTime(). */
  vehicleId: string;
  pickup: string;
  dropoff: string;
  date: string;
  status: "Upcoming" | "Completed" | "Cancelled";
  total: number;
  bookingType: string;
};

export const bookings: Booking[] = [
  {
    id: "GI1671177263",
    vehicleId: "toyota-prado-gx",
    pickup: "Thimphu, Druk School",
    dropoff: "Punakha, Taxi Parking",
    date: "2026-09-24T10:00",
    status: "Upcoming",
    total: 58,
    bookingType: tx("Daily Rides"),
  },
  {
    id: "GI1671177201",
    vehicleId: "hyundai-santa-fe",
    pickup: "Paro Airport",
    dropoff: "Thimphu, City Centre",
    date: "2026-09-19T13:00",
    status: "Completed",
    total: 54,
    bookingType: tx("Daily Rides"),
  },
  {
    id: "GI1671176980",
    vehicleId: "toyota-hiace-bus",
    pickup: "Thimphu, Clock Tower Square",
    dropoff: "Thimphu, Clock Tower Square",
    date: "2026-09-04T09:30",
    status: "Cancelled",
    total: 53,
    bookingType: tx("Rental"),
  },
];

export type Notification = {
  id: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
  /** Where tapping it goes. */
  href: string;
};

export const notifications: Notification[] = [
  {
    id: "n1",
    title: tx("Booking confirmed"),
    body: tx("Your ride with Toyota Prado GX is confirmed for 24 Sep."),
    time: tx("2h ago"),
    read: false,
    href: routes.confirmation("GI1671177263"),
  },
  {
    id: "n2",
    title: tx("Payment received"),
    body: tx("We received your payment of $58.00 for booking GI1671177263."),
    time: tx("2h ago"),
    read: false,
    href: routes.invoice("GI1671177263"),
  },
  {
    id: "n3",
    title: tx("Driver assigned"),
    body: tx("Karma Dorji has been assigned as your driver."),
    time: tx("1d ago"),
    read: true,
    href: routes.confirmation("GI1671177263"),
  },
  {
    id: "n4",
    title: tx("Trip completed"),
    body: tx(
      "How was your Hyundai Santa Fe from Paro Airport? Rate your trip.",
    ),
    time: tx("3d ago"),
    read: true,
    href: `${routes.accountReviews}?write=GI1671177201`,
  },
];

export type Review = {
  id: string;
  /** The completed booking this review is for; one review per booking. */
  bookingId: string;
  vehicleId: string;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
};

// Reviews riders left on this driver's vehicles, one per completed trip.
// The customer side starts with none: Karma has one finished trip still
// waiting for a review.
export const reviews: Review[] = [
  {
    id: "r1",
    bookingId: "HBTTB0982764",
    vehicleId: "toyota-hiace-bus",
    author: "Tenzin Namgay",
    avatar: "https://i.pravatar.cc/80?img=12",
    rating: 4,
    date: "2026-09-08",
    comment:
      "Great vehicle condition, arrived a little late but overall a good trip.",
  },
  {
    id: "r2",
    bookingId: "HBTTB7741203",
    vehicleId: "toyota-prado-gx",
    author: "Pema Yangzom",
    avatar: "https://i.pravatar.cc/80?img=32",
    rating: 5,
    date: "2026-08-24",
    comment:
      "Clean car and a careful driver on the Dochula road. Will book again.",
  },
  {
    id: "r3",
    bookingId: "HBTTB6619087",
    vehicleId: "toyota-prado-gx",
    author: "Sonam Wangmo",
    avatar: "https://i.pravatar.cc/80?img=47",
    rating: 5,
    date: "2026-08-09",
    comment:
      "Smooth pick-up at the airport and the driver was extremely professional.",
  },
];

export type DriverVehicle = {
  id: string;
  name: string;
  plate: string;
  category: VehicleCategory;
  seats: number;
  fuel: "Petrol" | "Diesel" | "Electric";
  pricePerDay: number;
  status: "Active" | "Under review";
};

export const driverVehicles: DriverVehicle[] = [
  {
    id: "toyota-prado-gx",
    name: "Toyota Prado GX",
    plate: "BP-1-A2345",
    category: "Prime SUV",
    seats: 5,
    fuel: "Petrol",
    pricePerDay: 58,
    status: "Active",
  },
  {
    id: "toyota-hiace-bus",
    name: "Toyota Hiace Bus",
    plate: "BP-3-C1102",
    category: "Mini Bus",
    seats: 9,
    fuel: "Diesel",
    pricePerDay: 53,
    status: "Under review",
  },
];

export const currentUser = {
  name: "Karma Dorji",
  email: "karmadorji@gmail.com",
  phone: "+975 17 123 456",
  referenceId: "GI1671177263",
  avatar: "https://i.pravatar.cc/160?img=68",
  location: "Zilukha, Thimphu",
  joinedYear: 2022,
  gender: tx("Male"),
  address: "Chang Gidaphu, Thimphu",
  bio: "I love exploring Bhutan's mountain roads.",
};

// Bookings other riders have made against this driver's vehicle(s) — shown
// on the driver dashboard, distinct from `bookings` (this same person's own
// rides as a rider, shown on the customer side).
export type DriverBooking = {
  id: string;
  riderName: string;
  vehicleId: string;
  pickup: string;
  dropoff: string;
  date: string;
  status: "Upcoming" | "Completed" | "Cancelled";
};

export const driverBookings: DriverBooking[] = [
  {
    id: "HBTTB5984458",
    riderName: "Sonam Wangmo",
    vehicleId: "toyota-prado-gx",
    pickup: "International Airport, Paro",
    dropoff: "Terminal, Phuentsholing",
    date: "2026-10-03T10:00",
    status: "Upcoming",
  },
  {
    id: "HBTTB9283434",
    riderName: "Karma Choden",
    vehicleId: "toyota-prado-gx",
    pickup: "Clock Tower, Thimphu",
    dropoff: "International Airport, Paro",
    date: "2026-09-19T11:00",
    status: "Cancelled",
  },
  {
    id: "HBTTB0982764",
    riderName: "Tenzin Namgay",
    vehicleId: "toyota-hiace-bus",
    pickup: "Terminal, Phuentsholing",
    dropoff: "Terminal, Phuentsholing",
    date: "2026-09-07T08:00",
    status: "Completed",
  },
  {
    id: "HBTTB7741203",
    riderName: "Pema Yangzom",
    vehicleId: "toyota-prado-gx",
    pickup: "Norzin Lam, Thimphu",
    dropoff: "Dochula Pass",
    date: "2026-08-23T09:00",
    status: "Completed",
  },
  {
    id: "HBTTB6619087",
    riderName: "Sonam Wangmo",
    vehicleId: "toyota-prado-gx",
    pickup: "International Airport, Paro",
    dropoff: "Clock Tower, Thimphu",
    date: "2026-08-08T14:00",
    status: "Completed",
  },
];

export type DriverNotification = {
  id: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
  /** Where tapping it goes. */
  href: string;
};

export const driverNotifications: DriverNotification[] = [
  {
    id: "dn1",
    title: tx("New booking"),
    body: tx(
      "Sonam Wangmo booked your Toyota Prado GX for Paro → Phuentsholing, Sat 3 Oct.",
    ),
    time: tx("2h ago"),
    read: false,
    href: routes.providerBookingDetail("HBTTB5984458"),
  },
  {
    id: "dn2",
    title: tx("Booking cancelled"),
    body: tx(
      "Karma Choden cancelled Sat 19 Sep, Thimphu → Paro. The cancellation fee is in your ledger.",
    ),
    time: tx("3d ago"),
    read: false,
    href: routes.providerBookingDetail("HBTTB9283434"),
  },
  {
    id: "dn3",
    title: tx("Vehicle under review"),
    body: tx(
      "Your Toyota Hiace Bus listing is being reviewed and will go live shortly.",
    ),
    time: tx("2d ago"),
    read: true,
    href: routes.providerVehicles,
  },
  {
    id: "dn4",
    title: tx("Trip completed"),
    body: tx(
      "Your trip with Tenzin Namgay is complete. The fare is credited to your ledger.",
    ),
    time: tx("15d ago"),
    read: true,
    href: routes.providerFinance,
  },
];

// Selectable vehicle templates shown when adding a new vehicle.
export const vehicleTemplates: {
  id: string;
  name: string;
  category: VehicleCategory;
}[] = [
  { id: "prado-v8", name: "Toyota Prado V8", category: "Prime SUV" },
  { id: "prado-gx", name: "Toyota Prado GX", category: "Prime SUV" },
  { id: "innova", name: "Toyota Innova Crysta", category: "Prime SUV" },
];

// Selectable locations for the pick-up/drop-off location picker.
export const bhutanLocations = [
  { name: "Near Druk School", city: "Thimphu" },
  { name: "Clock Tower Square", city: "Thimphu" },
  { name: "Memorial Chorten", city: "Thimphu" },
  { name: "Khuruthang Taxi Parking", city: "Punakha" },
  { name: "Drukgyel Town", city: "Paro" },
  { name: "International Airport", city: "Paro" },
  { name: "Terminal", city: "Phuentsholing" },
  { name: "Bumthang Town Centre", city: "Bumthang" },
];

// Dummy data for the DrukDrive prototype. No backend — everything here is
// static fixture data used to make the flows feel real.

export type VehicleCategory = "Prime SUV" | "Sedan SUV" | "Mini Bus" | "Bus" | "Two Wheels";

export type Vehicle = {
  id: string;
  name: string;
  category: VehicleCategory;
  seats: number;
  fuel: "Petrol" | "Diesel" | "Electric";
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
    category: "Prime SUV",
    seats: 5,
    fuel: "Petrol",
    location: "Thimphu",
    type: "Tourist Standard Vehicle",
    pricePerDay: 58,
    strikePrice: 68,
    rating: 4.8,
    reviewCount: 132,
  },
  {
    id: "toyota-coaster-bus",
    name: "Toyota Coaster Bus",
    category: "Bus",
    seats: 21,
    fuel: "Diesel",
    location: "Thimphu",
    type: "Tourist Standard Vehicle",
    pricePerDay: 56,
    rating: 4.6,
    reviewCount: 58,
  },
  {
    id: "toyota-hiace-bus",
    name: "Toyota Hiace Bus",
    category: "Mini Bus",
    seats: 9,
    fuel: "Diesel",
    location: "Paro",
    type: "Tourist Standard Vehicle",
    pricePerDay: 53,
    rating: 4.5,
    reviewCount: 41,
  },
  {
    id: "hyundai-santa-fe",
    name: "Hyundai Santa Fe",
    category: "Sedan SUV",
    seats: 5,
    fuel: "Petrol",
    location: "Punakha",
    type: "Tourist Standard Vehicle",
    pricePerDay: 54,
    strikePrice: 60,
    rating: 4.7,
    reviewCount: 96,
  },
  {
    id: "toyota-innova",
    name: "Toyota Innova Crysta",
    category: "Prime SUV",
    seats: 7,
    fuel: "Diesel",
    location: "Thimphu",
    type: "Tourist Standard Vehicle",
    pricePerDay: 62,
    rating: 4.9,
    reviewCount: 210,
  },
  {
    id: "hyundai-creta",
    name: "Hyundai Creta",
    category: "Sedan SUV",
    seats: 5,
    fuel: "Petrol",
    location: "Paro",
    type: "Tourist Standard Vehicle",
    pricePerDay: 50,
    rating: 4.6,
    reviewCount: 74,
  },
  {
    id: "royal-enfield-meteor",
    name: "Royal Enfield Meteor 350",
    category: "Two Wheels",
    seats: 2,
    fuel: "Petrol",
    location: "Thimphu",
    type: "Self Drive Vehicle",
    pricePerDay: 22,
    rating: 4.7,
    reviewCount: 39,
  },
];

export const recentSearches = [
  {
    id: "s1",
    title: "Toyota Prado GX",
    subtitle: "Thimphu → Punakha, 11 Dec",
    vehicleId: "toyota-prado-gx",
    pickup: "Thimphu, Druk School",
    dropoff: "Punakha, Khuruthang Taxi Parking",
  },
  {
    id: "s2",
    title: "Hyundai Santa Fe",
    subtitle: "Thimphu → Paro, 27 Nov",
    vehicleId: "hyundai-santa-fe",
    pickup: "Thimphu, Memorial Chorten",
    dropoff: "Paro, International Airport",
  },
  {
    id: "s3",
    title: "Toyota Hiace Bus",
    subtitle: "Phuentsholing → Thimphu, 12 Oct",
    vehicleId: "toyota-hiace-bus",
    pickup: "Phuentsholing, Terminal",
    dropoff: "Thimphu, Clock Tower Square",
  },
];

export const popularCarTypes: { category: VehicleCategory; label: string }[] = [
  { category: "Prime SUV", label: "Prime SUV" },
  { category: "Mini Bus", label: "Mini Bus" },
  { category: "Bus", label: "Bus" },
  { category: "Sedan SUV", label: "Sedan SUV" },
];

export const faqs = [
  {
    q: "Which kinds of cars can I hire on DrukDrive?",
    a: "On DrukDrive you can find deals on all types of car hire, including small, medium, large, SUV, van, luxury, people movers and commercial vehicles.",
  },
  { q: "How do I find the best car hire deals?", a: "Compare prices across verified local operators and filter by vehicle type, seats and price to find the best deal for your trip." },
  { q: "Is there a speed limit?", a: "Yes — speed limits in Bhutan are generally 50 km/h in towns and 30-80 km/h on highways depending on the road." },
  { q: "Are there any restricted areas?", a: "Some regions require a permit. Your driver or the DrukDrive support team can help arrange the right permits." },
  { q: "Can new drivers hire a car?", a: "Most self-drive rentals require a minimum of 1 year of driving experience and a valid international license." },
  { q: "Can I return a hire car to a different location?", a: "Yes, one-way rentals are available for an additional drop-off fee depending on distance." },
  { q: "Can I extend / cancel / modify?", a: "You can modify or cancel most bookings free of charge up to 24 hours before pickup from My Bookings." },
  { q: "Booking criteria & documents?", a: "You'll need a valid ID, driving license (for self-drive) and the reference ID sent to your email after booking." },
  { q: "What is the minimum age to hire a car?", a: "The minimum age to hire a self-drive vehicle is 21 years old." },
];

export type Booking = {
  id: string;
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
    date: "Thu 24 Sep, 10:00",
    status: "Upcoming",
    total: 58,
    bookingType: "Daily Rides",
  },
  {
    id: "GI1671177201",
    vehicleId: "hyundai-santa-fe",
    pickup: "Paro Airport",
    dropoff: "Thimphu, City Centre",
    date: "12 Oct, 13:00",
    status: "Completed",
    total: 54,
    bookingType: "Outstation",
  },
  {
    id: "GI1671176980",
    vehicleId: "toyota-hiace-bus",
    pickup: "Thimphu, Clock Tower Square",
    dropoff: "Thimphu, Clock Tower Square",
    date: "27 Nov, 09:34",
    status: "Cancelled",
    total: 53,
    bookingType: "Rental",
  },
];

export type Notification = {
  id: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
};

export const notifications: Notification[] = [
  { id: "n1", title: "Booking confirmed", body: "Your ride with Toyota Prado GX is confirmed for 24 Sep.", time: "2h ago", read: false },
  { id: "n2", title: "Payment received", body: "We received your payment of $58.00 for booking GI1671177263.", time: "2h ago", read: false },
  { id: "n3", title: "Driver assigned", body: "Karma Dorji has been assigned as your driver.", time: "1d ago", read: true },
  { id: "n4", title: "Trip completed", body: "Hope you enjoyed your trip! Rate your experience.", time: "3d ago", read: true },
];

export type Review = {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
};

export const reviews: Review[] = [
  {
    id: "r1",
    author: "Sonam Wangmo",
    avatar: "https://i.pravatar.cc/80?img=47",
    rating: 5,
    date: "2 Oct 2024",
    comment: "Smooth booking experience and the driver was extremely professional. Highly recommend!",
  },
  {
    id: "r2",
    author: "Tenzin Namgay",
    avatar: "https://i.pravatar.cc/80?img=12",
    rating: 4,
    date: "18 Sep 2024",
    comment: "Great vehicle condition, arrived a little late but overall a good trip.",
  },
  {
    id: "r3",
    author: "Karma Choden",
    avatar: "https://i.pravatar.cc/80?img=32",
    rating: 5,
    date: "3 Sep 2024",
    comment: "Best car rental service in Thimphu. Will book again for our next trip.",
  },
];

export const financeSummary = {
  totalEarnings: 3240,
  pending: 420,
  withdrawn: 2820,
  transactions: [
    { id: "t1", label: "Booking GI1671177263", date: "24 Sep 2024", amount: 58, status: "Credited" },
    { id: "t2", label: "Booking GI1671177201", date: "12 Oct 2024", amount: 54, status: "Credited" },
    { id: "t3", label: "Withdrawal to bank", date: "1 Oct 2024", amount: -500, status: "Processed" },
    { id: "t4", label: "Booking GI1671176980", date: "27 Nov 2024", amount: 53, status: "Pending" },
  ],
};

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
  gender: "Male",
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
  status: "Upcoming" | "Confirmed" | "Cancelled";
};

export const driverBookings: DriverBooking[] = [
  {
    id: "HBTTB5984458",
    riderName: "Sonam Wangmo",
    vehicleId: "toyota-prado-gx",
    pickup: "International Airport, Paro",
    dropoff: "Terminal, Phuentsholing",
    date: "Sat 12 Dec' 22, 10:00",
    status: "Upcoming",
  },
  {
    id: "HBTTB0982764",
    riderName: "Tenzin Namgay",
    vehicleId: "toyota-hiace-bus",
    pickup: "Terminal, Phuentsholing",
    dropoff: "Terminal, Phuentsholing",
    date: "Mon 08 Dec' 22, 08:00",
    status: "Confirmed",
  },
  {
    id: "HBTTB9283434",
    riderName: "Karma Choden",
    vehicleId: "toyota-prado-gx",
    pickup: "Clock Tower, Thimphu",
    dropoff: "International Airport, Paro",
    date: "Wed 19 Dec' 22, 11:00",
    status: "Cancelled",
  },
];

export type DriverNotification = { id: string; title: string; body: string; time: string; read: boolean };

export const driverNotifications: DriverNotification[] = [
  {
    id: "dn1",
    title: "New booking request",
    body: "Sonam Wangmo booked your Toyota Prado GX for Paro → Phuentsholing, Sat 12 Dec.",
    time: "2h ago",
    read: false,
  },
  {
    id: "dn2",
    title: "Booking on hold",
    body: "Trip from Paro to Thimphu, Wed 24 Jan to Sun 28 Jan, is awaiting rider confirmation.",
    time: "1d ago",
    read: false,
  },
  {
    id: "dn3",
    title: "Vehicle under review",
    body: "Your Toyota Hiace Bus listing is being reviewed and will go live shortly.",
    time: "2d ago",
    read: true,
  },
  {
    id: "dn4",
    title: "Trip completed",
    body: "Your trip with Tenzin Namgay is complete. Payment has been credited to your ledger.",
    time: "4d ago",
    read: true,
  },
];

// Selectable vehicle templates shown when adding a new vehicle.
export const vehicleTemplates: { id: string; name: string; category: VehicleCategory }[] = [
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

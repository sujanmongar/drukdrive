// Dummy data for the DrukDrive prototype. No backend — everything here is
// static fixture data used to make the flows feel real.

export type Vehicle = {
  id: string;
  name: string;
  category: "Prime SUV" | "Sedan SUV" | "Mini Bus" | "Bus" | "Two Wheels";
  seats: number;
  fuel: "Petrol" | "Diesel" | "Electric";
  location: string;
  type: string;
  pricePerDay: number;
  strikePrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
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
    image:
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=800&auto=format&fit=crop",
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
    image:
      "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=800&auto=format&fit=crop",
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
    image:
      "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?q=80&w=800&auto=format&fit=crop",
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
    image:
      "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "toyota-fortuner",
    name: "Toyota Fortuner",
    category: "Prime SUV",
    seats: 7,
    fuel: "Diesel",
    location: "Thimphu",
    type: "Tourist Standard Vehicle",
    pricePerDay: 62,
    rating: 4.9,
    reviewCount: 210,
    image:
      "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?q=80&w=800&auto=format&fit=crop",
  },
];

export const recentSearches = [
  {
    id: "s1",
    title: "Punakha, Khuruthang",
    subtitle: "11 Dec, 12:00 - 12 Dec, 12:00",
    image:
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=200&auto=format&fit=crop",
  },
  {
    id: "s2",
    title: "Thimphu, Memorial Chorten",
    subtitle: "27 Nov, 09:34 - 28 Nov, 13:00",
    image:
      "https://images.unsplash.com/photo-1602928321679-560bb453f190?q=80&w=200&auto=format&fit=crop",
  },
  {
    id: "s3",
    title: "Phuentsholing, Terminal",
    subtitle: "12 Oct, 10:00 - 13 Oct, 13:00",
    image:
      "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=200&auto=format&fit=crop",
  },
];

export const popularCarTypes = [
  {
    name: "Prime SUV",
    image:
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=400&auto=format&fit=crop",
  },
  {
    name: "Mini Bus",
    image:
      "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?q=80&w=400&auto=format&fit=crop",
  },
  {
    name: "Coaster Bus",
    image:
      "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=400&auto=format&fit=crop",
  },
  {
    name: "Sedan SUV",
    image:
      "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=400&auto=format&fit=crop",
  },
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
  vehicle: string;
  image: string;
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
    vehicle: "Toyota Prado GX",
    image:
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=400&auto=format&fit=crop",
    pickup: "Thimphu, Druk School",
    dropoff: "Punakha, Taxi Parking",
    date: "Thu 24 Sep, 10:00",
    status: "Upcoming",
    total: 58,
    bookingType: "Daily Rides",
  },
  {
    id: "GI1671177201",
    vehicle: "Hyundai Santa Fe",
    image:
      "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=400&auto=format&fit=crop",
    pickup: "Paro Airport",
    dropoff: "Thimphu, City Centre",
    date: "12 Oct, 13:00",
    status: "Completed",
    total: 54,
    bookingType: "Outstation",
  },
  {
    id: "GI1671176980",
    vehicle: "Toyota Hiace Bus",
    image:
      "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?q=80&w=400&auto=format&fit=crop",
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

export const driverVehicles = [
  {
    id: "v1",
    name: "Toyota Prado GX",
    plate: "BP-1-A2345",
    category: "Prime SUV",
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: "v2",
    name: "Toyota Hiace Bus",
    plate: "BP-3-C1102",
    category: "Mini Bus",
    status: "Under review",
    image:
      "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?q=80&w=400&auto=format&fit=crop",
  },
];

export const currentUser = {
  name: "Karma Dorji",
  email: "karmadorji@gmail.com",
  phone: "+975 17 123 456",
  referenceId: "GI1671177263",
  avatar: "https://i.pravatar.cc/160?img=68",
};

// Central route path constants. Import these instead of hard-coding strings
// so every page links to the same paths.

export const routes = {
  // auth
  signIn: "/sign-in",
  signUp: "/sign-up",
  otp: "/sign-in/otp",
  forgotPassword: "/sign-in/forgot-password",
  resetPassword: "/sign-in/reset-password",

  // customer booking flow
  home: "/",
  search: "/search",
  bookingReview: "/checkout/review",
  reviewBooking: "/checkout/details",
  payment: "/checkout/payment",
  confirmation: (id: string = ":id") => `/booking/${id}/confirmation`,
  invoice: (id: string = ":id") => `/booking/${id}/invoice`,

  // customer account
  accountBookings: "/account/bookings",
  accountWishlist: "/account/wishlist",
  accountNotifications: "/account/notifications",
  accountReviews: "/account/reviews",
  accountFinance: "/account/finance",
  accountProfile: "/account/profile",
  accountProfileEdit: "/account/profile/edit",
  accountPreferences: "/account/preferences",

  // service provider (driver) dashboard
  providerProfile: "/provider/profile",
  providerBookings: "/provider/bookings",
  providerBookingDetail: (id: string = ":id") => `/provider/bookings/${id}`,
  providerNotifications: "/provider/notifications",
  providerReviews: "/provider/reviews",
  providerVehicles: "/provider/vehicles",
  providerVehicleAdd: "/provider/vehicles/add",
  providerFinance: "/provider/finance",
  providerAccount: "/provider/account",
  providerAccountEdit: "/provider/account/edit",
  providerPreferences: "/provider/preferences",

  // static / informational
  about: "/about",
  blog: "/blog",
  privacyPolicy: "/legal/privacy",
  termsOfService: "/legal/terms",
  userAgreement: "/legal/user-agreement",
  refundPolicy: "/legal/refund-policy",
  help: "/help",
  affiliates: "/affiliates",
  advertise: "/advertise",
  rewards: "/rewards",
  partners: "/partners",
  careers: "/careers",
} as const;

export type BookingType = "daily" | "rental" | "self-drive";

export const bookingTypeLabels: Record<BookingType, string> = {
  daily: "Daily Rides",
  rental: "Rental",
  "self-drive": "Self Drive",
};

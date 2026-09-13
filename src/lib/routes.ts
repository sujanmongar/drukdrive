// Central route path constants. Import these instead of hard-coding strings
// so every page links to the same paths.

export const routes = {
  // auth
  signIn: "/sign-in",
  signUp: "/sign-up",
  otp: "/sign-in/otp",
  forgotPassword: "/sign-in/forgot-password",
  resetPassword: "/sign-in/reset-password",
  roleSelect: "/sign-up/role",

  // customer booking flow
  home: "/",
  search: "/search",
  vehicle: (id: string = ":id") => `/vehicle/${id}`,
  reviewBooking: "/checkout/details",
  payment: "/checkout/payment",
  paymentVerify: "/checkout/verify",
  paymentSuccess: "/checkout/success",
  confirmation: (id: string = ":id") => `/booking/${id}/confirmation`,
  invoice: (id: string = ":id") => `/booking/${id}/invoice`,

  // customer account
  accountBookings: "/account/bookings",
  accountNotifications: "/account/notifications",
  accountReviews: "/account/reviews",
  accountFinance: "/account/finance",
  accountProfile: "/account/profile",
  accountProfileEdit: "/account/profile/edit",

  // service provider (driver) dashboard
  providerProfile: "/provider/profile",
  providerBookings: "/provider/bookings",
  providerNotifications: "/provider/notifications",
  providerReviews: "/provider/reviews",
  providerVehicles: "/provider/vehicles",
  providerVehicleAdd: "/provider/vehicles/add",
  providerFinance: "/provider/finance",
  providerAccount: "/provider/account",
  providerAccountEdit: "/provider/account/edit",
} as const;

export type BookingType = "daily" | "outstation" | "rental" | "self-drive";

export const bookingTypeLabels: Record<BookingType, string> = {
  daily: "Daily Rides",
  outstation: "Outstation",
  rental: "Rental",
  "self-drive": "Self Drive",
};

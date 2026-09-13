import { routes } from "../../lib/routes";
import type { SecondaryTab } from "../../components/SecondaryTabs";

// Shared sub-nav for every service-provider (driver) dashboard page.
export const providerTabs: SecondaryTab[] = [
  { to: routes.providerProfile, label: "Profile", icon: "user" },
  { to: routes.providerBookings, label: "Bookings", icon: "car" },
  { to: routes.providerNotifications, label: "Notifications", icon: "bell" },
  { to: routes.providerReviews, label: "Reviews", icon: "star" },
  { to: routes.providerVehicles, label: "My Vehicles", icon: "plus" },
  { to: routes.providerFinance, label: "Finance", icon: "wallet" },
  { to: routes.providerAccount, label: "Account", icon: "lock" },
  { to: routes.providerAccountEdit, label: "Edit Account", icon: "edit" },
];

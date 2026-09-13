import { routes } from "../../../lib/routes";
import type { SecondaryTab } from "../../../components/SecondaryTabs";

// Shared sub-nav for every customer account screen — keeps the section
// feeling like one cohesive area. Imported by each page in this folder.
export const accountTabs: SecondaryTab[] = [
  { to: routes.accountBookings, label: "Bookings", icon: "car" },
  { to: routes.accountNotifications, label: "Notifications", icon: "bell" },
  { to: routes.accountReviews, label: "Reviews", icon: "star" },
  { to: routes.accountFinance, label: "Finance", icon: "wallet" },
  { to: routes.accountProfile, label: "Account", icon: "user" },
  { to: routes.accountProfileEdit, label: "Edit Profile", icon: "edit" },
];

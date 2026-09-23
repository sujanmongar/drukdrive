import { routes } from "../../../lib/routes";
import type { SecondaryTab } from "../../../components/SecondaryTabs";
import { tx } from "../../../lib/i18n";

// Shared sub-nav for every customer account screen — keeps the section
// feeling like one cohesive area. Imported by each page in this folder.
export const accountTabs: SecondaryTab[] = [
  { to: routes.accountBookings, label: tx("Bookings"), icon: "car" },
  { to: routes.accountWishlist, label: tx("Wishlist"), icon: "heart" },
  { to: routes.accountReviews, label: tx("Reviews"), icon: "star" },
  { to: routes.accountFinance, label: tx("Finance"), icon: "wallet" },
  { to: routes.accountProfile, label: tx("Account"), icon: "user" },
];

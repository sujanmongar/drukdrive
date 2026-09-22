import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { routes } from "./lib/routes";
import RouteGuard from "./components/RouteGuard";

const SignIn = lazy(() => import("./pages/auth/SignIn"));
const SignUp = lazy(() => import("./pages/auth/SignUp"));
const Otp = lazy(() => import("./pages/auth/Otp"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/auth/ResetPassword"));

const Home = lazy(() => import("./pages/customer/Home"));
const SearchResults = lazy(() => import("./pages/customer/SearchResults"));
const BookingReview = lazy(() => import("./pages/customer/BookingReview"));
const ReviewBooking = lazy(() => import("./pages/customer/ReviewBooking"));
const Payment = lazy(() => import("./pages/customer/Payment"));
const Confirmation = lazy(() => import("./pages/customer/Confirmation"));
const Invoice = lazy(() => import("./pages/customer/Invoice"));

const AccountBookings = lazy(() => import("./pages/customer/profile/Bookings"));
const AccountWishlist = lazy(() => import("./pages/customer/profile/Wishlist"));
const AccountNotifications = lazy(
  () => import("./pages/customer/profile/Notifications"),
);
const AccountReviews = lazy(() => import("./pages/customer/profile/Reviews"));
const AccountFinance = lazy(() => import("./pages/customer/profile/Finance"));
const AccountProfile = lazy(() => import("./pages/customer/profile/Account"));
const AccountProfileEdit = lazy(
  () => import("./pages/customer/profile/AccountEdit"),
);
const AccountPreferences = lazy(
  () => import("./pages/customer/profile/Preferences"),
);

const ProviderProfile = lazy(() => import("./pages/provider/Profile"));
const ProviderBookings = lazy(() => import("./pages/provider/Bookings"));
const ProviderBookingDetail = lazy(
  () => import("./pages/provider/BookingDetail"),
);
const ProviderNotifications = lazy(
  () => import("./pages/provider/Notifications"),
);
const ProviderReviews = lazy(() => import("./pages/provider/Reviews"));
const ProviderVehicles = lazy(() => import("./pages/provider/Vehicles"));
const ProviderVehicleAdd = lazy(() => import("./pages/provider/VehicleAdd"));
const ProviderFinance = lazy(() => import("./pages/provider/Finance"));
const ProviderAccount = lazy(() => import("./pages/provider/Account"));
const ProviderAccountEdit = lazy(() => import("./pages/provider/AccountEdit"));
const ProviderPreferences = lazy(() => import("./pages/provider/Preferences"));

const NotFound = lazy(() => import("./pages/NotFound"));
const StaticPage = lazy(() => import("./pages/StaticPage"));

function PageFallback() {
  return (
    <div className="flex min-h-[60svh] items-center justify-center">
      <div
        className="size-8 animate-spin rounded-full border-4 border-[color:var(--color-border)] border-t-[color:var(--color-ink)]"
        role="status"
        aria-label="Loading"
      />
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        {/* Auth */}
        <Route path={routes.signIn} element={<SignIn />} />
        <Route path={routes.signUp} element={<SignUp />} />
        <Route path={routes.otp} element={<Otp />} />
        <Route path={routes.forgotPassword} element={<ForgotPassword />} />
        <Route path={routes.resetPassword} element={<ResetPassword />} />

        {/* Customer booking flow */}
        <Route path={routes.home} element={<Home />} />
        <Route path={routes.search} element={<SearchResults />} />
        <Route path={routes.bookingReview} element={<BookingReview />} />
        <Route path={routes.reviewBooking} element={<ReviewBooking />} />
        <Route path={routes.payment} element={<Payment />} />
        <Route path={routes.confirmation()} element={<Confirmation />} />
        <Route path={routes.invoice()} element={<Invoice />} />

        {/* Customer account — requires being signed in as a customer */}
        <Route
          path={routes.accountBookings}
          element={
            <RouteGuard role="customer">
              <AccountBookings />
            </RouteGuard>
          }
        />
        <Route
          path={routes.accountWishlist}
          element={
            <RouteGuard role="customer" allowGuest>
              <AccountWishlist />
            </RouteGuard>
          }
        />
        <Route
          path={routes.accountNotifications}
          element={
            <RouteGuard role="customer">
              <AccountNotifications />
            </RouteGuard>
          }
        />
        <Route
          path={routes.accountReviews}
          element={
            <RouteGuard role="customer">
              <AccountReviews />
            </RouteGuard>
          }
        />
        <Route
          path={routes.accountFinance}
          element={
            <RouteGuard role="customer">
              <AccountFinance />
            </RouteGuard>
          }
        />
        <Route
          path={routes.accountProfile}
          element={
            <RouteGuard role="customer">
              <AccountProfile />
            </RouteGuard>
          }
        />
        <Route
          path={routes.accountProfileEdit}
          element={
            <RouteGuard role="customer">
              <AccountProfileEdit />
            </RouteGuard>
          }
        />
        <Route
          path={routes.accountPreferences}
          element={
            <RouteGuard role="customer">
              <AccountPreferences />
            </RouteGuard>
          }
        />

        {/* Service provider (driver) dashboard — requires being signed in as a driver */}
        <Route
          path={routes.providerProfile}
          element={
            <RouteGuard role="driver">
              <ProviderProfile />
            </RouteGuard>
          }
        />
        <Route
          path={routes.providerBookings}
          element={
            <RouteGuard role="driver">
              <ProviderBookings />
            </RouteGuard>
          }
        />
        <Route
          path={routes.providerBookingDetail()}
          element={
            <RouteGuard role="driver">
              <ProviderBookingDetail />
            </RouteGuard>
          }
        />
        <Route
          path={routes.providerNotifications}
          element={
            <RouteGuard role="driver">
              <ProviderNotifications />
            </RouteGuard>
          }
        />
        <Route
          path={routes.providerReviews}
          element={
            <RouteGuard role="driver">
              <ProviderReviews />
            </RouteGuard>
          }
        />
        <Route
          path={routes.providerVehicles}
          element={
            <RouteGuard role="driver">
              <ProviderVehicles />
            </RouteGuard>
          }
        />
        <Route
          path={routes.providerVehicleAdd}
          element={
            <RouteGuard role="driver">
              <ProviderVehicleAdd />
            </RouteGuard>
          }
        />
        <Route
          path={routes.providerFinance}
          element={
            <RouteGuard role="driver">
              <ProviderFinance />
            </RouteGuard>
          }
        />
        <Route
          path={routes.providerAccount}
          element={
            <RouteGuard role="driver">
              <ProviderAccount />
            </RouteGuard>
          }
        />
        <Route
          path={routes.providerAccountEdit}
          element={
            <RouteGuard role="driver">
              <ProviderAccountEdit />
            </RouteGuard>
          }
        />
        <Route
          path={routes.providerPreferences}
          element={
            <RouteGuard role="driver">
              <ProviderPreferences />
            </RouteGuard>
          }
        />

        {/* Static / informational */}
        <Route path={routes.about} element={<StaticPage />} />
        <Route path={routes.blog} element={<StaticPage />} />
        <Route path={routes.privacyPolicy} element={<StaticPage />} />
        <Route path={routes.termsOfService} element={<StaticPage />} />
        <Route path={routes.userAgreement} element={<StaticPage />} />
        <Route path={routes.refundPolicy} element={<StaticPage />} />
        <Route path={routes.help} element={<StaticPage />} />
        <Route path={routes.affiliates} element={<StaticPage />} />
        <Route path={routes.advertise} element={<StaticPage />} />
        <Route path={routes.rewards} element={<StaticPage />} />
        <Route path={routes.partners} element={<StaticPage />} />
        <Route path={routes.careers} element={<StaticPage />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

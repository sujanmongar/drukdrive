import { Routes, Route } from "react-router-dom";
import { routes } from "./lib/routes";

import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import Otp from "./pages/auth/Otp";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import RoleSelect from "./pages/auth/RoleSelect";

import Home from "./pages/customer/Home";
import SearchResults from "./pages/customer/SearchResults";
import VehicleDetails from "./pages/customer/VehicleDetails";
import Payment from "./pages/customer/Payment";
import PaymentVerify from "./pages/customer/PaymentVerify";
import PaymentSuccess from "./pages/customer/PaymentSuccess";
import Confirmation from "./pages/customer/Confirmation";
import Invoice from "./pages/customer/Invoice";

import AccountBookings from "./pages/customer/profile/Bookings";
import AccountNotifications from "./pages/customer/profile/Notifications";
import AccountReviews from "./pages/customer/profile/Reviews";
import AccountFinance from "./pages/customer/profile/Finance";
import AccountProfile from "./pages/customer/profile/Account";
import AccountProfileEdit from "./pages/customer/profile/AccountEdit";

import ProviderProfile from "./pages/provider/Profile";
import ProviderBookings from "./pages/provider/Bookings";
import ProviderNotifications from "./pages/provider/Notifications";
import ProviderReviews from "./pages/provider/Reviews";
import ProviderVehicles from "./pages/provider/Vehicles";
import ProviderVehicleAdd from "./pages/provider/VehicleAdd";
import ProviderFinance from "./pages/provider/Finance";
import ProviderAccount from "./pages/provider/Account";
import ProviderAccountEdit from "./pages/provider/AccountEdit";

import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      {/* Auth */}
      <Route path={routes.signIn} element={<SignIn />} />
      <Route path={routes.signUp} element={<SignUp />} />
      <Route path={routes.otp} element={<Otp />} />
      <Route path={routes.forgotPassword} element={<ForgotPassword />} />
      <Route path={routes.resetPassword} element={<ResetPassword />} />
      <Route path={routes.roleSelect} element={<RoleSelect />} />

      {/* Customer booking flow */}
      <Route path={routes.home} element={<Home />} />
      <Route path={routes.search} element={<SearchResults />} />
      <Route path={routes.vehicle()} element={<VehicleDetails />} />
      <Route path={routes.payment} element={<Payment />} />
      <Route path={routes.paymentVerify} element={<PaymentVerify />} />
      <Route path={routes.paymentSuccess} element={<PaymentSuccess />} />
      <Route path={routes.confirmation()} element={<Confirmation />} />
      <Route path={routes.invoice()} element={<Invoice />} />

      {/* Customer account */}
      <Route path={routes.accountBookings} element={<AccountBookings />} />
      <Route path={routes.accountNotifications} element={<AccountNotifications />} />
      <Route path={routes.accountReviews} element={<AccountReviews />} />
      <Route path={routes.accountFinance} element={<AccountFinance />} />
      <Route path={routes.accountProfile} element={<AccountProfile />} />
      <Route path={routes.accountProfileEdit} element={<AccountProfileEdit />} />

      {/* Service provider (driver) dashboard */}
      <Route path={routes.providerProfile} element={<ProviderProfile />} />
      <Route path={routes.providerBookings} element={<ProviderBookings />} />
      <Route path={routes.providerNotifications} element={<ProviderNotifications />} />
      <Route path={routes.providerReviews} element={<ProviderReviews />} />
      <Route path={routes.providerVehicles} element={<ProviderVehicles />} />
      <Route path={routes.providerVehicleAdd} element={<ProviderVehicleAdd />} />
      <Route path={routes.providerFinance} element={<ProviderFinance />} />
      <Route path={routes.providerAccount} element={<ProviderAccount />} />
      <Route path={routes.providerAccountEdit} element={<ProviderAccountEdit />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

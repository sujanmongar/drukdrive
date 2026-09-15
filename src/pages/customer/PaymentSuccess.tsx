import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import PageShell from "../../components/PageShell";
import Button from "../../components/Button";
import Icon from "../../components/Icon";
import BookingStepper from "../../components/BookingStepper";
import { routes } from "../../lib/routes";
import { vehicles } from "../../data/mockData";
import { useCurrentUser } from "../../lib/currentUser";
import { computeFare, isAddOnId } from "../../lib/pricing";
import { formatDropoff, formatPickup, parseBooking } from "../../lib/booking";
import { bookingTypeLabels } from "../../lib/routes";
import { useCurrency } from "../../lib/currency";
import { usePageTitle } from "../../hooks/usePageTitle";

function todayFormatted() {
  return new Date()
    .toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    .replace(/ /g, "-");
}

// A fresh, realistic-looking booking id for this just-completed purchase —
// generated once per successful payment (this is a static prototype with no
// backend to issue a real one) and carried into Confirmation/Invoice so
// every screen after checkout is describing the same booking.
function generateBookingId() {
  return `GI${Date.now()}`;
}

export default function PaymentSuccess() {
  usePageTitle("Booking successful");
  const [searchParams] = useSearchParams();
  const { format } = useCurrency();
  const { user: currentUser } = useCurrentUser();
  const booking = parseBooking(searchParams, isAddOnId);
  const vehicle =
    vehicles.find((v) => v.id === booking.vehicleId) ?? vehicles[0];
  const { pickup, dropoff } = booking;
  const date = formatPickup(booking);
  const fare = computeFare(booking, vehicle.pricePerDay, format);

  const grandTotalParam =
    searchParams.get("grandTotal") || searchParams.get("total");
  const grandTotal = grandTotalParam ? Number(grandTotalParam) : fare.total;
  const amountDueParam = searchParams.get("amountDue");
  const amountDue = amountDueParam ? Number(amountDueParam) : grandTotal;
  const paymentOption = searchParams.get("paymentOption") || "full";
  const method = searchParams.get("method") || "Credit Card";
  const travelerName = searchParams.get("travelerName") || currentUser.name;
  const travelerEmail = searchParams.get("travelerEmail") || currentUser.email;
  const travelerPhone = searchParams.get("travelerPhone") || currentUser.phone;

  const [bookingId] = useState(generateBookingId);

  // Everything about the booking travels on to the confirmation and
  // invoice, so they can show the same type, dates, add-ons and split.
  const followOnParams = new URLSearchParams(searchParams);
  followOnParams.set("vehicleId", vehicle.id);
  followOnParams.set("total", grandTotal.toFixed(2));
  followOnParams.set("amountDue", amountDue.toFixed(2));
  followOnParams.set("travelerName", travelerName);
  followOnParams.set("travelerEmail", travelerEmail);
  followOnParams.set("travelerPhone", travelerPhone);
  followOnParams.set("method", method);
  const invoiceUrl = `${routes.invoice(bookingId)}?${followOnParams.toString()}`;
  const confirmationUrl = `${routes.confirmation(bookingId)}?${followOnParams.toString()}`;

  const receiptRows = [
    { label: "Transactions ID", value: `HBTTB${bookingId.slice(-7)}` },
    { label: "Date", value: todayFormatted() },
    {
      label: "Booking",
      value: `${bookingTypeLabels[booking.type]} · ${fare.unit}`,
    },
    { label: "Mode of Payment", value: method },
    { label: "Transaction Status", value: "Success", accent: true },
    { label: "Customer Name", value: travelerName },
    { label: "Mobile No", value: travelerPhone },
    { label: "Email Address", value: travelerEmail },
    { label: "Payment Amount", value: format(amountDue) },
    ...(paymentOption === "half"
      ? [
          {
            label: "Balance due at pick-up",
            value: format(grandTotal - amountDue),
          },
        ]
      : []),
    ...(fare.deposit > 0
      ? [
          {
            label: "Deposit at collection (refundable)",
            value: format(fare.deposit),
          },
        ]
      : []),
  ];

  const emailHref = `mailto:${travelerEmail}?subject=${encodeURIComponent(
    `DrukDrive receipt — ${bookingId}`,
  )}&body=${encodeURIComponent(
    `Booking ${bookingId}\n${bookingTypeLabels[booking.type]}\nVehicle: ${vehicle.name}\nPickup: ${pickup}, ${date}\nDrop-off: ${dropoff}, ${formatDropoff(booking)}\nAmount paid: ${format(amountDue)}`,
  )}`;

  const actions = [
    {
      icon: "download" as const,
      label: "Save as PDF",
      onClick: () => window.print(),
    },
    {
      icon: "download" as const,
      label: "Print Receipt",
      onClick: () => window.print(),
    },
    { icon: "mail" as const, label: "Email Receipt", href: emailHref },
  ];

  return (
    <PageShell noFooter>
      <div className="mx-auto max-w-[560px] px-4 py-8 md:px-10 md:py-10">
        <BookingStepper current={3} allDone />

        <div className="mt-8 flex flex-col items-center text-center">
          <Icon
            name="check-circle"
            size={64}
            className="text-[color:var(--color-success)]"
          />
          <h1 className="t-h1 mt-4 text-[color:var(--color-success)]">
            Booking Successful
          </h1>
          <p className="mt-2 max-w-sm text-sm text-[color:var(--color-ink-soft)]">
            We are processing the same and you will be notified via email.
          </p>
        </div>

        <div className="mt-8 overflow-hidden rounded-xl border border-[color:var(--color-border)]">
          {receiptRows.map((row, i) => (
            <div
              key={row.label}
              className={`flex items-center justify-between px-5 py-3.5 text-sm ${
                i !== 0 ? "border-t border-[color:var(--color-border)]" : ""
              }`}
            >
              <span className="text-[color:var(--color-muted)]">
                {row.label}
              </span>
              <span
                className={`font-bold ${row.accent ? "text-[color:var(--color-success)]" : "text-[color:var(--color-ink)]"}`}
              >
                {row.value}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-1">
          {actions.map((a) =>
            a.href ? (
              <a
                key={a.label}
                href={a.href}
                className="flex min-h-11 items-center gap-1.5 px-1 text-sm font-medium text-[color:var(--color-muted)] hover:text-[color:var(--color-ink)]"
              >
                <Icon name={a.icon} size={16} />
                {a.label}
              </a>
            ) : (
              <button
                key={a.label}
                type="button"
                onClick={a.onClick}
                className="flex min-h-11 items-center gap-1.5 px-1 text-sm font-medium text-[color:var(--color-muted)] hover:text-[color:var(--color-ink)]"
              >
                <Icon name={a.icon} size={16} />
                {a.label}
              </button>
            ),
          )}
        </div>

        <div className="mt-8 flex flex-col gap-3">
          <Button variant="primary" size="lg" to={routes.home} fullWidth>
            Book Another Cab
          </Button>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button variant="ghost" size="md" to={confirmationUrl} fullWidth>
              View Confirmation
            </Button>
            <Button variant="ghost" size="md" to={invoiceUrl} fullWidth>
              View Invoice
            </Button>
            <Button
              variant="ghost"
              size="md"
              to={routes.accountBookings}
              fullWidth
            >
              My Bookings
            </Button>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

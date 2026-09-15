import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import PageShell from "../../components/PageShell";
import Button from "../../components/Button";
import Icon from "../../components/Icon";
import BookingStepper from "../../components/BookingStepper";
import BookingRouteCard from "../../components/BookingRouteCard";
import PriceSummaryCard from "../../components/PriceSummaryCard";
import ContactCard from "../../components/ContactCard";
import CheckoutLayout from "../../components/CheckoutLayout";
import { routes, bookingTypeLabels } from "../../lib/routes";
import { vehicles } from "../../data/mockData";
import { useCurrentUser } from "../../lib/currentUser";
import {
  computeFare,
  isAddOnId,
  paymentSplit,
  promoDiscount,
} from "../../lib/pricing";
import { formatDropoff, formatPickup, parseBooking } from "../../lib/booking";
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

// Step 5: the booking is confirmed. Same layout as every other step, with
// what happens next and the receipt on the left.
export default function PaymentSuccess() {
  usePageTitle("Booking confirmed");
  const [searchParams] = useSearchParams();
  const { format } = useCurrency();
  const { user: currentUser } = useCurrentUser();
  const booking = parseBooking(searchParams, isAddOnId);
  const vehicle =
    vehicles.find((v) => v.id === booking.vehicleId) ?? vehicles[0];
  const { pickup, dropoff } = booking;
  const date = formatPickup(booking);
  const selfDrive = booking.type === "self-drive";

  const fare = computeFare(booking, vehicle.pricePerDay, format);
  const promoCode = searchParams.get("promo");
  const discount = promoDiscount(promoCode, fare.total);
  const netPayable = Math.round((fare.total - discount) * 100) / 100;
  const split = paymentSplit(booking, netPayable);
  const method = searchParams.get("method") || "Credit Card";
  const travelerName = searchParams.get("travelerName") || currentUser.name;
  const travelerEmail = searchParams.get("travelerEmail") || currentUser.email;
  const travelerPhone = searchParams.get("travelerPhone") || currentUser.phone;

  const [bookingId] = useState(generateBookingId);

  // Everything about the booking travels on to the confirmation and
  // invoice, so they can show the same type, dates, add-ons and split.
  const followOnParams = new URLSearchParams(searchParams);
  followOnParams.set("vehicleId", vehicle.id);
  followOnParams.set("total", netPayable.toFixed(2));
  followOnParams.set("amountDue", split.now.toFixed(2));
  followOnParams.set("travelerName", travelerName);
  followOnParams.set("travelerEmail", travelerEmail);
  followOnParams.set("travelerPhone", travelerPhone);
  followOnParams.set("method", method);
  const invoiceUrl = `${routes.invoice(bookingId)}?${followOnParams.toString()}`;
  const confirmationUrl = `${routes.confirmation(bookingId)}?${followOnParams.toString()}`;

  const receiptRows = [
    { label: "Transaction ID", value: `HBTTB${bookingId.slice(-7)}` },
    { label: "Date", value: todayFormatted() },
    {
      label: "Booking",
      value: `${bookingTypeLabels[booking.type]} · ${fare.unit}`,
    },
    { label: "Paid by", value: method },
    { label: "Status", value: "Success", accent: true },
    { label: "Name", value: travelerName },
    { label: "Mobile", value: travelerPhone },
    { label: "Email", value: travelerEmail },
    { label: "Amount paid", value: format(split.now) },
    ...(split.later > 0
      ? [{ label: "Balance due at pick-up", value: format(split.later) }]
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

  const emailHref = `mailto:${travelerEmail}?subject=${encodeURIComponent(`DrukDrive receipt — ${bookingId}`)}&body=${encodeURIComponent(
    `Booking ${bookingId}\n${bookingTypeLabels[booking.type]}\nVehicle: ${vehicle.name}\nPickup: ${pickup}, ${date}\nDrop-off: ${dropoff}, ${formatDropoff(booking)}\nAmount paid: ${format(split.now)}`,
  )}`;

  const actions = [
    {
      icon: "download" as const,
      label: "Save as PDF",
      onClick: () => window.print(),
    },
    {
      icon: "download" as const,
      label: "Print receipt",
      onClick: () => window.print(),
    },
    { icon: "mail" as const, label: "Email receipt", href: emailHref },
  ];

  const nextSteps = selfDrive
    ? [
        `Collect the car at ${pickup} on ${date}. Bring your licence, passport or CID and a card for the deposit.`,
        "Your e-ticket and collection instructions are on their way to your email.",
        "Return with a full tank; the deposit is released within 3 days.",
      ]
    : [
        "Your e-ticket is on its way to your email.",
        "The driver's name and number are shared 2 hours before pick-up by SMS and WhatsApp.",
        split.later > 0
          ? `Pay the remaining ${format(split.later)} to the driver at pick-up.`
          : "Nothing more to pay on the day.",
      ];

  return (
    <PageShell noFooter>
      <div className="mx-auto max-w-[1100px] px-4 py-6 md:px-10 md:py-10">
        <div className="mb-8">
          <BookingStepper
            current={5}
            allDone
            detailsLabel={selfDrive ? "Driver details" : "Your details"}
          />
        </div>

        <div className="flex flex-col items-center text-center">
          <Icon
            name="check-circle"
            size={56}
            className="text-[color:var(--color-success)]"
          />
          <h1 className="t-h1 mt-4 text-[color:var(--color-ink)]">
            Booking confirmed
          </h1>
          <p className="mt-2 t-body text-[color:var(--color-ink-soft)]">
            Reference{" "}
            <span className="font-mono font-bold tracking-wide text-[color:var(--color-ink)]">
              {bookingId}
            </span>
          </p>
        </div>

        <div className="mt-10">
          <CheckoutLayout
            trip={
              <BookingRouteCard
                vehicle={vehicle}
                pickup={pickup}
                dropoff={dropoff}
                date={date}
                dropoffWhen={formatDropoff(booking)}
              />
            }
            price={
              <PriceSummaryCard
                fare={fare}
                netPayable={netPayable}
                payNow={split.now}
                payLater={split.later}
                discount={discount}
                promoCode={promoCode}
              />
            }
            help={<ContactCard />}
            main={
              <>
                <h2 className="t-h3 text-[color:var(--color-ink)]">
                  What happens next
                </h2>
                <div className="mt-4 rounded-2xl border border-[color:var(--color-border)] bg-white p-5 shadow-card">
                  <ol className="flex flex-col gap-3">
                    {nextSteps.map((step, i) => (
                      <li
                        key={step}
                        className="flex items-start gap-3 t-body text-[color:var(--color-ink-soft)]"
                      >
                        <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[color:var(--color-ink)] t-caption font-bold tabular text-white">
                          {i + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>

                <h2 className="mt-10 t-h3 text-[color:var(--color-ink)]">
                  Receipt
                </h2>
                <div className="mt-4 overflow-hidden rounded-2xl border border-[color:var(--color-border)] bg-white shadow-card">
                  {receiptRows.map((row, i) => (
                    <div
                      key={row.label}
                      className={`flex items-center justify-between gap-4 px-5 py-3.5 t-body-sm ${i !== 0 ? "border-t border-[color:var(--color-border)]" : ""}`}
                    >
                      <span className="text-[color:var(--color-muted)]">
                        {row.label}
                      </span>
                      <span
                        className={`text-right font-bold ${row.accent ? "text-[color:var(--color-success)]" : "text-[color:var(--color-ink)]"}`}
                      >
                        {row.value}
                      </span>
                    </div>
                  ))}
                  <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 border-t border-[color:var(--color-border)] bg-[color:var(--color-surface-subtle)] px-5 py-2">
                    {actions.map((a) =>
                      a.href ? (
                        <a
                          key={a.label}
                          href={a.href}
                          className="flex min-h-11 items-center gap-1.5 px-1 t-body-sm font-medium text-[color:var(--color-ink-soft)] hover:text-[color:var(--color-ink)]"
                        >
                          <Icon name={a.icon} size={16} />
                          {a.label}
                        </a>
                      ) : (
                        <button
                          key={a.label}
                          type="button"
                          onClick={a.onClick}
                          className="flex min-h-11 items-center gap-1.5 px-1 t-body-sm font-medium text-[color:var(--color-ink-soft)] hover:text-[color:var(--color-ink)]"
                        >
                          <Icon name={a.icon} size={16} />
                          {a.label}
                        </button>
                      ),
                    )}
                  </div>
                </div>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <Button
                    variant="primary"
                    size="lg"
                    to={routes.accountBookings}
                  >
                    Go to my bookings
                  </Button>
                  <Button variant="secondary" size="lg" to={confirmationUrl}>
                    View confirmation
                  </Button>
                  <Button variant="secondary" size="lg" to={invoiceUrl}>
                    View invoice
                  </Button>
                  <Button variant="ghost" size="lg" to={routes.home}>
                    Book another
                  </Button>
                </div>
              </>
            }
          />
        </div>
      </div>
    </PageShell>
  );
}

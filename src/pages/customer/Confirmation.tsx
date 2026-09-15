import { useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { createPortal } from "react-dom";
import PageShell from "../../components/PageShell";
import Button from "../../components/Button";
import Icon from "../../components/Icon";
import BookingStepper from "../../components/BookingStepper";
import BookingRouteCard from "../../components/BookingRouteCard";
import StatusBadge from "../../components/StatusBadge";
import { routes, bookingTypeLabels } from "../../lib/routes";
import { bookings, vehicles } from "../../data/mockData";
import {
  addOns,
  computeFare,
  isAddOnId,
  paymentSplit,
  promoDiscount,
} from "../../lib/pricing";
import { formatDropoff, formatPickup, parseBooking } from "../../lib/booking";
import { useCurrency } from "../../lib/currency";
import { usePageTitle } from "../../hooks/usePageTitle";

// The booking's own page. Reached from checkout (step 5, with the booking in
// the URL) and from My Bookings (a stored record). One column, its own
// shape: the confirmation, the trip, what was paid, and what to do next.
export default function Confirmation() {
  usePageTitle("Booking confirmed");
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const { format } = useCurrency();
  const fromCheckout = searchParams.has("vehicleId");

  const record = bookings.find((b) => b.id === id) ?? bookings[0];
  const booking = parseBooking(searchParams, isAddOnId);
  const vehicle = fromCheckout
    ? (vehicles.find((v) => v.id === booking.vehicleId) ?? vehicles[0])
    : (vehicles.find((v) => v.id === record.vehicleId) ?? vehicles[0]);

  const fare = computeFare(booking, vehicle.pricePerDay, format);
  const promoCode = searchParams.get("promo");
  const discount = promoDiscount(promoCode, fare.total);
  const netPayable = fromCheckout
    ? Math.round((fare.total - discount) * 100) / 100
    : record.total;
  const split = fromCheckout
    ? paymentSplit(booking, netPayable)
    : { now: record.total, later: 0 };
  const chosenAddOns = fromCheckout
    ? addOns.filter((a) => booking.addOnIds.includes(a.id))
    : [];

  const pickup = fromCheckout ? booking.pickup : record.pickup;
  const dropoff = fromCheckout ? booking.dropoff : record.dropoff;
  const date = fromCheckout ? formatPickup(booking) : record.date;
  const dropoffWhen = fromCheckout ? formatDropoff(booking) : undefined;
  const [status, setStatus] = useState<"Upcoming" | "Completed" | "Cancelled">(
    fromCheckout ? "Upcoming" : record.status,
  );
  const typeLabel = fromCheckout
    ? bookingTypeLabels[booking.type]
    : record.bookingType;
  const selfDrive = fromCheckout
    ? booking.type === "self-drive"
    : record.bookingType === "Self Drive";
  const bookingId = id ?? record.id;
  const method = searchParams.get("method");
  const travelerName = searchParams.get("travelerName");

  const invoiceUrl = fromCheckout
    ? `${routes.invoice(bookingId)}?${searchParams.toString()}`
    : routes.invoice(bookingId);
  const [cancelOpen, setCancelOpen] = useState(false);

  const nextSteps = selfDrive
    ? [
        `Collect the car at ${pickup} on ${date}. Bring your licence, passport or CID and a card for the deposit.`,
        "Return with a full tank; the deposit is released within 3 days.",
      ]
    : [
        "The driver's name and number are shared 2 hours before pick-up by SMS and WhatsApp.",
        split.later > 0
          ? `Pay the remaining ${format(split.later)} to the driver at pick-up.`
          : "Nothing more to pay on the day.",
      ];

  const receipt = [
    ...(method ? [{ label: "Paid by", value: method }] : []),
    {
      label: status === "Cancelled" ? "Refund" : "Paid now",
      value: format(split.now),
    },
    ...(split.later > 0 && status !== "Cancelled"
      ? [{ label: "Due at pick-up", value: format(split.later) }]
      : []),
    ...(fare.deposit > 0 && fromCheckout
      ? [
          {
            label: "Deposit at collection",
            value: `${format(fare.deposit)} · refundable`,
          },
        ]
      : []),
    ...(chosenAddOns.length
      ? [
          {
            label: "Add-ons",
            value: chosenAddOns.map((a) => a.name).join(", "),
          },
        ]
      : []),
    ...(travelerName
      ? [{ label: selfDrive ? "Driver" : "Traveller", value: travelerName }]
      : []),
  ];

  return (
    <PageShell noFooter>
      <div className="mx-auto max-w-[720px] px-4 py-6 md:px-10 md:py-10">
        {fromCheckout && (
          <div className="mb-8">
            <BookingStepper
              current={5}
              allDone
              detailsLabel={selfDrive ? "Driver details" : "Your details"}
            />
          </div>
        )}

        <div className="animate-fade-up flex flex-col items-center text-center">
          <span
            className={`flex size-16 items-center justify-center rounded-full ${
              status === "Cancelled"
                ? "bg-[color:var(--color-danger-bg)] text-[color:var(--color-danger)]"
                : "bg-[color:var(--color-success-bg)] text-[color:var(--color-success)]"
            }`}
          >
            <Icon
              name={status === "Cancelled" ? "close" : "check"}
              size={30}
              strokeWidth={2.5}
            />
          </span>
          <h1 className="t-h1 mt-5">
            {status === "Cancelled"
              ? "Booking cancelled"
              : status === "Completed"
                ? "Trip completed"
                : "Booking confirmed"}
          </h1>
          <p className="mt-2 t-body">
            {status === "Cancelled"
              ? "Your refund is on its way to the card or account you paid with."
              : status === "Completed"
                ? "Thanks for riding with DrukDrive."
                : "Your e-ticket has been sent to your email."}
          </p>
          <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-[color:var(--color-surface-soft)] px-3.5 py-1.5 t-caption">
            Reference
            <span className="font-mono font-bold tracking-wide text-[color:var(--color-ink)]">
              {bookingId}
            </span>
          </p>
        </div>

        <div className="mt-10 flex items-center justify-between gap-3">
          <h2 className="t-h3">{typeLabel}</h2>
          <StatusBadge status={status === "Upcoming" ? "Confirmed" : status} />
        </div>
        <div className="mt-4">
          <BookingRouteCard
            vehicle={vehicle}
            pickup={pickup}
            dropoff={dropoff}
            date={date}
            dropoffWhen={dropoffWhen}
          />
        </div>

        <h2 className="mt-10 t-h3">Payment</h2>
        <dl className="mt-4 overflow-hidden rounded-2xl border border-[color:var(--color-border)] bg-white shadow-card">
          {receipt.map((row, i) => (
            <div
              key={row.label}
              className={`flex items-center justify-between gap-4 px-5 py-3.5 ${i ? "border-t border-[color:var(--color-border)]" : ""}`}
            >
              <dt className="t-body-sm">{row.label}</dt>
              <dd className="text-right t-body-sm font-bold tabular text-[color:var(--color-ink)]">
                {row.value}
              </dd>
            </div>
          ))}
          <div className="flex flex-wrap gap-2 border-t border-[color:var(--color-border)] bg-[color:var(--color-surface-subtle)] px-4 py-3">
            <Button variant="secondary" size="sm" to={invoiceUrl}>
              <Icon name="download" size={15} />
              Invoice
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => window.print()}
            >
              <Icon name="download" size={15} />
              Print
            </Button>
            <a
              href={`mailto:?subject=${encodeURIComponent(`DrukDrive booking ${bookingId}`)}`}
              className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[color:var(--color-border)] bg-white px-3 text-xs font-semibold text-[color:var(--color-ink)] transition-colors hover:bg-[color:var(--color-surface-soft)] md:min-h-0 md:py-2"
            >
              <Icon name="mail" size={15} />
              Email
            </a>
          </div>
        </dl>

        {status === "Upcoming" && (
          <>
            <h2 className="mt-10 t-h3">What happens next</h2>
            <ol className="mt-4 flex flex-col gap-3 rounded-2xl border border-[color:var(--color-border)] bg-white p-5 shadow-card">
              {nextSteps.map((step, i) => (
                <li key={step} className="flex items-start gap-3 t-body">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[color:var(--color-ink)] t-caption font-bold tabular text-white">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </>
        )}

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Button variant="primary" size="lg" to={routes.accountBookings}>
            My bookings
          </Button>
          <Button variant="secondary" size="lg" to={routes.home}>
            Book another
          </Button>
          {status === "Upcoming" && (
            <button
              type="button"
              onClick={() => setCancelOpen(true)}
              className="inline-flex min-h-11 items-center justify-center rounded-xl px-4 t-body-sm font-semibold text-[color:var(--color-danger)] hover:bg-[color:var(--color-danger-bg)] sm:ml-auto"
            >
              Cancel booking
            </button>
          )}
        </div>
        <p className="mt-4 t-caption">
          Free cancellation up to 24 hours before pick-up. See the{" "}
          <Link
            to={routes.refundPolicy}
            className="font-semibold text-[color:var(--color-link)] underline"
          >
            refund policy
          </Link>
          .
        </p>
      </div>

      {cancelOpen &&
        createPortal(
          <div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-4">
            <button
              aria-label="Close"
              className="animate-scrim-in absolute inset-0 cursor-default bg-black/40"
              onClick={() => setCancelOpen(false)}
            />
            <div className="animate-sheet-up relative w-full rounded-t-3xl bg-white p-6 shadow-modal sm:max-w-[440px] sm:rounded-3xl">
              <h2 className="t-h3">Cancel this booking?</h2>
              <p className="mt-2 t-body">
                {`You'll get ${format(split.now)} back to the way you paid, usually within 3 to 5 working days.`}
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row-reverse">
                <Button
                  variant="danger"
                  size="lg"
                  onClick={() => {
                    setStatus("Cancelled");
                    setCancelOpen(false);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  Yes, cancel booking
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => setCancelOpen(false)}
                >
                  Keep booking
                </Button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </PageShell>
  );
}

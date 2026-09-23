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
import {
  formatDropoff,
  formatPickup,
  parseBooking,
  paymentMethodLabel,
} from "../../lib/booking";
import { useCurrency } from "../../lib/currency";
import { usePageTitle } from "../../hooks/usePageTitle";
import { useReviews } from "../../lib/reviews";
import { t, tr } from "../../lib/i18n";
import {
  card,
  inlineLink,
  metaValue,
  reference,
  sheet,
  dangerAction,
} from "../../lib/ui";

import { formatStored } from "../../lib/dates";
// The booking's own page. Reached from checkout (step 5, with the booking in
// the URL) and from My Bookings (a stored record). One column, its own
// shape: the confirmation, the trip, what was paid, and what to do next.
export default function Confirmation() {
  usePageTitle(t("Booking confirmed"));
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
  const date = fromCheckout ? formatPickup(booking) : formatStored(record.date);
  const dropoffWhen = fromCheckout ? formatDropoff(booking) : undefined;
  const { isReviewed } = useReviews();
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
  // A finished trip of the renter's own that has no review yet.
  const canReview = status === "Completed" && !isReviewed(bookingId);
  const method = searchParams.get("method");
  const travelerName = searchParams.get("travelerName");
  // Exact addresses typed on the details step; the trip stops above are
  // the places the fare was priced from.
  const pickupAddress = searchParams.get("pickupAddress");
  const dropoffAddress = searchParams.get("dropoffAddress");

  const invoiceUrl = fromCheckout
    ? `${routes.invoice(bookingId)}?${searchParams.toString()}`
    : routes.invoice(bookingId);
  const [cancelOpen, setCancelOpen] = useState(false);

  const nextSteps = selfDrive
    ? [
        t(
          "Collect the car at {place} on {date}. Bring your licence, passport or CID and a card for the deposit.",
          { place: pickupAddress || pickup, date },
        ),
        ...(split.later > 0
          ? [
              tr(
                "Pay the remaining {amount} at the desk when you collect the car.",
                {
                  amount: (
                    <span className="t-amount">{format(split.later)}</span>
                  ),
                },
              ),
            ]
          : []),
        t("Return with a full tank; the deposit is released within 3 days."),
      ]
    : [
        t(
          "The driver's name and number are shared 2 hours before pick-up by SMS and WhatsApp.",
        ),
        split.later > 0
          ? tr("Pay the remaining {amount} to the driver at pick-up.", {
              amount: <span className="t-amount">{format(split.later)}</span>,
            })
          : t("Nothing more to pay on the day."),
      ];

  const receipt: { label: string; value: string; amount?: boolean }[] = [
    ...(method
      ? [{ label: t("Paid by"), value: paymentMethodLabel(method) }]
      : []),
    {
      label: status === "Cancelled" ? t("Refund") : t("Paid now"),
      value: format(split.now),
      amount: true,
    },
    ...(split.later > 0 && status !== "Cancelled"
      ? [
          {
            label: t("Due at pick-up"),
            value: format(split.later),
            amount: true,
          },
        ]
      : []),
    ...(fare.deposit > 0 && fromCheckout
      ? [
          {
            label: t("Deposit at collection"),
            value: t("{amount} · refundable", {
              amount: format(fare.deposit),
            }),
            amount: true,
          },
        ]
      : []),
    ...(chosenAddOns.length
      ? [
          {
            label: t("Add-ons"),
            value: chosenAddOns.map((a) => t(a.name)).join(", "),
          },
        ]
      : []),
    ...(travelerName
      ? [
          {
            label: selfDrive ? t("Driver") : t("Traveller"),
            value: travelerName,
          },
        ]
      : []),
    ...(pickupAddress
      ? [
          {
            label: selfDrive ? t("Collection address") : t("Pickup address"),
            value: pickupAddress,
          },
        ]
      : []),
    ...(dropoffAddress
      ? [
          {
            label: selfDrive ? t("Return address") : t("Drop-off address"),
            value: dropoffAddress,
          },
        ]
      : []),
  ];

  return (
    <PageShell noFooter stickyHeader>
      <div className="mx-auto max-w-[720px] px-4 py-6 md:px-10 md:py-10">
        {fromCheckout && (
          <div className="mb-8">
            <BookingStepper
              current={5}
              allDone
              detailsLabel={selfDrive ? t("Driver details") : t("Your details")}
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
          <h1 className="t-h2 mt-5">
            {status === "Cancelled"
              ? t("Booking cancelled")
              : status === "Completed"
                ? t("Trip completed")
                : t("Booking confirmed")}
          </h1>
          <p className="mt-2 t-body">
            {status === "Cancelled"
              ? t(
                  "Your refund is on its way to the card or account you paid with.",
                )
              : status === "Completed"
                ? t("Thanks for riding with DrukDrive.")
                : t("Your e-ticket has been sent to your email.")}
          </p>
          <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-[color:var(--color-surface-soft)] px-3.5 py-1.5 t-caption">
            {t("Reference")}
            <span className={reference}>{bookingId}</span>
          </p>
        </div>

        <div className="mt-10 flex items-center justify-between gap-3">
          <h2 className="t-h3">{t(typeLabel)}</h2>
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

        <h2 className="mt-10 t-h3">{t("Payment")}</h2>
        <dl className={`${card} mt-4 overflow-hidden`}>
          {receipt.map((row, i) => (
            <div
              key={row.label}
              className={`flex items-center justify-between gap-4 px-5 py-3.5 ${i ? "border-t border-[color:var(--color-border)]" : ""}`}
            >
              <dt className="t-body-sm">{row.label}</dt>
              <dd
                className={`text-right ${row.amount ? "t-body-sm t-amount" : metaValue}`}
              >
                {row.value}
              </dd>
            </div>
          ))}
          <div className="flex flex-wrap gap-2 border-t border-[color:var(--color-border)] bg-[color:var(--color-surface-subtle)] px-4 py-3">
            <Button variant="ghost" size="sm" to={invoiceUrl}>
              <Icon name="download" size={15} />
              {t("Invoice")}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => window.print()}>
              <Icon name="download" size={15} />
              {t("Print")}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                window.location.href = `mailto:?subject=${encodeURIComponent(t("DrukDrive booking {id}", { id: bookingId }))}`;
              }}
            >
              <Icon name="mail" size={15} />
              {t("Email")}
            </Button>
          </div>
        </dl>

        {status === "Upcoming" && (
          <>
            <h2 className="mt-10 t-h3">{t("What happens next")}</h2>
            <ol className={`${card} mt-4 flex flex-col gap-3 p-5`}>
              {nextSteps.map((step, i) => (
                <li key={i} className="flex items-start gap-3 t-body">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[color:var(--color-ink)] t-caption font-semibold tabular text-white">
                    {i + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </>
        )}

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          {canReview && (
            <Button
              variant="primary"
              size="lg"
              to={`${routes.accountReviews}?write=${bookingId}`}
            >
              <Icon name="star" size={16} />
              {t("Write a review")}
            </Button>
          )}
          <Button
            variant={canReview ? "ghost" : "primary"}
            size="lg"
            to={routes.accountBookings}
          >
            {t("My bookings")}
          </Button>
          <Button variant="ghost" size="lg" to={routes.home}>
            {t("Book another")}
          </Button>
          {status === "Upcoming" && (
            <button
              type="button"
              onClick={() => setCancelOpen(true)}
              className={`${dangerAction} sm:ml-auto`}
            >
              {t("Cancel booking")}
            </button>
          )}
        </div>
        <p className="mt-4 t-caption">
          {tr(
            "Free cancellation up to 24 hours before pick-up. See the {policy}.",
            {
              policy: (
                <Link to={routes.refundPolicy} className={inlineLink}>
                  {t("refund policy")}
                </Link>
              ),
            },
          )}
        </p>
      </div>

      {cancelOpen &&
        createPortal(
          <div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-4">
            <button
              aria-label={t("Close")}
              className="animate-scrim-in absolute inset-0 cursor-default bg-black/40"
              onClick={() => setCancelOpen(false)}
            />
            <div
              className={`${sheet} relative w-full p-6 sm:max-w-[440px] sm:rounded-3xl`}
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="t-h3">{t("Cancel this booking?")}</h2>
                <button
                  type="button"
                  onClick={() => setCancelOpen(false)}
                  aria-label={t("Close")}
                  className="icon-btn icon-btn-filled -mr-1 -mt-1 size-10 shrink-0"
                >
                  <Icon name="close" size={20} />
                </button>
              </div>
              <p className="mt-2 t-body">
                {tr(
                  "You’ll get {amount} back to the way you paid, usually within 3 to 5 working days.",
                  {
                    amount: (
                      <span className="t-amount">{format(split.now)}</span>
                    ),
                  },
                )}
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
                  {t("Yes, cancel booking")}
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => setCancelOpen(false)}
                >
                  {t("Keep booking")}
                </Button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </PageShell>
  );
}

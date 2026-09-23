import { useParams, useSearchParams } from "react-router-dom";
import PageShell from "../../components/PageShell";
import Button from "../../components/Button";
import Icon from "../../components/Icon";
import DrukDriveLogo from "../../components/DrukDriveLogo";
import { routes } from "../../lib/routes";
import { bookings, vehicles } from "../../data/mockData";
import { useCurrentUser } from "../../lib/currentUser";
import {
  TAX_RATE,
  computeFare,
  isAddOnId,
  promoDiscount,
} from "../../lib/pricing";
import {
  formatDropoff,
  formatPickup,
  parseBooking,
  paymentMethodLabel,
} from "../../lib/booking";
import { bookingTypeLabels } from "../../lib/routes";
import { useCurrency } from "../../lib/currency";
import { usePageTitle } from "../../hooks/usePageTitle";
import { card, inset, metaLabel, metaValue, reference } from "../../lib/ui";
import { t, tn, tr, tx } from "../../lib/i18n";

import { formatStored } from "../../lib/dates";
export default function Invoice() {
  usePageTitle(t("Invoice"));
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const { format } = useCurrency();
  const { user: currentUser } = useCurrentUser();

  // Arriving straight from checkout (vehicleId in the URL) means this is the
  // booking that was just made — build the line item from that live vehicle
  // instead of the static mock record, which would show whatever booking
  // happens to share this id (or bookings[0]) rather than what was actually
  // bought. Arriving from My Bookings has no vehicleId, so it falls back to
  // the static historical record for that id.
  const vehicleId = searchParams.get("vehicleId");
  // Same fallback as checkout and confirmation: an unknown id still shows
  // the booking that was paid for, priced on the first car.
  const liveVehicle = vehicleId
    ? (vehicles.find((v) => v.id === vehicleId) ?? vehicles[0])
    : undefined;
  const historicalBooking = bookings.find((b) => b.id === id) ?? bookings[0];
  const travelerName = searchParams.get("travelerName") || currentUser.name;
  const travelerEmail = searchParams.get("travelerEmail") || currentUser.email;
  const travelerPhone = searchParams.get("travelerPhone") || currentUser.phone;
  const method = searchParams.get("method") || tx("Credit Card");

  const vehicleName = liveVehicle
    ? liveVehicle.name
    : (
        vehicles.find((v) => v.id === historicalBooking.vehicleId) ??
        vehicles[0]
      ).name;
  const bookingId = liveVehicle
    ? (id ?? historicalBooking.id)
    : historicalBooking.id;
  const booking = parseBooking(searchParams, isAddOnId);
  const fare = liveVehicle
    ? computeFare(booking, liveVehicle.pricePerDay, format)
    : null;
  const bookingDate = liveVehicle
    ? `${formatPickup(booking)} → ${formatDropoff(booking)}`
    : formatStored(historicalBooking.date);
  const unit = fare ? fare.unit : tn(1, "{n} day", "{n} days");
  const typeLabel = liveVehicle
    ? bookingTypeLabels[booking.type]
    : historicalBooking.bookingType;

  // Prefer the real total carried over from a live checkout; fall back to
  // the static mock booking's total when reached from My Bookings instead.
  const gross = fare ? fare.total : historicalBooking.total;
  const promoCode = searchParams.get("promo");
  const total = gross;

  // Live bookings itemise from the real fare; a historical record only has
  // a total, so back out a plausible base fare / tax split for display.
  const lines = fare
    ? fare.lines.filter((l) => l.kind !== "tax")
    : [
        {
          label: vehicleName,
          amount: Math.round((total / (1 + TAX_RATE)) * 100) / 100,
          kind: "base" as const,
        },
      ];
  const baseFare = lines.reduce((sum, l) => sum + l.amount, 0);
  const taxes = fare ? fare.taxes : Math.round((total - baseFare) * 100) / 100;
  const discount = fare ? promoDiscount(promoCode, gross) : 0;
  const netPayable = Math.round((total - discount) * 100) / 100;
  const amountPaid = Number(searchParams.get("amountDue")) || netPayable;
  const balance = Math.round((netPayable - amountPaid) * 100) / 100;

  return (
    <PageShell noFooter>
      <div className="mx-auto max-w-[820px] px-4 py-12 md:px-10 print:py-0">
        <div className="mb-6 flex items-center justify-between print:hidden">
          <Button
            variant="link"
            type="button"
            onClick={() => window.history.back()}
          >
            <Icon name="arrow-left" size={18} />
            {t("Back")}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => window.print()}>
            <Icon name="download" size={16} />
            {t("Download PDF")}
          </Button>
        </div>

        <div
          className={`${card} p-5 sm:p-8 print:border-0 print:p-0 print:shadow-none`}
        >
          <div
            className={`${inset} flex flex-wrap items-center justify-between gap-4 px-5 py-4`}
          >
            <DrukDriveLogo className="h-6 w-auto text-[color:var(--color-ink)]" />
            <p className="t-h3">{t("Invoice")}</p>
          </div>

          <div className="mt-5 flex flex-wrap items-start justify-between gap-4 border-b border-[color:var(--color-border)] pb-6 t-body-sm">
            <div>
              <p className="text-[color:var(--color-muted)]">
                {tr("Invoice No: {id}", {
                  id: <span className={reference}>DD-{bookingId}</span>,
                })}
              </p>
              <p className="text-[color:var(--color-muted)]">
                {tr("Booking ID: {id}", {
                  id: <span className={reference}>{bookingId}</span>,
                })}
              </p>
              <p className="text-[color:var(--color-muted)]">
                {tr("Date: {date}", {
                  date: (
                    <span className="font-semibold text-[color:var(--color-ink)]">
                      {bookingDate}
                    </span>
                  ),
                })}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 border-b border-[color:var(--color-border)] py-6 sm:grid-cols-2">
            <div>
              <p className={metaLabel}>{t("Invoiced To")}</p>
              <p className={`${metaValue} mt-1`}>{travelerName}</p>
              <p className="t-body-sm text-[color:var(--color-muted)]">
                {currentUser.address}
              </p>
              <p className="t-body-sm text-[color:var(--color-muted)]">
                {travelerPhone}
              </p>
              <p className="t-body-sm text-[color:var(--color-muted)]">
                {travelerEmail}
              </p>
            </div>
            <div className="sm:text-right">
              <p className={metaLabel}>{t("Pay To")}</p>
              <p className={`${metaValue} mt-1`}>DrukDrive</p>
              <p className="t-body-sm text-[color:var(--color-muted)]">
                Norzin Lam, Thimphu 11001
              </p>
              <p className="t-body-sm text-[color:var(--color-muted)]">
                +975 17 617 107
              </p>
              <p className="t-body-sm text-[color:var(--color-muted)]">
                www.drukdrive.bt
              </p>
            </div>
          </div>

          <div className="border-b border-[color:var(--color-border)] py-6">
            <p className={`${metaLabel} mb-1`}>{t("Payment Method")}</p>
            <p className={metaValue}>{paymentMethodLabel(method)}</p>
          </div>

          <div className="py-6">
            <h2 className="mb-3 t-h3">{t("Booking Summary")}</h2>
            <table className="w-full t-body-sm">
              <thead>
                <tr className="border-b border-[color:var(--color-border)] text-left t-caption font-semibold">
                  <th className="pb-2 font-semibold">{t("Description")}</th>
                  <th className="pb-2 font-semibold">{t("Booked for")}</th>
                  <th className="pb-2 text-right font-semibold">
                    {t("Amount")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {lines.map((l, i) => (
                  <tr
                    key={l.label}
                    className="border-b border-[color:var(--color-border)]"
                  >
                    <td className="py-3 text-[color:var(--color-ink)]">
                      {i === 0 ? `${vehicleName} · ${t(typeLabel)}` : l.label}
                      {i === 0 && fare && (
                        <span className="block t-caption">{l.label}</span>
                      )}
                    </td>
                    <td className="py-3 text-[color:var(--color-ink)]">
                      {i === 0 ? unit : ""}
                    </td>
                    <td className="py-3 text-right t-amount">
                      {format(l.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-4 flex justify-end">
              <div className="w-full space-y-2 sm:max-w-[280px]">
                <div className="flex justify-between px-3 t-body-sm">
                  <span>{t("Sub Total")}</span>
                  <span className="t-amount">{format(baseFare)}</span>
                </div>
                <div className="flex justify-between px-3 t-body-sm">
                  <span>{t("Taxes & Fees")}</span>
                  <span className="t-amount">{format(taxes)}</span>
                </div>
                <div className="h-px bg-[color:var(--color-border)]" />
                <div
                  className={`${inset} flex justify-between px-3 py-2.5 t-body-sm font-semibold text-[color:var(--color-ink)]`}
                >
                  <span>{t("Total")}</span>
                  <span className="t-amount">{format(total)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between px-3 t-body-sm font-semibold text-[color:var(--color-success-deep)]">
                    <span>
                      {promoCode
                        ? t("Discount ({code})", { code: promoCode })
                        : t("Discount")}
                    </span>
                    <span className="t-amount text-[color:var(--color-success-deep)]">
                      -{format(discount)}
                    </span>
                  </div>
                )}
                <div
                  className={`${inset} flex justify-between px-3 py-2.5 t-body-sm font-semibold text-[color:var(--color-ink)]`}
                >
                  <span>{t("Net Payable")}</span>
                  <span className="t-amount">{format(netPayable)}</span>
                </div>
                {balance > 0 && (
                  <>
                    <div className="flex justify-between px-3 t-body-sm">
                      <span>{t("Paid now")}</span>
                      <span className="t-amount">{format(amountPaid)}</span>
                    </div>
                    <div className="flex justify-between px-3 t-body-sm font-semibold text-[color:var(--color-ink)]">
                      <span>{t("Balance due at pick-up")}</span>
                      <span className="t-amount">{format(balance)}</span>
                    </div>
                  </>
                )}
                {fare && fare.deposit > 0 && (
                  <p className="px-3 t-caption">
                    {tr(
                      "A refundable deposit of {amount} is held at collection and is not part of this invoice.",
                      {
                        amount: (
                          <span className="t-amount">
                            {format(fare.deposit)}
                          </span>
                        ),
                      },
                    )}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2 border-t border-[color:var(--color-border)] py-6 sm:grid-cols-2">
            <div className="flex items-baseline justify-between gap-4 sm:block">
              <span className={`${metaLabel} shrink-0`}>
                {t("Transaction Date")}
              </span>
              <span className={`${metaValue} text-right sm:block sm:text-left`}>
                {bookingDate}
              </span>
            </div>
            <div className="flex items-baseline justify-between gap-4 sm:block">
              <span className={metaLabel}>{t("Method")}</span>
              <span className={`${metaValue} text-right sm:block sm:text-left`}>
                {paymentMethodLabel(method)}
              </span>
            </div>
            <div className="flex items-baseline justify-between gap-4 sm:block">
              <span className={metaLabel}>{t("Transaction ID")}</span>
              <span className={`${reference} ml-2 sm:ml-0 sm:block`}>
                HBTTB{bookingId.slice(-7)}
              </span>
            </div>
            <div className="flex items-baseline justify-between gap-4 sm:block">
              <span className={metaLabel}>{t("Status")}</span>
              <span className="ml-2 t-body-sm font-semibold text-[color:var(--color-success-deep)] sm:ml-0 sm:block">
                {t("Paid")}
              </span>
            </div>
          </div>

          <div className="border-t border-[color:var(--color-border)] pt-6 text-center t-caption">
            {t(
              "Thank you for booking with DrukDrive. This is a computer-generated invoice.",
            )}
          </div>
        </div>

        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row print:hidden">
          <Button
            variant="ghost"
            size="lg"
            onClick={() => window.print()}
            fullWidth
          >
            <Icon name="download" size={16} />
            {t("Print Receipt")}
          </Button>
          <Button
            variant="primary"
            size="lg"
            to={routes.accountBookings}
            fullWidth
          >
            {t("Back to my bookings")}
          </Button>
        </div>
      </div>
    </PageShell>
  );
}

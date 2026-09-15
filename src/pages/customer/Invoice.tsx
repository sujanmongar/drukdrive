import { useParams, useSearchParams } from "react-router-dom";
import PageShell from "../../components/PageShell";
import Button from "../../components/Button";
import Icon from "../../components/Icon";
import DrukDriveLogo from "../../components/DrukDriveLogo";
import { routes } from "../../lib/routes";
import { bookings, vehicles } from "../../data/mockData";
import { useCurrentUser } from "../../lib/currentUser";
import { TAX_RATE, computeFare, isAddOnId } from "../../lib/pricing";
import { formatDropoff, formatPickup, parseBooking } from "../../lib/booking";
import { bookingTypeLabels } from "../../lib/routes";
import { useCurrency } from "../../lib/currency";
import { usePageTitle } from "../../hooks/usePageTitle";

export default function Invoice() {
  usePageTitle("Invoice");
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
  const liveVehicle = vehicleId
    ? vehicles.find((v) => v.id === vehicleId)
    : undefined;
  const historicalBooking = bookings.find((b) => b.id === id) ?? bookings[0];
  const travelerName = searchParams.get("travelerName") || currentUser.name;
  const travelerEmail = searchParams.get("travelerEmail") || currentUser.email;
  const travelerPhone = searchParams.get("travelerPhone") || currentUser.phone;
  const method = searchParams.get("method") || "Credit Card";

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
    : historicalBooking.date;
  const unit = fare ? fare.unit : "1 day";
  const typeLabel = liveVehicle
    ? bookingTypeLabels[booking.type]
    : historicalBooking.bookingType;

  // Prefer the real total carried over from a live checkout; fall back to
  // the static mock booking's total when reached from My Bookings instead.
  const total = Number(searchParams.get("total")) || historicalBooking.total;

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
  const discount = 0;
  const netPayable = total - discount;
  const amountPaid = Number(searchParams.get("amountDue")) || netPayable;
  const balance = Math.round((netPayable - amountPaid) * 100) / 100;

  return (
    <PageShell noFooter>
      <div className="mx-auto max-w-[820px] px-4 py-12 md:px-10 print:py-0">
        <div className="mb-6 flex items-center justify-between print:hidden">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex min-h-11 cursor-pointer items-center gap-2 text-sm font-semibold text-[color:var(--color-ink-soft)] hover:text-[color:var(--color-ink)]"
          >
            <Icon name="arrow-left" size={18} />
            Back
          </button>
          <Button variant="secondary" size="sm" onClick={() => window.print()}>
            <Icon name="download" size={16} />
            Download PDF
          </Button>
        </div>

        <div className="rounded-xl border border-[color:var(--color-border)] p-8 shadow-card print:border-0 print:p-0 print:shadow-none">
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg bg-[color:var(--color-surface-subtle)] px-5 py-4">
            <DrukDriveLogo className="h-6 w-auto text-[color:var(--color-ink)]" />
            <p className="t-h3 text-[color:var(--color-ink)]">Invoice</p>
          </div>

          <div className="mt-5 flex flex-wrap items-start justify-between gap-4 border-b border-[color:var(--color-border)] pb-6 text-sm">
            <div>
              <p className="text-[color:var(--color-muted)]">
                Invoice No:{" "}
                <span className="font-semibold text-[color:var(--color-ink)]">
                  DD-{bookingId}
                </span>
              </p>
              <p className="text-[color:var(--color-muted)]">
                Booking ID:{" "}
                <span className="font-semibold text-[color:var(--color-ink)]">
                  {bookingId}
                </span>
              </p>
              <p className="text-[color:var(--color-muted)]">
                Date:{" "}
                <span className="font-semibold text-[color:var(--color-ink)]">
                  {bookingDate}
                </span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 border-b border-[color:var(--color-border)] py-6 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold text-[color:var(--color-muted)]">
                Invoiced To
              </p>
              <p className="mt-1 text-sm font-semibold text-[color:var(--color-ink)]">
                {travelerName}
              </p>
              <p className="text-sm text-[color:var(--color-muted)]">
                {currentUser.address}
              </p>
              <p className="text-sm text-[color:var(--color-muted)]">
                {travelerPhone}
              </p>
              <p className="text-sm text-[color:var(--color-muted)]">
                {travelerEmail}
              </p>
            </div>
            <div className="sm:text-right">
              <p className="text-xs font-semibold text-[color:var(--color-muted)]">
                Pay To
              </p>
              <p className="mt-1 text-sm font-semibold text-[color:var(--color-ink)]">
                DrukDrive
              </p>
              <p className="text-sm text-[color:var(--color-muted)]">
                Norzin Lam, Thimphu 11001
              </p>
              <p className="text-sm text-[color:var(--color-muted)]">
                +975 17 617 107
              </p>
              <p className="text-sm text-[color:var(--color-muted)]">
                www.drukdrive.bt
              </p>
            </div>
          </div>

          <div className="border-b border-[color:var(--color-border)] py-6">
            <p className="mb-1 text-xs font-semibold text-[color:var(--color-muted)]">
              Payment Method
            </p>
            <p className="text-sm font-semibold text-[color:var(--color-ink)]">
              {method}
            </p>
          </div>

          <div className="py-6">
            <h2 className="mb-3 text-base font-bold text-[color:var(--color-ink)]">
              Booking Summary
            </h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[color:var(--color-border)] text-left text-xs font-semibold text-[color:var(--color-muted)]">
                  <th className="pb-2 font-semibold">Description</th>
                  <th className="pb-2 font-semibold">Booked for</th>
                  <th className="pb-2 text-right font-semibold">Amount</th>
                </tr>
              </thead>
              <tbody>
                {lines.map((l, i) => (
                  <tr
                    key={l.label}
                    className="border-b border-[color:var(--color-border)]"
                  >
                    <td className="py-3 text-[color:var(--color-ink)]">
                      {i === 0 ? `${vehicleName} · ${typeLabel}` : l.label}
                      {i === 0 && fare && (
                        <span className="block text-xs text-[color:var(--color-muted)]">
                          {l.label}
                        </span>
                      )}
                    </td>
                    <td className="py-3 text-[color:var(--color-ink)]">
                      {i === 0 ? unit : ""}
                    </td>
                    <td className="py-3 text-right tabular text-[color:var(--color-ink)]">
                      {format(l.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-4 flex justify-end">
              <div className="w-full max-w-[260px] space-y-2">
                <div className="flex justify-between text-sm text-[color:var(--color-ink-soft)]">
                  <span>Sub Total</span>
                  <span>{format(baseFare)}</span>
                </div>
                <div className="flex justify-between text-sm text-[color:var(--color-ink-soft)]">
                  <span>Taxes &amp; Fees</span>
                  <span>{format(taxes)}</span>
                </div>
                <div className="h-px bg-[color:var(--color-border)]" />
                <div className="flex justify-between rounded-lg bg-[color:var(--color-surface-subtle)] px-3 py-2 text-sm font-bold text-[color:var(--color-ink)]">
                  <span>Total</span>
                  <span>{format(total)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm font-semibold text-[color:var(--color-success)]">
                    <span>Discount</span>
                    <span>-{format(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between rounded-lg bg-[color:var(--color-info-bg)] px-3 py-2.5 text-sm font-bold text-[color:var(--color-ink)]">
                  <span>Net Payable</span>
                  <span>{format(netPayable)}</span>
                </div>
                {balance > 0 && (
                  <>
                    <div className="flex justify-between text-sm text-[color:var(--color-ink-soft)]">
                      <span>Paid now</span>
                      <span>{format(amountPaid)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-semibold text-[color:var(--color-ink)]">
                      <span>Balance due at pick-up</span>
                      <span>{format(balance)}</span>
                    </div>
                  </>
                )}
                {fare && fare.deposit > 0 && (
                  <p className="text-xs text-[color:var(--color-muted)]">
                    A refundable deposit of {format(fare.deposit)} is held at
                    collection and is not part of this invoice.
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2 border-t border-[color:var(--color-border)] py-6 text-sm sm:grid-cols-2">
            <div className="flex justify-between sm:block">
              <span className="text-[color:var(--color-muted)]">
                Transaction Date
              </span>
              <span className="ml-2 font-semibold text-[color:var(--color-ink)] sm:ml-0 sm:block">
                {bookingDate}
              </span>
            </div>
            <div className="flex justify-between sm:block">
              <span className="text-[color:var(--color-muted)]">Method</span>
              <span className="ml-2 font-semibold text-[color:var(--color-ink)] sm:ml-0 sm:block">
                {method}
              </span>
            </div>
            <div className="flex justify-between sm:block">
              <span className="text-[color:var(--color-muted)]">
                Transaction ID
              </span>
              <span className="ml-2 font-semibold text-[color:var(--color-ink)] sm:ml-0 sm:block">
                HBTTB{bookingId.slice(-7)}
              </span>
            </div>
            <div className="flex justify-between sm:block">
              <span className="text-[color:var(--color-muted)]">Status</span>
              <span className="ml-2 font-semibold text-[color:var(--color-success)] sm:ml-0 sm:block">
                Paid
              </span>
            </div>
          </div>

          <div className="border-t border-[color:var(--color-border)] pt-6 text-center text-xs text-[color:var(--color-muted)]">
            Thank you for booking with DrukDrive. This is a computer-generated
            invoice.
          </div>
        </div>

        <div className="mt-8 flex gap-3 print:hidden">
          <Button
            variant="secondary"
            size="lg"
            onClick={() => window.print()}
            fullWidth
          >
            <Icon name="download" size={16} />
            Print Receipt
          </Button>
          <Button
            variant="primary"
            size="lg"
            to={routes.accountBookings}
            fullWidth
          >
            Back to my bookings
          </Button>
        </div>
      </div>
    </PageShell>
  );
}

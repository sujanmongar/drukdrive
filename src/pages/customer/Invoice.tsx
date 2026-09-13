import { useParams, useSearchParams } from "react-router-dom";
import PageShell from "../../components/PageShell";
import Button from "../../components/Button";
import Icon from "../../components/Icon";
import { routes } from "../../lib/routes";
import { bookings, currentUser } from "../../data/mockData";
import { TAX_RATE } from "../../lib/pricing";
import { useCurrency } from "../../lib/currency";

export default function Invoice() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const { format } = useCurrency();
  const booking = bookings.find((b) => b.id === id) ?? bookings[0];

  // Prefer the real total carried over from a live checkout (see
  // Confirmation.tsx); fall back to the static mock booking's total when
  // this invoice was reached from My Bookings instead.
  const total = Number(searchParams.get("total")) || booking.total;

  // Back out a plausible base fare / tax split for the itemized display.
  const baseFare = Math.round((total / (1 + TAX_RATE)) * 100) / 100;
  const taxes = Math.round((total - baseFare) * 100) / 100;

  return (
    <PageShell noFooter>
      <div className="mx-auto max-w-[820px] px-4 py-12 md:px-[60px] print:py-0">
        <div className="mb-6 flex items-center justify-between print:hidden">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-[#333] hover:text-[#222]"
          >
            <Icon name="arrow-left" size={18} />
            Back
          </button>
          <Button variant="secondary" size="sm" onClick={() => window.print()}>
            <Icon name="download" size={16} />
            Download PDF
          </Button>
        </div>

        <div className="rounded-xl border border-[#e5ebf0] p-8 shadow-[0px_1px_3px_rgba(25,32,36,0.16)] print:border-0 print:p-0 print:shadow-none">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#e5ebf0] pb-6">
            <div>
              <p className="text-xl font-bold text-[#222]">DrukDrive</p>
              <p className="mt-1 text-xs text-[color:var(--color-muted)]">
                Norzin Lam, Thimphu 11001, Bhutan
              </p>
              <p className="text-xs text-[color:var(--color-muted)]">support@drukdrive.bt</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-[#222]">Invoice</p>
              <p className="mt-1 text-xs text-[color:var(--color-muted)]">Invoice #{booking.id}</p>
              <p className="text-xs text-[color:var(--color-muted)]">Date: {booking.date}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 border-b border-[#e5ebf0] py-6 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold text-[#747474]">Billed to</p>
              <p className="mt-1 text-sm font-semibold text-[#222]">{currentUser.name}</p>
              <p className="text-sm text-[color:var(--color-muted)]">{currentUser.email}</p>
              <p className="text-sm text-[color:var(--color-muted)]">{currentUser.phone}</p>
            </div>
            <div className="sm:text-right">
              <p className="text-xs font-semibold text-[#747474]">Trip</p>
              <p className="mt-1 text-sm text-[#222]">{booking.pickup}</p>
              <p className="text-sm text-[#222]">&rarr; {booking.dropoff}</p>
            </div>
          </div>

          <div className="py-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#e5ebf0] text-left text-xs font-semibold text-[#747474]">
                  <th className="pb-2 font-semibold">Description</th>
                  <th className="pb-2 text-right font-semibold">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[#e5ebf0]">
                  <td className="py-3 text-[#222]">
                    {booking.vehicle}
                    <span className="block text-xs text-[color:var(--color-muted)]">
                      {booking.bookingType} booking fare
                    </span>
                  </td>
                  <td className="py-3 text-right text-[#222]">{format(baseFare)}</td>
                </tr>
                <tr className="border-b border-[#e5ebf0]">
                  <td className="py-3 text-[#222]">Taxes &amp; fees (10%)</td>
                  <td className="py-3 text-right text-[#222]">{format(taxes)}</td>
                </tr>
              </tbody>
            </table>

            <div className="mt-4 flex justify-end">
              <div className="w-full max-w-[220px] space-y-2">
                <div className="flex justify-between text-sm text-[#333]">
                  <span>Subtotal</span>
                  <span>{format(baseFare)}</span>
                </div>
                <div className="flex justify-between text-sm text-[#333]">
                  <span>Tax</span>
                  <span>{format(taxes)}</span>
                </div>
                <div className="h-px bg-[#e5ebf0]" />
                <div className="flex justify-between text-base font-bold text-[#222]">
                  <span>Total</span>
                  <span>{format(total)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-[#e5ebf0] pt-6 text-center text-xs text-[color:var(--color-muted)]">
            Thank you for booking with DrukDrive. This is a computer-generated invoice.
          </div>
        </div>

        <div className="mt-8 print:hidden">
          <Button variant="primary" size="lg" to={routes.accountBookings} fullWidth>
            Back to my bookings
          </Button>
        </div>
      </div>
    </PageShell>
  );
}

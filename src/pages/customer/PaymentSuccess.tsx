import { useSearchParams } from "react-router-dom";
import PageShell from "../../components/PageShell";
import Button from "../../components/Button";
import Icon from "../../components/Icon";
import BookingStepper from "../../components/BookingStepper";
import { routes } from "../../lib/routes";
import { vehicles, currentUser } from "../../data/mockData";
import { computeFare } from "../../lib/pricing";
import { useCurrency } from "../../lib/currency";

// Reuse the existing dummy booking id from mockData.ts so Confirmation/Invoice
// have a matching record to look up (this is a static prototype, no backend).
const BOOKING_ID = "GI1671177263";

function todayFormatted() {
  return new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }).replace(/ /g, "-");
}

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const { format } = useCurrency();
  const vehicleId = searchParams.get("vehicleId");
  const vehicle = vehicles.find((v) => v.id === vehicleId) ?? vehicles[0];

  const totalParam = searchParams.get("total");
  const total = totalParam ? Number(totalParam) : computeFare(vehicle.pricePerDay).total;

  const confirmationParams = new URLSearchParams({ vehicleId: vehicle.id, total: total.toFixed(2) });
  const invoiceUrl = `${routes.invoice(BOOKING_ID)}?${confirmationParams.toString()}`;

  const receiptRows = [
    { label: "Transactions ID", value: `HBTTB${BOOKING_ID.slice(-7)}` },
    { label: "Date", value: todayFormatted() },
    { label: "Mode of Payment", value: "Credit Card" },
    { label: "Transaction Status", value: "Success", accent: true },
    { label: "Customer Name", value: currentUser.name },
    { label: "Mobile No", value: currentUser.phone },
    { label: "Email Address", value: currentUser.email },
    { label: "Payment Amount", value: format(total) },
  ];

  const actions = [
    { icon: "download" as const, label: "Save as PDF" },
    { icon: "download" as const, label: "Print Receipt" },
    { icon: "mail" as const, label: "Email Receipt" },
  ];

  return (
    <PageShell noFooter>
      <div className="mx-auto max-w-[560px] px-4 py-8 md:px-[60px] md:py-10">
        <BookingStepper current={3} allDone />

        <div className="mt-8 flex flex-col items-center text-center">
          <Icon name="check-circle" size={64} className="text-[color:var(--color-success)]" />
          <h1 className="mt-4 text-2xl font-bold text-[color:var(--color-success)]">Booking Successful</h1>
          <p className="mt-2 max-w-sm text-sm text-[#333]">
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
              <span className="text-[color:var(--color-muted)]">{row.label}</span>
              <span className={`font-bold ${row.accent ? "text-[color:var(--color-success)]" : "text-[#222]"}`}>
                {row.value}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-6">
          {actions.map((a) => (
            <button
              key={a.label}
              type="button"
              className="flex items-center gap-1.5 text-sm font-medium text-[color:var(--color-muted)] hover:text-[#222]"
            >
              <Icon name={a.icon} size={16} />
              {a.label}
            </button>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-3">
          <Button variant="primary" size="lg" to={routes.home} fullWidth>
            Book Another Cab
          </Button>
          <div className="flex gap-3">
            <Button variant="ghost" size="md" to={invoiceUrl} fullWidth>
              View Invoice
            </Button>
            <Button variant="ghost" size="md" to={routes.accountBookings} fullWidth>
              My Bookings
            </Button>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

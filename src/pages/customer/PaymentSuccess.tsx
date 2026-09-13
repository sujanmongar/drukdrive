import { useSearchParams } from "react-router-dom";
import PageShell from "../../components/PageShell";
import Button from "../../components/Button";
import Icon from "../../components/Icon";
import { routes } from "../../lib/routes";
import { vehicles } from "../../data/mockData";
import { computeFare } from "../../lib/pricing";

// Reuse the existing dummy booking id from mockData.ts so Confirmation/Invoice
// have a matching record to look up (this is a static prototype, no backend).
const BOOKING_ID = "GI1671177263";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const vehicleId = searchParams.get("vehicleId");
  const vehicle = vehicles.find((v) => v.id === vehicleId) ?? vehicles[0];

  const totalParam = searchParams.get("total");
  const total = totalParam ? Number(totalParam) : computeFare(vehicle.pricePerDay).total;

  const confirmationParams = new URLSearchParams({ vehicleId: vehicle.id, total: total.toFixed(2) });
  const confirmationUrl = `${routes.confirmation(BOOKING_ID)}?${confirmationParams.toString()}`;

  return (
    <PageShell noFooter>
      <div className="mx-auto flex min-h-[70svh] max-w-[520px] flex-col items-center justify-center px-4 py-16 text-center">
        <Icon name="check-circle" size={72} className="text-[color:var(--color-success)]" />

        <h1 className="mt-6 text-2xl font-bold text-[#222] md:text-3xl">Payment successful!</h1>
        <p className="mt-2 max-w-sm text-sm text-[color:var(--color-muted)]">
          We&apos;ve received your payment of <span className="font-semibold text-[#333]">${total.toFixed(2)}</span>{" "}
          for the {vehicle.name}. A confirmation has been sent to your email.
        </p>

        <div className="mt-6 w-full rounded-xl border border-[#e5ebf0] px-5 py-4 text-left shadow-[0px_1px_3px_rgba(25,32,36,0.16)]">
          <div className="flex items-center gap-3">
            <img src={vehicle.image} alt={vehicle.name} className="size-12 rounded-lg object-cover" />
            <div>
              <p className="text-sm font-bold text-[#222]">{vehicle.name}</p>
              <p className="text-xs text-[color:var(--color-muted)]">Reference ID: {BOOKING_ID}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row">
          <Button variant="secondary" size="lg" to={routes.home} fullWidth>
            Back to home
          </Button>
          <Button variant="primary" size="lg" to={confirmationUrl} fullWidth>
            View booking
          </Button>
        </div>
      </div>
    </PageShell>
  );
}

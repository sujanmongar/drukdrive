import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import PageShell from "../../components/PageShell";
import Button from "../../components/Button";
import Icon from "../../components/Icon";
import { routes } from "../../lib/routes";

export default function PaymentVerify() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const vehicleId = searchParams.get("vehicleId");
  const total = searchParams.get("total");

  const forwardParams = new URLSearchParams();
  if (vehicleId) forwardParams.set("vehicleId", vehicleId);
  if (total) forwardParams.set("total", total);
  const successUrl = forwardParams.toString()
    ? `${routes.paymentSuccess}?${forwardParams.toString()}`
    : routes.paymentSuccess;

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(successUrl);
    }, 1500);
    return () => clearTimeout(timer);
  }, [navigate, successUrl]);

  return (
    <PageShell noFooter>
      <div className="mx-auto flex min-h-[70svh] max-w-[520px] flex-col items-center justify-center px-4 py-16 text-center">
        <div className="mb-6 flex size-16 items-center justify-center rounded-full bg-[#f4f6f8]">
          <Icon name="lock" size={28} />
        </div>

        <div
          className="mb-6 size-10 animate-spin rounded-full border-4 border-[#e5ebf0] border-t-[#222]"
          role="status"
          aria-label="Verifying payment"
        />

        <h1 className="text-xl font-bold text-[#222] md:text-2xl">Verifying your payment&hellip;</h1>
        <p className="mt-2 max-w-sm text-sm text-[color:var(--color-muted)]">
          Please wait while we confirm your payment with your bank. This usually takes just a few
          seconds &mdash; don&apos;t close this window.
        </p>

        <Button variant="secondary" size="md" className="mt-8" onClick={() => navigate(successUrl)}>
          Continue
        </Button>
      </div>
    </PageShell>
  );
}

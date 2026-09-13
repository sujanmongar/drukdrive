import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageShell from "../../components/PageShell";
import Icon from "../../components/Icon";
import Button from "../../components/Button";
import { routes } from "../../lib/routes";

type Role = "customer" | "driver";

export default function RoleSelect() {
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>("customer");

  const handleContinue = () => {
    navigate(routes.otp, { state: { role } });
  };

  const cards = (
    <div className="flex flex-col gap-4">
      <button
        type="button"
        onClick={() => setRole("customer")}
        className={`rounded-xl border p-5 text-left transition-colors ${
          role === "customer" ? "border-[rgba(0,0,0,0.87)] bg-[#f9ffff]" : "border-[#e5ebf0] bg-white"
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-[22px] font-bold text-[rgba(0,0,0,0.87)]">Customer</span>
          <Icon
            name="car"
            size={22}
            className={role === "customer" ? "text-[#222]" : "text-[color:var(--color-muted)]"}
          />
        </div>
        <p className="mt-1 text-sm text-[rgba(0,0,0,0.87)]">Book a ride and travel around Bhutan.</p>
      </button>

      <button
        type="button"
        onClick={() => setRole("driver")}
        className={`rounded-xl border p-5 text-left transition-colors ${
          role === "driver" ? "border-[rgba(0,0,0,0.87)] bg-[#f9ffff]" : "border-[#e5ebf0] bg-white"
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-[22px] font-bold text-[rgba(0,0,0,0.87)]">Service provider</span>
          <Icon
            name="user"
            size={22}
            className={role === "driver" ? "text-[#222]" : "text-[color:var(--color-muted)]"}
          />
        </div>
        <p className="mt-1 text-sm text-[rgba(0,0,0,0.87)]">
          Drive on the platform with the largest network of active riders.
        </p>
      </button>
    </div>
  );

  return (
    <PageShell noFooter>
      <div className="mx-auto flex min-h-[75vh] w-full max-w-[1440px] items-center justify-center bg-neutral-50 px-4 py-12 md:px-[60px]">
        {/* Desktop */}
        <div className="relative hidden w-full max-w-[440px] flex-col rounded-xl border border-[#e5ebf0] bg-white p-8 shadow-[0px_2px_14px_rgba(0,0,0,0.1)] md:flex">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Back"
            className="absolute left-6 top-6 text-[#222]"
          >
            <Icon name="chevron-left" size={22} />
          </button>
          <h1 className="mb-6 mt-8 text-2xl font-bold text-[rgba(0,0,0,0.87)]">Ride or drive?</h1>
          {cards}
          <Button size="lg" fullWidth className="mt-6" onClick={handleContinue}>
            {role === "driver" ? "Create account" : "Continue"}
          </Button>
        </div>

        {/* Mobile */}
        <div className="w-full max-w-md md:hidden">
          <div className="mb-8 flex items-center">
            <button type="button" onClick={() => navigate(-1)} aria-label="Back" className="text-[#222]">
              <Icon name="arrow-left" size={22} />
            </button>
          </div>
          <h1 className="mb-6 text-[34px] font-bold leading-tight text-[#222]">Ride or drive?</h1>
          {cards}
          <Button size="lg" fullWidth className="mt-6" onClick={handleContinue}>
            {role === "driver" ? "Create account" : "Continue"}
          </Button>
        </div>
      </div>
    </PageShell>
  );
}

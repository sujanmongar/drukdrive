import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageShell from "../../components/PageShell";
import Icon from "../../components/Icon";
import Button from "../../components/Button";
import { routes } from "../../lib/routes";
import { currentUser } from "../../data/mockData";
import { useAuth, DEMO_EMAIL, DEMO_PASSWORD } from "../../lib/auth";
import { usePageTitle } from "../../hooks/usePageTitle";

type Method = "email" | "phone";

const inputClass =
  "w-full rounded-xl border border-[color:var(--color-border)] px-5 py-4 text-sm text-[color:var(--color-ink)] placeholder:text-[color:var(--color-placeholder)] outline-none transition-colors focus:border-[color:var(--color-ink)]";

export default function SignIn() {
  usePageTitle("Sign in");
  const navigate = useNavigate();
  const { login } = useAuth();
  const [method, setMethod] = useState<Method>("email");
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState(currentUser.phone);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (method === "phone") {
      navigate(routes.otp, { state: { role: "customer" } });
    } else {
      login();
      navigate(routes.home);
    }
  };

  const methodTabs = (
    <div className="mb-5 flex gap-2 rounded-xl bg-neutral-100 p-1">
      <button
        type="button"
        onClick={() => setMethod("email")}
        className={`flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
          method === "email" ? "bg-[color:var(--color-ink)] text-white" : "text-[color:var(--color-muted)]"
        }`}
      >
        Email
      </button>
      <button
        type="button"
        onClick={() => setMethod("phone")}
        className={`flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
          method === "phone" ? "bg-[color:var(--color-ink)] text-white" : "text-[color:var(--color-muted)]"
        }`}
      >
        Phone
      </button>
    </div>
  );

  const fields = (
    <div className="flex flex-col gap-4">
      {method === "email" ? (
        <>
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className={`${inputClass} pl-11`}
            />
            <Icon
              name="mail"
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[color:var(--color-placeholder)]"
            />
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className={`${inputClass} pl-11 pr-11`}
            />
            <Icon
              name="lock"
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[color:var(--color-placeholder)]"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[color:var(--color-muted)]"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              <Icon name={showPassword ? "eye-off" : "eye"} size={18} />
            </button>
          </div>
        </>
      ) : (
        <div className="relative">
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+975 Phone number"
            className={`${inputClass} pl-11`}
          />
          <Icon
            name="phone"
            size={18}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[color:var(--color-placeholder)]"
          />
        </div>
      )}
    </div>
  );

  const demoHint = method === "email" && (
    <button
      type="button"
      onClick={() => {
        setEmail(DEMO_EMAIL);
        setPassword(DEMO_PASSWORD);
      }}
      className="mt-3 flex w-full items-start gap-2 rounded-xl bg-[color:var(--color-info-bg)] px-3.5 py-3 text-left text-xs text-[color:var(--color-info-text)]"
    >
      <Icon name="info" size={16} className="mt-0.5 shrink-0" />
      <span>
        Demo credentials — <span className="font-semibold">{DEMO_EMAIL}</span> /{" "}
        <span className="font-semibold">{DEMO_PASSWORD}</span>. Tap to autofill.
      </span>
    </button>
  );

  const rememberAndForgot = (
    <div className="mt-4 flex items-center justify-between">
      <label className="flex cursor-pointer items-center gap-2 text-sm text-[color:var(--color-ink)]">
        <input
          type="checkbox"
          checked={remember}
          onChange={(e) => setRemember(e.target.checked)}
          className="size-[18px] rounded border-[color:var(--color-border)] accent-[color:var(--color-ink)]"
        />
        Remember me
      </label>
      <Link to={routes.forgotPassword} className="flex items-center gap-1.5 text-sm font-semibold text-[color:var(--color-ink)]">
        <Icon name="lock" size={16} />
        Forgot password?
      </Link>
    </div>
  );

  const footerLinks = (
    <>
      <p className="mt-6 text-center text-sm text-[color:var(--color-ink)]">
        Don&rsquo;t have an account?{" "}
        <Link to={routes.signUp} className="font-bold text-[color:var(--color-ink)]">
          Sign up
        </Link>
      </p>
      <p className="mt-6 text-center text-xs leading-relaxed text-[color:var(--color-ink-87)]">
        By continuing, you agree our{" "}
        <span className="font-semibold text-[color:var(--color-link)] underline">Terms of Services</span> and{" "}
        <span className="font-semibold text-[color:var(--color-link)] underline">Privacy Policy</span>.
      </p>
    </>
  );

  return (
    <PageShell noFooter>
      <div className="mx-auto flex min-h-[75vh] w-full max-w-[1440px] items-center justify-center bg-neutral-50 px-4 py-12 md:px-[60px]">
        {/* Desktop */}
        <div className="relative hidden w-full max-w-[440px] flex-col rounded-xl border border-[color:var(--color-border)] bg-white p-8 shadow-[0px_2px_14px_rgba(0,0,0,0.1)] md:flex">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Close"
            className="absolute left-6 top-6 text-[color:var(--color-ink)]"
          >
            <Icon name="close" size={20} />
          </button>
          <h1 className="mb-6 mt-8 text-2xl font-bold text-[color:var(--color-ink-87)]">Sign in</h1>
          <form onSubmit={handleSubmit} className="flex flex-col">
            {methodTabs}
            {fields}
            {demoHint}
            {rememberAndForgot}
            <Button type="submit" size="lg" fullWidth className="mt-6">
              Continue
            </Button>
          </form>
          {footerLinks}
        </div>

        {/* Mobile */}
        <div className="w-full max-w-md md:hidden">
          <div className="mb-8 flex items-center">
            <button type="button" onClick={() => navigate(-1)} aria-label="Back" className="text-[color:var(--color-ink)]">
              <Icon name="arrow-left" size={22} />
            </button>
          </div>
          <h1 className="mb-6 text-[34px] font-bold leading-tight text-[color:var(--color-ink)]">Sign in</h1>
          <form onSubmit={handleSubmit} className="flex flex-col">
            {methodTabs}
            {fields}
            {demoHint}
            {rememberAndForgot}
            <Button type="submit" size="lg" fullWidth className="mt-6">
              Continue
            </Button>
          </form>
          {footerLinks}
        </div>
      </div>
    </PageShell>
  );
}

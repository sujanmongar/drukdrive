import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthShell, {
  AuthInput,
  AuthTerms,
  MethodTabs,
  type AuthMethod,
} from "../../components/AuthShell";
import Icon from "../../components/Icon";
import { Checkbox } from "../../components/CheckboxRow";
import Button from "../../components/Button";
import { routes } from "../../lib/routes";
import { actionLink, inlineLink } from "../../lib/ui";
import { currentUser } from "../../data/mockData";
import { useAuth, DEMO_EMAIL, DEMO_PASSWORD } from "../../lib/auth";
import { usePageTitle } from "../../hooks/usePageTitle";

export default function SignIn() {
  usePageTitle("Sign in");
  const navigate = useNavigate();
  const { login } = useAuth();
  const [method, setMethod] = useState<AuthMethod>("email");
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState(currentUser.phone);
  const [password, setPassword] = useState("");
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

  const fields = (
    <div className="flex flex-col gap-4">
      {method === "email" ? (
        <>
          <AuthInput
            icon="mail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
          />
          <AuthInput
            icon="lock"
            password
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
        </>
      ) : (
        <AuthInput
          icon="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+975 Phone number"
        />
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
      className="mt-3 flex w-full items-start gap-2 rounded-xl bg-[color:var(--color-info-bg)] px-3.5 py-3 text-left t-caption text-[color:var(--color-info-text)] transition-colors duration-150 hover:bg-[color:var(--color-info-bg)]/70"
    >
      <Icon name="info" size={16} className="mt-0.5 shrink-0" />
      <span>
        Demo credentials — <span className="font-semibold">{DEMO_EMAIL}</span> /{" "}
        <span className="font-semibold">{DEMO_PASSWORD}</span>. Tap to autofill.
      </span>
    </button>
  );

  const rememberAndForgot = (
    <div className="mt-2 flex items-center justify-between">
      <Checkbox
        inline
        checked={remember}
        onChange={setRemember}
        label="Remember me"
      />
      <Link to={routes.forgotPassword} className={actionLink}>
        <Icon name="lock" size={16} />
        Forgot password?
      </Link>
    </div>
  );

  return (
    <AuthShell title="Sign in">
      <form onSubmit={handleSubmit} className="flex flex-col">
        <MethodTabs value={method} onChange={setMethod} />
        {fields}
        {demoHint}
        {rememberAndForgot}
        <Button type="submit" size="lg" fullWidth className="mt-6">
          Continue
        </Button>
      </form>
      <p className="mt-6 text-center t-body-sm">
        Don&rsquo;t have an account?{" "}
        <Link to={routes.signUp} className={inlineLink}>
          Sign up
        </Link>
      </p>
      <AuthTerms />
    </AuthShell>
  );
}

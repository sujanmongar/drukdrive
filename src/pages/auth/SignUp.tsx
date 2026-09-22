import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthShell, {
  AuthInput,
  AuthTerms,
  MethodTabs,
  type AuthMethod,
} from "../../components/AuthShell";
import Button from "../../components/Button";
import { routes } from "../../lib/routes";
import { inlineLink } from "../../lib/ui";
import { usePageTitle } from "../../hooks/usePageTitle";

export default function SignUp() {
  usePageTitle("Sign up");
  const navigate = useNavigate();
  const [method, setMethod] = useState<AuthMethod>("email");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    navigate(routes.otp, { state: { role: "customer" } });
  };

  return (
    <AuthShell title="Create an account">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <MethodTabs value={method} onChange={setMethod} />
        <AuthInput
          icon="user"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full name"
        />
        {method === "email" ? (
          <AuthInput
            icon="mail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
          />
        ) : (
          <AuthInput
            icon="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+975 Phone number"
          />
        )}
        <AuthInput
          icon="lock"
          password
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <Button type="submit" size="lg" fullWidth className="mt-2">
          Continue
        </Button>
      </form>
      <p className="mt-6 text-center t-body-sm">
        Already have an account?{" "}
        <Link to={routes.signIn} className={inlineLink}>
          Sign in
        </Link>
      </p>
      <AuthTerms />
    </AuthShell>
  );
}

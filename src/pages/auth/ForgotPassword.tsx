import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthShell, { AuthInput, AuthTerms } from "../../components/AuthShell";
import Button from "../../components/Button";
import { routes } from "../../lib/routes";
import { actionLink } from "../../lib/ui";
import { currentUser } from "../../data/mockData";
import { usePageTitle } from "../../hooks/usePageTitle";

export default function ForgotPassword() {
  usePageTitle("Forgot password");
  const navigate = useNavigate();
  const [value, setValue] = useState(currentUser.email);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    navigate(routes.resetPassword);
  };

  return (
    <AuthShell title="Reset your password" back>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <p className="text-center t-body-sm">
          We will send you a reset OTP on your registered e-mail ID or mobile
          number.
        </p>
        <AuthInput
          icon="mail"
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Email or phone number"
        />
        <Button type="submit" size="lg" fullWidth className="mt-2">
          Send reset code
        </Button>
        <Link to={routes.signIn} className={`${actionLink} mt-1 self-center`}>
          Back to sign in
        </Link>
      </form>
      <AuthTerms />
    </AuthShell>
  );
}

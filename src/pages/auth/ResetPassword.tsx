import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthShell, { AuthInput, AuthTerms } from "../../components/AuthShell";
import Button from "../../components/Button";
import { routes } from "../../lib/routes";
import { actionLink, fieldError } from "../../lib/ui";
import { usePageTitle } from "../../hooks/usePageTitle";

export default function ResetPassword() {
  usePageTitle("Reset password");
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (password && confirm && password !== confirm) {
      setError("Passwords don't match.");
      return;
    }
    setError("");
    navigate(routes.signIn);
  };

  return (
    <AuthShell title="Create new password" back>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <p className="text-center t-body-sm">
          Your new password must be different from previously used passwords.
        </p>
        <AuthInput
          icon="lock"
          password
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="New password"
        />
        <div>
          <AuthInput
            icon="lock"
            password
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Confirm password"
          />
          {error && <p className={fieldError}>{error}</p>}
        </div>
        <Button type="submit" size="lg" fullWidth className="mt-2">
          Reset password
        </Button>
        <Link to={routes.signIn} className={`${actionLink} mt-1 self-center`}>
          Back to sign in
        </Link>
      </form>
      <AuthTerms />
    </AuthShell>
  );
}

import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthShell, { AuthInput, AuthTerms } from "../../components/AuthShell";
import Button from "../../components/Button";
import { routes } from "../../lib/routes";
import { actionLink, fieldError } from "../../lib/ui";
import { usePageTitle } from "../../hooks/usePageTitle";
import { t, tx } from "../../lib/i18n";

export default function ResetPassword() {
  usePageTitle(t("Reset password"));
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (password && confirm && password !== confirm) {
      setError(tx("Passwords don't match."));
      return;
    }
    setError("");
    navigate(routes.signIn);
  };

  return (
    <AuthShell title={t("Create new password")} back>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <p className="text-center t-body-sm">
          {t(
            "Your new password must be different from previously used passwords.",
          )}
        </p>
        <AuthInput
          icon="lock"
          password
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={t("New password")}
        />
        <div>
          <AuthInput
            icon="lock"
            password
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder={t("Confirm password")}
          />
          {error && <p className={fieldError}>{t(error)}</p>}
        </div>
        <Button type="submit" size="lg" fullWidth className="mt-2">
          {t("Reset password")}
        </Button>
        <Link to={routes.signIn} className={`${actionLink} mt-1 self-center`}>
          {t("Back to sign in")}
        </Link>
      </form>
      <AuthTerms />
    </AuthShell>
  );
}

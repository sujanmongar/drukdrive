import PageShell from "../components/PageShell";
import Button from "../components/Button";
import Icon from "../components/Icon";
import { routes } from "../lib/routes";
import { usePageTitle } from "../hooks/usePageTitle";

export default function NotFound() {
  usePageTitle("Page not found");
  return (
    <PageShell>
      <div className="mx-auto flex min-h-[60svh] max-w-[560px] flex-col items-center justify-center px-4 py-16 text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-[color:var(--color-surface-soft)]">
          <Icon
            name="car"
            size={28}
            className="text-[color:var(--color-muted)]"
          />
        </div>
        <p className="mt-6 t-label uppercase text-[color:var(--color-muted)]">
          404
        </p>
        <h1 className="t-h2 mt-2">Page not found</h1>
        <p className="mt-2 max-w-sm t-body-sm text-[color:var(--color-muted)]">
          The page you're looking for doesn't exist or may have moved.
        </p>
        <Button variant="primary" size="lg" to={routes.home} className="mt-8">
          Back to home
        </Button>
      </div>
    </PageShell>
  );
}

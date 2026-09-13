import { useLocation, useNavigate } from "react-router-dom";
import PageShell from "../components/PageShell";
import Icon from "../components/Icon";
import Button from "../components/Button";
import { staticPages } from "../data/staticPages";
import { routes } from "../lib/routes";
import { usePageTitle } from "../hooks/usePageTitle";

export default function StaticPage() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const content = staticPages[pathname];
  usePageTitle(content?.title ?? "DrukDrive");

  if (!content) {
    return (
      <PageShell>
        <div className="mx-auto max-w-[720px] px-4 py-16 text-center md:px-[60px]">
          <h1 className="text-2xl font-bold text-[color:var(--color-ink)]">Page not found</h1>
          <Button variant="primary" size="lg" to={routes.home} className="mt-6">
            Back to home
          </Button>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="mx-auto max-w-[820px] px-4 py-10 md:px-[60px] md:py-14">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-1.5 text-sm font-medium text-[color:var(--color-ink)] hover:underline"
        >
          <Icon name="arrow-left" size={16} />
          Back
        </button>

        <h1 className="text-2xl font-bold text-[color:var(--color-ink)] md:text-3xl">{content.title}</h1>
        <p className="mt-3 text-sm leading-relaxed text-[color:var(--color-ink-soft)]">{content.intro}</p>

        <div className="mt-8 flex flex-col gap-6">
          {content.sections.map((section) => (
            <div key={section.heading}>
              <h2 className="mb-1.5 text-base font-bold text-[color:var(--color-ink)]">{section.heading}</h2>
              <p className="text-sm leading-relaxed text-[color:var(--color-ink-soft)]">{section.body}</p>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}

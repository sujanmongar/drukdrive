import PageShell from "../../../components/PageShell";
import SecondaryTabs from "../../../components/SecondaryTabs";
import ProfileHero from "../../../components/ProfileHero";
import Icon from "../../../components/Icon";
import Button from "../../../components/Button";
import { reviews } from "../../../data/mockData";
import { accountTabs } from "./_tabs";
import { usePageTitle } from "../../../hooks/usePageTitle";

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Icon
          key={i}
          name="star"
          size={14}
          className={i < rating ? "fill-current text-amber-400" : "text-neutral-200"}
        />
      ))}
    </div>
  );
}

export default function AccountReviews() {
  usePageTitle("Reviews");
  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "0.0";

  return (
    <PageShell>
      <ProfileHero />
      <div className="mt-6 md:mt-8">
        <SecondaryTabs tabs={accountTabs} />
      </div>

      <div className="mx-auto max-w-[1440px] px-4 py-8 md:px-[60px] md:py-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-[color:var(--color-ink)]">Reviews</h2>
            {reviews.length > 0 && (
              <p className="mt-1 flex items-center gap-1.5 text-sm text-[color:var(--color-muted)]">
                <Icon name="star" size={14} className="fill-current text-amber-400" />
                <span className="font-semibold text-[color:var(--color-ink)]">{avgRating}</span> avg. of {reviews.length}
              </p>
            )}
          </div>
          <Button variant="primary" size="sm">
            Write review
          </Button>
        </div>

        {reviews.length === 0 ? (
          <div className="mt-10 flex flex-col items-center justify-center rounded-xl border border-[color:var(--color-border)] bg-white py-16 text-center shadow-[0px_1px_3px_rgba(25,32,36,0.16)]">
            <Icon name="star" size={32} className="text-[color:var(--color-muted)]" />
            <p className="mt-3 text-sm font-semibold text-[color:var(--color-ink)]">No reviews yet</p>
          </div>
        ) : (
          <div className="mt-6 flex flex-col gap-4">
            {reviews.map((r) => (
              <div
                key={r.id}
                className="flex gap-4 rounded-xl border border-[color:var(--color-border)] bg-white p-4 shadow-[0px_1px_3px_rgba(25,32,36,0.16)]"
              >
                <img src={r.avatar} alt={r.author} className="size-11 shrink-0 rounded-full object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-bold text-[color:var(--color-ink)]">{r.author}</p>
                    <span className="text-xs text-[color:var(--color-muted)]">{r.date}</span>
                  </div>
                  <div className="mt-1">
                    <Stars rating={r.rating} />
                  </div>
                  <p className="mt-2 text-sm text-[color:var(--color-ink-soft)]">{r.comment}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageShell>
  );
}

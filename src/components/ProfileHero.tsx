import { Link } from "react-router-dom";
import Icon from "./Icon";
import { useCurrentUser } from "../lib/currentUser";
import { routes } from "../lib/routes";

export default function ProfileHero({
  editHref = routes.accountProfileEdit,
  reviewHref = routes.accountReviews,
}: {
  editHref?: string;
  reviewHref?: string;
}) {
  const { user: currentUser } = useCurrentUser();
  return (
    <div className="mx-auto flex max-w-[1280px] flex-col gap-6 px-4 pt-8 sm:flex-row sm:items-start sm:justify-between md:px-10 md:pt-10">
      <div className="flex items-start gap-5">
        <img
          src={currentUser.avatar}
          alt=""
          className="size-20 shrink-0 rounded-full bg-[color:var(--color-surface-soft)] object-cover md:size-24"
        />
        <div>
          <h1 className="t-h1 text-[color:var(--color-ink)]">Welcome, {currentUser.name.split(" ")[0]}</h1>
          <p className="mt-1 text-sm text-[color:var(--color-muted)]">Joined in {currentUser.joinedYear}</p>
          <Link to={editHref} className="mt-2 inline-block text-sm font-semibold text-[color:var(--color-ink)] underline">
            Edit profile
          </Link>
          <div className="mt-3 flex flex-col gap-1.5 text-sm text-[color:var(--color-ink-soft)] sm:flex-row sm:items-center sm:gap-4">
            <span className="flex items-center gap-1.5">
              <Icon name="location" size={16} />
              {currentUser.location}
            </span>
            <span className="flex items-center gap-1.5">
              <Icon name="mail" size={16} />
              {currentUser.email}
            </span>
          </div>
        </div>
      </div>
      <Link
        to={reviewHref}
        className="flex items-center gap-1.5 text-sm font-semibold text-[color:var(--color-ink)] underline sm:pt-1"
      >
        <Icon name="edit" size={16} />
        Write review
      </Link>
    </div>
  );
}

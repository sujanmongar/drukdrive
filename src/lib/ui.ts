// One recipe per kind of element. Pages compose these instead of writing
// their own class strings, so a card, field, link, chip or menu looks and
// behaves the same on every page, customer or driver.
//
// Radius: cards, panels, menus 2xl · inputs and buttons xl · chips and
// pills full · dialogs and sheets 3xl · tinted insets inside a card xl.
// Motion: rows and colours fade in 150ms, cards and buttons move in 200ms.

const ink = "text-[color:var(--color-ink)]";
const border = "border border-[color:var(--color-border)]";

/** Resting surface: cards, panels, grouped lists. Never hovers. */
export const card = `rounded-2xl ${border} bg-white shadow-card`;

/** A whole card that is a link: lifts 2px, border darkens, shadow grows. */
export const cardLink = `${card} transition-all duration-200 hover:-translate-y-0.5 hover:border-[color:var(--color-ink)] hover:shadow-lift`;

/** Tinted block inside a card: notes, totals, info. */
export const inset = "rounded-xl bg-[color:var(--color-surface-subtle)]";

/** A row or list item that highlights on hover. */
export const rowHover =
  "transition-colors duration-150 hover:bg-[color:var(--color-surface-soft)]";

/** Text input and select: 48px, body text, muted placeholder. */
export const input = `h-12 w-full rounded-xl ${border} bg-white px-3.5 t-body ${ink} placeholder:text-[color:var(--color-muted)] outline-none transition-colors duration-150 hover:border-[color:var(--color-ink)] focus:border-[color:var(--color-ink)]`;

/** Multi-line input; same look as `input`. */
export const textarea = `min-h-28 w-full rounded-xl ${border} bg-white px-3.5 py-3 t-body ${ink} placeholder:text-[color:var(--color-muted)] outline-none transition-colors duration-150 hover:border-[color:var(--color-ink)] focus:border-[color:var(--color-ink)]`;

/** Label above a field. */
export const label = `mb-1.5 block t-body-sm font-semibold ${ink}`;
/** Optional note after a label, e.g. "(optional)". */
export const labelNote = "font-normal text-[color:var(--color-muted)]";
/** Error under a field. */
export const fieldError = "mt-1.5 t-caption text-[color:var(--color-danger)]";
/** Help text under a field. */
export const fieldHint = "mt-1.5 t-caption";

/** Link inside a sentence. */
export const inlineLink =
  "font-semibold text-[color:var(--color-link)] underline underline-offset-2 transition-colors duration-150 hover:text-[color:var(--color-ink)]";

/** Standalone text action: Edit, Cancel, Clear all, Mark all as read. */
export const actionLink = `-mx-2 inline-flex min-h-11 items-center gap-1.5 rounded-xl px-2 t-body-sm font-semibold ${ink} underline underline-offset-2 transition-colors duration-150 hover:bg-[color:var(--color-surface-soft)]`;

/** Entry point to a destructive action (Cancel booking, Delete account).
 *  The final confirm inside the dialog is the solid danger Button. */
export const dangerAction =
  "inline-flex min-h-11 items-center justify-center gap-1.5 rounded-xl px-4 t-body-sm font-semibold text-[color:var(--color-danger)] transition-colors duration-150 hover:bg-[color:var(--color-danger-bg)]";

/** Quiet navigation text (breadcrumbs, secondary nav): muted, ink on hover. */
export const quietLink =
  "transition-colors duration-150 hover:text-[color:var(--color-ink)]";

/** Filter or segmented chip. */
export function chip(active: boolean) {
  return `inline-flex min-h-11 items-center justify-center gap-1.5 whitespace-nowrap rounded-full border px-4 t-body-sm font-semibold transition-colors duration-150 lg:min-h-9 lg:px-3.5 ${
    active
      ? "border-[color:var(--color-ink)] bg-[color:var(--color-ink)] text-white"
      : `border-[color:var(--color-border)] bg-white ${ink} hover:border-[color:var(--color-ink)]`
  }`;
}

/** Dropdown menu surface and its rows. */
export const menu = `animate-popover overflow-hidden rounded-2xl ${border} bg-white py-1.5 shadow-pop`;
export const menuItem = `flex min-h-11 w-full items-center gap-2.5 px-4 text-left t-body-sm ${ink} ${rowHover}`;

/** Centred dialog and bottom sheet surfaces. */
export const dialog = "animate-popover rounded-3xl bg-white shadow-modal";
export const sheet = "animate-sheet-up rounded-t-3xl bg-white shadow-modal";

/** One-time-code digit box (sign-in and net banking). Border colour is
 *  set by the caller: border token at rest, danger on error. */
export const otpDigit =
  "h-12 w-11 rounded-xl border bg-white text-center t-h3 outline-none transition-colors duration-150 hover:border-[color:var(--color-ink)] focus:border-[color:var(--color-ink)] sm:h-14 sm:w-14";

/** Round icon disc in lists and empty states. */
export const iconTile =
  "flex size-10 shrink-0 items-center justify-center rounded-full bg-[color:var(--color-surface-soft)]";

/** Small caption over a value (dt / dd pairs). */
export const metaLabel = "t-caption";
export const metaValue = `t-body-sm font-semibold ${ink}`;

/** Booking, invoice and transaction references. */
export const reference = `t-body-sm font-semibold tabular ${ink}`;

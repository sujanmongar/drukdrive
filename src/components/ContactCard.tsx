import Icon from "./Icon";
import SocialIcon from "./SocialIcon";

const PHONE = "+975 17 617 107";
const PHONE_HREF = "tel:+97517617107";
const WHATSAPP_HREF = "https://wa.me/97517617107";

// Quick ways to reach DrukDrive while booking. Calling or messaging is the
// thing people actually need, so those are the two big actions; email and
// opening hours sit underneath as quiet detail.
export default function ContactCard() {
  return (
    <div className="rounded-2xl border border-[color:var(--color-border)] bg-white p-5 shadow-card">
      <div className="grid grid-cols-2 gap-3">
        <a
          href={WHATSAPP_HREF}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-[72px] flex-col items-center justify-center gap-1.5 rounded-xl bg-[color:var(--color-success)] px-3 text-center text-white transition-all duration-200 hover:bg-[color:var(--color-success-deep)] hover:-translate-y-px active:scale-[0.98]"
        >
          <SocialIcon name="whatsapp" size={22} />
          <span className="t-body-sm font-bold text-white">WhatsApp</span>
        </a>
        <a
          href={PHONE_HREF}
          className="flex min-h-[72px] flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-[color:var(--color-success)] px-3 text-center text-[color:var(--color-success-deep)] transition-all duration-200 hover:bg-[color:var(--color-success-bg)] active:scale-[0.98]"
        >
          <Icon name="phone" size={20} strokeWidth={2.2} />
          <span className="t-body-sm font-bold">Call us</span>
        </a>
      </div>
      <p className="mt-3 text-center t-body font-semibold tabular text-[color:var(--color-ink)]">
        {PHONE}
      </p>
      <dl className="mt-4 flex flex-col gap-1.5 border-t border-[color:var(--color-border)] pt-4 t-caption">
        <div className="flex items-center justify-between gap-3">
          <dt>Email</dt>
          <dd>
            <a
              href="mailto:support@drukdrive.bt"
              className="-my-2.5 -mr-2 inline-flex min-h-11 items-center rounded-lg px-2 font-semibold text-[color:var(--color-ink)] hover:underline"
            >
              support@drukdrive.bt
            </a>
          </dd>
        </div>
        <div className="flex items-center justify-between gap-3">
          <dt>Hours</dt>
          <dd className="font-semibold text-[color:var(--color-ink)]">
            7:00–22:00, every day
          </dd>
        </div>
      </dl>
    </div>
  );
}

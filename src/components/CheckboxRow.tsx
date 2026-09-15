import Icon from "./Icon";

// A full-width, 44px-tall row: the whole line is the tap target, not just
// the 18px box, so it works under a thumb.
export default function CheckboxRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="-mx-2 flex min-h-11 cursor-pointer items-center gap-3 rounded-lg px-2 t-body text-[color:var(--color-ink)] transition-colors hover:bg-[color:var(--color-surface-soft)]">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      <span
        className={`flex size-5 shrink-0 items-center justify-center rounded-[5px] border-2 transition-colors ${
          checked
            ? "border-[color:var(--color-ink)] bg-[color:var(--color-ink)]"
            : "border-[color:var(--color-border)]"
        }`}
      >
        {checked && (
          <Icon name="check" size={13} strokeWidth={3} className="text-white" />
        )}
      </span>
      {label}
    </label>
  );
}

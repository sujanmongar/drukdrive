import Icon from "./Icon";

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
    <label className="flex cursor-pointer items-center gap-2.5 text-sm text-[color:var(--color-ink)]">
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
      <span
        className={`flex size-[18px] shrink-0 items-center justify-center rounded-[4px] border-2 transition-colors ${
          checked ? "border-[color:var(--color-ink)] bg-[color:var(--color-ink)]" : "border-[color:var(--color-border)]"
        }`}
      >
        {checked && <Icon name="check" size={11} className="text-white" />}
      </span>
      {label}
    </label>
  );
}

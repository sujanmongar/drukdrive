import type { IconName } from "./Icon";
import Icon from "./Icon";

export function FieldButton({
  icon,
  label,
  value,
  onClick,
  className = "",
}: {
  icon: IconName;
  label: string;
  value: string;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-[58px] w-full items-center gap-2 rounded-xl border border-[color:var(--color-border)] px-3 text-left hover:border-[#222] ${className}`}
    >
      <Icon name={icon} size={20} className="shrink-0 text-[#222]" />
      <span className="flex flex-col gap-1 leading-none">
        <span className="text-[11px] text-[color:var(--color-ink-soft)]">{label}</span>
        <span className="text-sm font-bold text-[#222]">{value}</span>
      </span>
    </button>
  );
}

export function TextInput({
  label,
  icon,
  ...props
}: { label: string; icon?: IconName } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="flex w-full flex-col gap-1.5">
      <span className="text-xs font-medium text-[color:var(--color-ink-soft)]">{label}</span>
      <span className="flex h-[52px] items-center gap-2 rounded-xl border border-[color:var(--color-border)] px-3.5 focus-within:border-[#222]">
        {icon && <Icon name={icon} size={18} className="shrink-0 text-[color:var(--color-muted)]" />}
        <input
          className="w-full bg-transparent text-sm text-[#222] outline-none placeholder:text-[color:var(--color-muted)]"
          {...props}
        />
      </span>
    </label>
  );
}

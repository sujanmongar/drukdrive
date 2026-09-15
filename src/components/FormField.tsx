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
      className={`flex h-[58px] w-full items-center gap-2 rounded-xl border border-[color:var(--color-border)] px-3 text-left hover:border-[color:var(--color-ink)] ${className}`}
    >
      <Icon
        name={icon}
        size={20}
        className="shrink-0 text-[color:var(--color-ink)]"
      />
      <span className="flex flex-col gap-1 leading-none">
        <span className="t-label text-[color:var(--color-ink-soft)]">
          {label}
        </span>
        <span className="t-body-sm font-bold text-[color:var(--color-ink)]">
          {value}
        </span>
      </span>
    </button>
  );
}

export function TextInput({
  label,
  icon,
  ...props
}: {
  label: string;
  icon?: IconName;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="flex w-full flex-col gap-1.5">
      <span className="t-caption font-medium text-[color:var(--color-ink-soft)]">
        {label}
      </span>
      <span className="flex h-[52px] items-center gap-2 rounded-xl border border-[color:var(--color-border)] px-3.5 focus-within:border-[color:var(--color-ink)]">
        {icon && (
          <Icon
            name={icon}
            size={18}
            className="shrink-0 text-[color:var(--color-muted)]"
          />
        )}
        <input
          className="w-full bg-transparent t-body-sm text-[color:var(--color-ink)] outline-none placeholder:text-[color:var(--color-muted)]"
          {...props}
        />
      </span>
    </label>
  );
}

import type { ReactNode } from "react";
import Icon from "./Icon";

// The one checkbox glyph used everywhere: a 20px rounded box that fills
// ink when checked. Wrap it in a label with the text beside it.
export function CheckboxBox({
  checked,
  className = "",
}: {
  checked: boolean;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={`flex size-5 shrink-0 items-center justify-center rounded-[5px] border-2 transition-colors ${
        checked
          ? "border-[color:var(--color-ink)] bg-[color:var(--color-ink)]"
          : "border-[color:var(--color-border)] bg-white"
      } ${className}`}
    >
      {checked && (
        <Icon name="check" size={13} strokeWidth={3} className="text-white" />
      )}
    </span>
  );
}

// Checkbox with its label: a 44px-tall target so it works under a thumb.
// `inline` hugs the content (for a form option); the default spans the row
// (for a filter list).
export function Checkbox({
  label,
  checked,
  onChange,
  inline = false,
  align = "center",
}: {
  label: ReactNode;
  checked: boolean;
  onChange: (next: boolean) => void;
  inline?: boolean;
  align?: "center" | "start";
}) {
  return (
    <label
      className={`flex min-h-11 cursor-pointer gap-3 rounded-lg t-body text-[color:var(--color-ink)] transition-colors hover:bg-[color:var(--color-surface-soft)] ${
        inline ? "w-fit -mx-2 px-2" : "-mx-2 px-2"
      } ${align === "start" ? "items-start py-2.5" : "items-center"}`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
      />
      <CheckboxBox
        checked={checked}
        className={align === "start" ? "mt-0.5" : ""}
      />
      <span>{label}</span>
    </label>
  );
}

export default function CheckboxRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return <Checkbox label={label} checked={checked} onChange={onChange} />;
}

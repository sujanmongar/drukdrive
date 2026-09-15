import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Link } from "react-router-dom";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 whitespace-nowrap active:scale-[0.98] disabled:active:scale-100";

const variants: Record<Variant, string> = {
  primary:
    "bg-[color:var(--color-ink)] text-white hover:bg-black hover:shadow-lift hover:-translate-y-px",
  secondary:
    "bg-white text-[color:var(--color-ink)] border border-[color:var(--color-ink)] hover:bg-[color:var(--color-surface-soft)]",
  ghost:
    "bg-transparent text-[color:var(--color-ink)] border border-[color:var(--color-border)] hover:bg-[color:var(--color-surface-soft)]",
  danger: "bg-[color:var(--color-danger)] text-white hover:opacity-90",
};

const sizes: Record<Size, string> = {
  sm: "text-xs px-3 py-2 min-h-11 md:min-h-0",
  md: "text-sm px-4 py-2.5 min-h-11",
  lg: "text-base px-6 py-3.5",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  children: ReactNode;
  className?: string;
};

type ButtonProps = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { to?: undefined };

type LinkProps = CommonProps & { to: string; href?: undefined };

export default function Button(props: ButtonProps | LinkProps) {
  const {
    variant = "primary",
    size = "md",
    fullWidth,
    children,
    className = "",
  } = props;
  const classes = `${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? "w-full" : ""} ${className}`;

  if ("to" in props && props.to) {
    return (
      <Link to={props.to} className={classes}>
        {children}
      </Link>
    );
  }

  const {
    variant: _variant,
    size: _size,
    fullWidth: _fullWidth,
    className: _className,
    ...rest
  } = props as ButtonProps;
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}

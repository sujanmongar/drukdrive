import type { ReactNode } from "react";
import { useReveal } from "../hooks/useReveal";

// Wraps a block so it rises in when scrolled into view.
export default function Reveal({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} className={`reveal ${className}`}>
      {children}
    </div>
  );
}

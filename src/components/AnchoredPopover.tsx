import {
  useLayoutEffect,
  useState,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";

// Portals its content to <body> and positions it with `position: fixed`
// against the anchor's live bounding rect, so it is never clipped by an
// ancestor's overflow-hidden and flips above the anchor when there isn't
// enough room below the viewport edge.
export default function AnchoredPopover({
  anchorRef,
  width = 380,
  maxHeight = 420,
  align = "left",
  children,
}: {
  anchorRef: RefObject<HTMLElement | null>;
  width?: number;
  maxHeight?: number;
  align?: "left" | "right";
  children: ReactNode;
}) {
  const [style, setStyle] = useState<CSSProperties | null>(null);

  useLayoutEffect(() => {
    function update() {
      const el = anchorRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const gap = 8;
      const spaceBelow = window.innerHeight - r.bottom;
      const spaceAbove = r.top;
      const placeAbove =
        spaceBelow < maxHeight + gap && spaceAbove > spaceBelow;
      const rawLeft = align === "right" ? r.right - width : r.left;
      const left = Math.min(
        Math.max(12, rawLeft),
        window.innerWidth - width - 12,
      );

      setStyle({
        position: "fixed",
        left,
        width,
        maxHeight: Math.min(maxHeight, window.innerHeight - 24),
        ...(placeAbove
          ? { bottom: window.innerHeight - r.top + gap }
          : { top: r.bottom + gap }),
      });
    }
    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [anchorRef, width, maxHeight, align]);

  if (!style) return null;

  return createPortal(
    <div
      style={style}
      className="animate-popover z-[60] flex flex-col overflow-hidden rounded-2xl border border-[color:var(--color-border)] bg-white shadow-pop"
    >
      {children}
    </div>,
    document.body,
  );
}

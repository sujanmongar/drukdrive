import { useState, type ReactNode } from "react";

// An official brand mark from /public/logos, with a drawn fallback if the
// file is missing. Height is fixed; width follows the artwork.
export default function BrandLogo({
  name,
  alt,
  fallback,
  className = "h-6",
  wrapperClassName = "",
  dark = false,
}: {
  name: string;
  alt: string;
  fallback: ReactNode;
  /** Sizing for the mark itself (height; width follows). */
  className?: string;
  /** Display/visibility for the chip around it, e.g. "hidden sm:inline-flex"; defaults to inline-flex. */
  wrapperClassName?: string;
  /** Some marks are supplied as white artwork; give them a dark chip. */
  dark?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const ext = name === "bnb" || name === "tbank" ? "svg" : "png";
  return (
    <span
      className={`${wrapperClassName || "inline-flex"} items-center rounded-[4px] ${dark && !failed ? "bg-[#1f3f7a] px-1.5 py-0.5" : ""}`}
    >
      {failed ? (
        fallback
      ) : (
        <img
          src={`/logos/${name}.${ext}`}
          alt={alt}
          loading="lazy"
          onError={() => setFailed(true)}
          className={`${className} w-auto object-contain`}
        />
      )}
    </span>
  );
}

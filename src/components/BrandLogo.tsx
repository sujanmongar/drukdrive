import { useState, type ReactNode } from "react";

// An official brand mark from /public/logos, with a drawn fallback if the
// file is missing. Height is fixed; width follows the artwork.
export default function BrandLogo({
  name,
  alt,
  fallback,
  className = "h-6",
  dark = false,
}: {
  name: string;
  alt: string;
  fallback: ReactNode;
  className?: string;
  /** Some marks are supplied as white artwork; give them a dark chip. */
  dark?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const ext = name === "bnb" || name === "tbank" ? "svg" : "png";
  if (failed) return <>{fallback}</>;
  return (
    <span className={`inline-flex items-center rounded-[4px] ${dark ? "bg-[#1f3f7a] px-1.5 py-0.5" : ""}`}>
      <img src={`/logos/${name}.${ext}`} alt={alt} loading="lazy" onError={() => setFailed(true)} className={`${className} w-auto object-contain`} />
    </span>
  );
}

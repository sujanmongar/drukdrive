import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

export default function PageShell({
  children,
  noFooter = false,
  transparentHeader = false,
  header,
}: {
  children: ReactNode;
  noFooter?: boolean;
  /** Header renders with no background — for a page whose hero already
   * paints its own background right up to the top of the viewport. */
  transparentHeader?: boolean;
  /** Replaces the default logo/nav Header entirely — for a page with its own
   * contextual top bar (e.g. search results' trip-summary bar). */
  header?: ReactNode;
}) {
  // Keyed on the path so each navigation replays the entrance.
  const { pathname } = useLocation();

  return (
    <div className="flex min-h-svh flex-col bg-white">
      {header ?? <Header transparent={transparentHeader} />}
      <main key={pathname} className="animate-page-in flex-1">
        {children}
      </main>
      {!noFooter && <Footer />}
    </div>
  );
}

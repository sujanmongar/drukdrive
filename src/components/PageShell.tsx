import { useEffect, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

let lastSection = "";

export default function PageShell({
  children,
  noFooter = false,
  transparentHeader = false,
  stickyHeader = false,
  header,
}: {
  children: ReactNode;
  noFooter?: boolean;
  /** Header renders with no background — for a page whose hero already
   * paints its own background right up to the top of the viewport. */
  transparentHeader?: boolean;
  /** Keeps the logo bar pinned while a long page (checkout) scrolls. */
  stickyHeader?: boolean;
  /** Replaces the default logo/nav Header entirely — for a page with its own
   * contextual top bar (e.g. search results' trip-summary bar). */
  header?: ReactNode;
}) {
  // Every page renders its own PageShell, so <main> is remounted on each
  // navigation and a key alone cannot suppress the entrance. Remember the
  // last section at module level (it survives remounts) and only play the
  // entrance when the section changes — switching tabs inside /account,
  // /provider or /checkout must not read as a page reload.
  const { pathname } = useLocation();
  const section = pathname.split("/")[1] || "home";
  // Read during render, write after commit: a render-time write would be
  // seen by React's second dev render pass and flip the result to false.
  const enteringNewSection = lastSection !== section;
  useEffect(() => {
    lastSection = section;
  }, [section]);

  return (
    <div className="flex min-h-svh flex-col bg-white">
      {header ?? (
        <Header transparent={transparentHeader} sticky={stickyHeader} />
      )}
      <main className={`flex-1 ${enteringNewSection ? "animate-page-in" : ""}`}>
        {children}
      </main>
      {!noFooter && <Footer />}
    </div>
  );
}

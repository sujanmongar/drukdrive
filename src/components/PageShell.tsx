import type { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";

export default function PageShell({
  children,
  noFooter = false,
  transparentHeader = false,
}: {
  children: ReactNode;
  noFooter?: boolean;
  /** Header renders with no background — for a page whose hero already
   * paints its own background right up to the top of the viewport. */
  transparentHeader?: boolean;
}) {
  return (
    <div className="flex min-h-svh flex-col bg-white">
      <Header transparent={transparentHeader} />
      <main className="flex-1">{children}</main>
      {!noFooter && <Footer />}
    </div>
  );
}

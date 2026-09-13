import type { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";

export default function PageShell({
  children,
  noFooter = false,
}: {
  children: ReactNode;
  noFooter?: boolean;
}) {
  return (
    <div className="flex min-h-svh flex-col bg-white">
      <Header />
      <main className="flex-1">{children}</main>
      {!noFooter && <Footer />}
    </div>
  );
}

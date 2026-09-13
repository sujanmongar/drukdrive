import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import ScrollToTop from "./components/ScrollToTop.tsx";
import { AuthProvider } from "./lib/auth.tsx";
import { CurrencyProvider } from "./lib/currency.tsx";
import { WishlistProvider } from "./lib/wishlist.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CurrencyProvider>
          <WishlistProvider>
            <ScrollToTop />
            <App />
          </WishlistProvider>
        </CurrencyProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);

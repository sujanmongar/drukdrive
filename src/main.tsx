import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import ScrollToTop from "./components/ScrollToTop.tsx";
import { AuthProvider } from "./lib/auth.tsx";
import { CurrencyProvider } from "./lib/currency.tsx";
import { LanguageProvider } from "./lib/language.tsx";
import { ClientTypeProvider } from "./lib/clientType.tsx";
import { WishlistProvider } from "./lib/wishlist.tsx";
import { CurrentUserProvider } from "./lib/currentUser.tsx";
import { DriverVehiclesProvider } from "./lib/driverVehicles.tsx";
import { ReviewsProvider } from "./lib/reviews.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CurrentUserProvider>
          <LanguageProvider>
            <ClientTypeProvider>
              <CurrencyProvider>
                <WishlistProvider>
                  <DriverVehiclesProvider>
                    <ReviewsProvider>
                      <ScrollToTop />
                      <App />
                    </ReviewsProvider>
                  </DriverVehiclesProvider>
                </WishlistProvider>
              </CurrencyProvider>
            </ClientTypeProvider>
          </LanguageProvider>
        </CurrentUserProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);

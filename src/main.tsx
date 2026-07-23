
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.tsx";
import "./styles/index.css";
import "./i18n/i18n";

function OAuthConsentRedirect() {
  // Supabase OAuth consent screen redirects here after Google auth.
  // We render the normal App which picks up the session from the URL hash
  // and handles the auth callback automatically via getCurrentUser().
  return <App />;
}

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/oauth/consent" element={<OAuthConsentRedirect />} />
      <Route path="*" element={<App />} />
    </Routes>
  </BrowserRouter>
);

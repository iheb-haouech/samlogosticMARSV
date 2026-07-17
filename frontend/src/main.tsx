import ReactDOM from "react-dom/client";
import axios from "axios";
import App from "./App.tsx";
import "./styles/colors/colors.scss";
import "./styles/typography/headings.scss";
import "./styles/typography/text.scss";
import "./main.scss";
import { store } from "./store/store.ts";
import { Provider } from "react-redux";
import { AlertProvider } from "./Alert/AlertProvider.tsx";
import NotificationBanner from "./components/atoms/NotificationBanner/NotificationBanner";

// Global handler for expired/invalid sessions: on any 401, clear the stored
// tokens and send the user back to the login page instead of leaving the UI
// in a "logged in but every request fails" state.
const handleUnauthorized = () => {
  const onLoginPage = window.location.pathname.startsWith("/login");
  if (!onLoginPage && localStorage.getItem("accessToken")) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.location.assign("/login");
  }
};

// Public API paths that must never trigger the global logout, even if they
// return a 401 (e.g. public order tracking, auth endpoints).
const PUBLIC_API_PATHS = [
  "/orders/track/",
  "/auth/login",
  "/auth/register",
  "/auth/refresh-token",
  "/contact/message",
];

const isPublicApiUrl = (url: string): boolean =>
  PUBLIC_API_PATHS.some((path) => url.includes(path));

// Covers axios-based requests (e.g. direct axios calls).
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const url: string = error?.config?.url ?? "";
    if (error?.response?.status === 401 && !isPublicApiUrl(url)) {
      handleUnauthorized();
    }
    return Promise.reject(error);
  },
);

// Covers fetch-based requests (the generated API client uses fetch).
const originalFetch = window.fetch.bind(window);
window.fetch = async (...args: Parameters<typeof fetch>) => {
  const response = await originalFetch(...args);
  const requestUrl =
    typeof args[0] === "string"
      ? args[0]
      : args[0] instanceof Request
        ? args[0].url
        : String(args[0]);
  if (response.status === 401 && !isPublicApiUrl(requestUrl)) {
    handleUnauthorized();
  }
  return response;
};

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    registrations.forEach((registration) => {
      registration.unregister().catch(() => {
        // ignore
      });
    });
  });
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <AlertProvider>
      <NotificationBanner />
      <App />
    </AlertProvider>
  </Provider>,
);
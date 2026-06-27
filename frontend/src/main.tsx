import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./styles/colors/colors.scss";
import "./styles/typography/headings.scss";
import "./styles/typography/text.scss";
import "./main.scss";
import { store } from "./store/store.ts";
import { Provider } from "react-redux";
import { AlertProvider } from "./Alert/AlertProvider.tsx";
import NotificationBanner from "./components/atoms/NotificationBanner/NotificationBanner";

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
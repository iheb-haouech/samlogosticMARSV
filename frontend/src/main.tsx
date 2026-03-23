import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./styles/colors/colors.scss";
import "./styles/typography/headings.scss";
import "./styles/typography/text.scss";
import "./main.scss";
import { store } from "./store/store.ts";
import { Provider } from "react-redux";
import { AlertProvider } from "./Alert/AlertProvider.tsx";
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AlertProvider>
      <Provider store={store}>
        <App />
      </Provider>
    </AlertProvider>
  </React.StrictMode>,
);

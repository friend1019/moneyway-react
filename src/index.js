// index.js
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";

// 🔹 Liveblocks import
import { LiveblocksProvider } from "@liveblocks/react";

// ✅ 여기서 바로 publicApiKey 전달

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <LiveblocksProvider publicApiKey="pk_dev_KEJNdBlEPnaJ0WZT8seD18Vgan45CBtjXZkYGsEKUnwv9GJ3ioJHToAXUktPpNyW">
        <App />
      </LiveblocksProvider>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();

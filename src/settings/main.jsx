/* global TrelloPowerUp */
import React from "react";
import ReactDOM from "react-dom/client";
import SettingsPopup from "./SettingsPopup.jsx";

const t = typeof window.TrelloPowerUp !== "undefined" && window.TrelloPowerUp.iframe
  ? window.TrelloPowerUp.iframe()
  : {
      get: (scope, visibility, key) => Promise.resolve(localStorage.getItem(`mock_${scope}_${key}`)),
      set: (scope, visibility, key, val) => {
        localStorage.setItem(`mock_${scope}_${key}`, val);
        return Promise.resolve();
      },
      remove: (scope, visibility, key) => {
        localStorage.removeItem(`mock_${scope}_${key}`);
        return Promise.resolve();
      },
      sizeTo: () => Promise.resolve(),
      closePopup: () => window.close(),
      popup: (opts) => {
        console.log("Mock popup:", opts);
        return Promise.resolve();
      },
    };

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <SettingsPopup t={t} />
  </React.StrictMode>
);

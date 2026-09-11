/* global TrelloPowerUp */
import React from "react";
import ReactDOM from "react-dom/client";
import PrioritizeModal from "./PrioritizeModal.jsx";

const t =
  typeof window.TrelloPowerUp !== "undefined" && window.TrelloPowerUp.iframe
    ? window.TrelloPowerUp.iframe()
    : {
        cards: () => Promise.resolve([]),
        get: (scope, visibility, key) =>
          Promise.resolve(localStorage.getItem(`mock_${scope}_${key}`)),
        set: (scope, visibility, key, val) => {
          localStorage.setItem(`mock_${scope}_${key}`, JSON.stringify(val));
          return Promise.resolve();
        },
        sizeTo: () => Promise.resolve(),
        closeModal: () => {
          if (window.parent && window.parent !== window) {
            window.parent.postMessage("closeModal", "*");
          } else {
            window.close();
          }
        },
        closePopup: () => window.close(),
      };

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <PrioritizeModal t={t} />
  </React.StrictMode>
);

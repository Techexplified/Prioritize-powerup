import React, { useEffect, useRef, useState } from "react";
import {
  APP_KEY,
  APP_NAME,
  AUTH_MESSAGE_SOURCE,
  buildAuthorizeUrl,
  saveToken,
} from "../lib/auth.js";
import { styles, successStyles } from "../lib/ui.js";
import { CheckIcon, SpinnerIcon, LockIcon } from "../ui/icons.jsx";

export default function AuthPopup({ t }) {
  const [status, setStatus] = useState("idle"); // idle | waiting | success | error
  const popupRef = useRef(null);

  // Listen for the token posted back by authorized.html once the member approves access
  useEffect(() => {
    async function handleMessage(event) {
      // The token is a credential: only trust messages from our own origin
      if (event.origin !== window.location.origin) return;
      if (!event.data || event.data.source !== AUTH_MESSAGE_SOURCE) return;

      if (!event.data.token) {
        setStatus("error");
        return;
      }

      try {
        await saveToken(t, event.data.token);
        setStatus("success");
      } catch (err) {
        console.error("Failed to save auth token:", err);
        setStatus("error");
      }
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [t]);

  // Dynamically size the popup to content
  useEffect(() => {
    if (t && typeof t.sizeTo === "function") {
      t.sizeTo("#root").catch(() => {});
    }
  }, [t, status]);

  function handleAuthorize() {
    if (!APP_KEY) {
      alert("Missing VITE_TRELLO_APP_KEY in environment configuration. Please set it in .env");
      return;
    }

    setStatus("waiting");
    const returnUrl = `${window.location.origin}/authorized.html`;
    popupRef.current = window.open(
      buildAuthorizeUrl(returnUrl),
      "trelloAuth",
      "width=540,height=720,menubar=no,toolbar=no"
    );

    // If popup was blocked by the browser
    if (!popupRef.current || popupRef.current.closed || typeof popupRef.current.closed === "undefined") {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div style={{ ...successStyles.wrapper, ...successStyles.centered }}>
        <div style={successStyles.iconCircle}>
          <CheckIcon width={24} height={24} strokeWidth={2.5} />
        </div>
        <p style={successStyles.title}>You're Connected</p>
        <p style={successStyles.body}>
          {APP_NAME} is now authorized to prioritize tasks and update card rankings on this board.
        </p>
        <button
          type="button"
          onClick={() => t.closePopup()}
          style={successStyles.button}
        >
          Continue
        </button>
      </div>
    );
  }

  const copy = {
    idle: `Connect your Trello account so ${APP_NAME} can prioritize and manage tasks on this board.`,
    waiting: "Waiting for you to approve access in the authorization window…",
    error: "Connection was interrupted or popups were blocked. Please allow popups and try again.",
  };

  return (
    <div style={styles.wrapper}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
        <LockIcon width={18} height={18} style={{ color: "#579DFF" }} />
        <span style={{ fontSize: 13, fontWeight: 600, color: "#F7F8F9" }}>
          Authorize {APP_NAME}
        </span>
      </div>

      <p style={styles.body}>{copy[status]}</p>

      {!APP_KEY && (
        <div style={{
          background: "rgba(248, 113, 104, 0.12)",
          border: "1px solid rgba(248, 113, 104, 0.3)",
          borderRadius: 6,
          padding: "8px 10px",
          fontSize: 12,
          color: "#F87168",
          marginBottom: 12,
        }}>
          ⚠️ <strong>VITE_TRELLO_APP_KEY</strong> is not set. Please define it in your <code>.env</code> file.
        </div>
      )}

      {status === "waiting" && (
        <div style={{ display: "flex", justifyContent: "center", margin: "14px 0" }}>
          <SpinnerIcon width={26} height={26} style={{ color: "#579DFF" }} />
        </div>
      )}

      <button
        type="button"
        onClick={handleAuthorize}
        disabled={status === "waiting"}
        style={{
          ...styles.button,
          ...(status === "waiting" ? styles.buttonBusy : {}),
        }}
      >
        {status === "waiting" ? "Connecting to Trello…" : "Connect Trello Account"}
      </button>

      {status === "error" && (
        <button
          type="button"
          onClick={handleAuthorize}
          style={styles.subtleButton}
        >
          Try again
        </button>
      )}
    </div>
  );
}

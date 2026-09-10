import React, { useEffect, useLayoutEffect, useState } from "react";
import { getCurrentMember, NOT_AUTHORIZED } from "../lib/trelloApi.js";
import { clearToken, APP_NAME } from "../lib/auth.js";
import { CheckIcon, SpinnerIcon, UserIcon } from "../ui/icons.jsx";
import "./settings.css";

export default function SettingsPopup({ t }) {
  const [status, setStatus] = useState("checking"); // checking | connected | error
  const [member, setMember] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const mem = await getCurrentMember(t);
        if (!mounted) return;
        setMember(mem);
        setStatus("connected");
      } catch (e) {
        if (!mounted) return;
        if (e.message === NOT_AUTHORIZED) {
          return requireAuth();
        }
        setStatus("error");
      }
    })();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useLayoutEffect(() => {
    if (t && typeof t.sizeTo === "function") {
      t.sizeTo("#root").catch(() => {});
    }
  }, [t, status]);

  useEffect(() => {
    const el = document.getElementById("root");
    if (!el || typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver(() => {
      if (t && typeof t.sizeTo === "function") {
        t.sizeTo("#root").catch(() => {});
      }
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [t]);

  function requireAuth() {
    return t.popup({
      title: `Authorize ${APP_NAME}`,
      url: "./auth.html",
      height: 260,
    });
  }

  async function handleDisconnect() {
    await clearToken(t);
    requireAuth();
  }

  if (status === "checking") {
    return (
      <div className="prio-settings-root">
        <div className="prio-loading-state">
          <SpinnerIcon width={24} height={24} style={{ color: "#579DFF" }} />
          <p className="prio-hint-text">Verifying Trello connection…</p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="prio-settings-root">
        <div className="prio-error-state">
          <p className="prio-error-text">Could not verify your Trello connection.</p>
          <button
            type="button"
            className="prio-btn-primary"
            onClick={requireAuth}
          >
            Reconnect Account
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="prio-settings-root">
      <div className="prio-icon-badge">
        <CheckIcon width={24} height={24} strokeWidth={2.4} />
      </div>

      <h3 className="prio-title">Connected to Trello</h3>
      <p className="prio-desc">
        {APP_NAME} is active and authorized for your account.
      </p>

      {member && (
        <div className="prio-user-card">
          <div className="prio-avatar">
            {member.avatarUrl ? (
              <img src={`${member.avatarUrl}/50.png`} alt={member.fullName || "User"} />
            ) : (
              member.initials || <UserIcon width={20} height={20} />
            )}
          </div>
          <div className="prio-user-info">
            <div className="prio-user-name">{member.fullName || "Trello Member"}</div>
            {member.username && <div className="prio-user-handle">@{member.username}</div>}
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => t.closePopup()}
        className="prio-btn-primary"
      >
        Done
      </button>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "12px", padding: "0 4px" }}>
        <button
          type="button"
          onClick={requireAuth}
          className="prio-link-subtle"
        >
          Reconnect
        </button>
        <button
          type="button"
          onClick={handleDisconnect}
          className="prio-link-subtle"
          style={{ color: "#F87168" }}
        >
          Disconnect
        </button>
      </div>
    </div>
  );
}

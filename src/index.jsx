import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { APP_KEY, APP_NAME, getToken, clearToken } from "./lib/auth.js";

// If loaded inside an iframe by Trello as the Power-Up connector URL:
if (window.self !== window.top) {
  import("./powerup/main.js");
}

function App() {
  const [token, setToken] = useState(null);
  const [activeTab, setActiveTab] = useState("prioritize-preview");

  useEffect(() => {
    getToken().then(setToken);
  }, []);

  async function handleResetToken() {
    await clearToken();
    setToken(null);
  }

  return (
    <div style={{ maxWidth: "960px", margin: "0 auto", padding: "40px 24px" }}>
      {/* Header */}
      <header style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px", borderBottom: "1px solid #22272b", paddingBottom: "24px" }}>
        <img src="./icon.svg" alt="Prioritize Logo" style={{ width: 44, height: 44 }} />
        <div>
          <h1 style={{ margin: 0, fontSize: "24px", fontWeight: 700, color: "#F7F8F9" }}>
            {APP_NAME} Power-Up Dev Hub
          </h1>
          <p style={{ margin: "4px 0 0", color: "#9FADBC", fontSize: "14px" }}>
            Trello Power-Up Authentication & Development Console
          </p>
        </div>
      </header>

      {/* Configuration Status Card */}
      <div style={{
        background: "#1D2125",
        border: "1px solid #333C44",
        borderRadius: "10px",
        padding: "20px",
        marginBottom: "24px",
      }}>
        <h2 style={{ fontSize: "16px", margin: "0 0 14px", color: "#F7F8F9" }}>Configuration Status</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
          <div style={{ background: "#22272B", padding: "14px", borderRadius: "8px", border: "1px solid #2C333A" }}>
            <div style={{ fontSize: "12px", color: "#9FADBC", textTransform: "uppercase", fontWeight: 600 }}>Trello API Key</div>
            <div style={{ marginTop: "6px", fontSize: "14px", fontFamily: "monospace", color: APP_KEY ? "#4BCE97" : "#F87168" }}>
              {APP_KEY ? `${APP_KEY.substring(0, 8)}••••••••••••` : "Not Configured (Check .env)"}
            </div>
          </div>

          <div style={{ background: "#22272B", padding: "14px", borderRadius: "8px", border: "1px solid #2C333A" }}>
            <div style={{ fontSize: "12px", color: "#9FADBC", textTransform: "uppercase", fontWeight: 600 }}>Local Auth State</div>
            <div style={{ marginTop: "6px", fontSize: "14px", color: token ? "#4BCE97" : "#85B8FF", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span>{token ? "Connected (Token Cached)" : "Not Connected"}</span>
              {token && (
                <button
                  onClick={handleResetToken}
                  style={{
                    background: "none",
                    border: "1px solid #454F59",
                    color: "#F87168",
                    padding: "3px 8px",
                    borderRadius: "4px",
                    fontSize: "11px",
                    cursor: "pointer",
                  }}
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
        {[
          { id: "prioritize-preview", label: "Board Prioritize UI (Reference)" },
          { id: "overview", label: "Overview & Endpoints" },
          { id: "auth-preview", label: "Preview Auth Popup" },
          { id: "settings-preview", label: "Preview Settings Popup" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: "8px 16px",
              borderRadius: "6px",
              border: "1px solid",
              borderColor: activeTab === tab.id ? "#579DFF" : "#333C44",
              background: activeTab === tab.id ? "#1C2B41" : "#1D2125",
              color: activeTab === tab.id ? "#579DFF" : "#9FADBC",
              fontWeight: 600,
              fontSize: "13px",
              cursor: "pointer",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "prioritize-preview" && (
        <div style={{ background: "#1D2125", border: "1px solid #333C44", borderRadius: "10px", padding: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <div>
              <h2 style={{ fontSize: "16px", margin: 0, color: "#F7F8F9" }}>Prioritize Board Modal Preview (/prioritize.html)</h2>
              <p style={{ margin: "4px 0 0", color: "#9FADBC", fontSize: "13px" }}>
                Interactive live preview of the Prioritize Power-Up modal requested in reference.
              </p>
            </div>
            <a href="/prioritize.html" target="_blank" rel="noreferrer" style={{ color: "#579DFF", fontSize: "13px", fontWeight: 600, textDecoration: "none" }}>
              Open Full Screen ↗
            </a>
          </div>
          <div style={{ display: "flex", justifyContent: "center", background: "#060a14", padding: "20px", borderRadius: "12px", border: "1px solid #22272B" }}>
            <iframe
              src="/prioritize.html"
              title="Prioritize Modal Preview"
              style={{ width: "100%", maxWidth: "680px", height: "720px", border: "1px solid #333C44", borderRadius: "10px", background: "#1D2125" }}
            />
          </div>
        </div>
      )}

      {activeTab === "overview" && (
        <div style={{ background: "#1D2125", border: "1px solid #333C44", borderRadius: "10px", padding: "24px" }}>
          <h2 style={{ fontSize: "17px", marginTop: 0, color: "#F7F8F9" }}>Power-Up Endpoints for Trello Admin</h2>
          <p style={{ color: "#9FADBC", fontSize: "13.5px", lineHeight: 1.6 }}>
            When registering your Power-Up at <a href="https://trello.com/power-ups/admin" target="_blank" rel="noreferrer" style={{ color: "#579DFF" }}>trello.com/power-ups/admin</a>, use the following endpoints:
          </p>

          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "16px", fontSize: "13px" }}>
            <thead>
              <tr style={{ textAlign: "left", borderBottom: "1px solid #333C44", color: "#9FADBC" }}>
                <th style={{ padding: "10px 8px" }}>Endpoint</th>
                <th style={{ padding: "10px 8px" }}>URL Path</th>
                <th style={{ padding: "10px 8px" }}>Purpose</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: "1px solid #22272B" }}>
                <td style={{ padding: "12px 8px", fontWeight: 600, color: "#F7F8F9" }}>Board Prioritize Modal</td>
                <td style={{ padding: "12px 8px", fontFamily: "monospace", color: "#579DFF" }}>/prioritize.html</td>
                <td style={{ padding: "12px 8px", color: "#9FADBC" }}>Main modal for scoring and prioritizing board cards</td>
              </tr>
              <tr style={{ borderBottom: "1px solid #22272B" }}>
                <td style={{ padding: "12px 8px", fontWeight: 600, color: "#F7F8F9" }}>Connector URL (iframe)</td>
                <td style={{ padding: "12px 8px", fontFamily: "monospace", color: "#579DFF" }}>/powerup.html</td>
                <td style={{ padding: "12px 8px", color: "#9FADBC" }}>Main Trello Power-Up capability handler</td>
              </tr>
              <tr style={{ borderBottom: "1px solid #22272B" }}>
                <td style={{ padding: "12px 8px", fontWeight: 600, color: "#F7F8F9" }}>Authorization Popup</td>
                <td style={{ padding: "12px 8px", fontFamily: "monospace", color: "#579DFF" }}>/auth.html</td>
                <td style={{ padding: "12px 8px", color: "#9FADBC" }}>Popup prompt shown to members when connecting</td>
              </tr>
              <tr style={{ borderBottom: "1px solid #22272B" }}>
                <td style={{ padding: "12px 8px", fontWeight: 600, color: "#F7F8F9" }}>OAuth Return URL</td>
                <td style={{ padding: "12px 8px", fontFamily: "monospace", color: "#579DFF" }}>/authorized.html</td>
                <td style={{ padding: "12px 8px", color: "#9FADBC" }}>Must be added to Allowed Origins in Trello Admin</td>
              </tr>
              <tr>
                <td style={{ padding: "12px 8px", fontWeight: 600, color: "#F7F8F9" }}>Settings Popup</td>
                <td style={{ padding: "12px 8px", fontFamily: "monospace", color: "#579DFF" }}>/settings.html</td>
                <td style={{ padding: "12px 8px", color: "#9FADBC" }}>Account status, Reconnect & Disconnect actions</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "auth-preview" && (
        <div style={{ background: "#1D2125", border: "1px solid #333C44", borderRadius: "10px", padding: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h2 style={{ fontSize: "16px", margin: 0, color: "#F7F8F9" }}>Auth Popup Preview (/auth.html)</h2>
            <a href="/auth.html" target="_blank" rel="noreferrer" style={{ color: "#579DFF", fontSize: "12.5px" }}>Open in new tab ↗</a>
          </div>
          <div style={{ display: "flex", justifyContent: "center", background: "#0F1214", padding: "24px", borderRadius: "8px" }}>
            <iframe
              src="/auth.html"
              title="Auth Popup Preview"
              style={{ width: "360px", height: "260px", border: "1px solid #333C44", borderRadius: "8px", background: "#1D2125" }}
            />
          </div>
        </div>
      )}

      {activeTab === "settings-preview" && (
        <div style={{ background: "#1D2125", border: "1px solid #333C44", borderRadius: "10px", padding: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h2 style={{ fontSize: "16px", margin: 0, color: "#F7F8F9" }}>Settings Popup Preview (/settings.html)</h2>
            <a href="/settings.html" target="_blank" rel="noreferrer" style={{ color: "#579DFF", fontSize: "12.5px" }}>Open in new tab ↗</a>
          </div>
          <div style={{ display: "flex", justifyContent: "center", background: "#0F1214", padding: "24px", borderRadius: "8px" }}>
            <iframe
              src="/settings.html"
              title="Settings Popup Preview"
              style={{ width: "360px", height: "300px", border: "1px solid #333C44", borderRadius: "8px", background: "#1D2125" }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

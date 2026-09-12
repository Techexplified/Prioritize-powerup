import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { APP_KEY, APP_NAME, getToken, clearToken } from "./lib/auth.js";
import KanbanBoardScreen from "./prioritize/KanbanBoardScreen.jsx";
import CardPrioritizeModal from "./prioritize/CardPrioritizeModal.jsx";

function App() {
  const [token, setToken] = useState(null);
  const [activeTab, setActiveTab] = useState("kanban-screen");
  const [cardModalSample, setCardModalSample] = useState({
    id: "c1",
    name: "New checkout",
    framework: "RICE",
    reach: 800,
    impact: 3,
    confidence: 0.8,
    effort: 4,
    score: 480,
  });

  useEffect(() => {
    getToken().then(setToken);
  }, []);

  async function handleResetToken() {
    await clearToken();
    setToken(null);
  }

  return (
    <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "30px 24px" }}>
      {/* Header */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "24px",
          borderBottom: "1px solid #22272b",
          paddingBottom: "18px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "10px",
              background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
              boxShadow: "0 4px 14px rgba(37, 99, 235, 0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: "20px",
              fontWeight: 800,
            }}
          >
            ✦
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: "22px", fontWeight: 700, color: "#F7F8F9" }}>
              {APP_NAME} Power-Up Dev Hub
            </h1>
            <p style={{ margin: "3px 0 0", color: "#9FADBC", fontSize: "13px" }}>
              Trello Power-Up Multi-Framework Scoring & Interactive Kanban Board
            </p>
          </div>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <a
            href="/prioritize.html?view=board"
            target="_blank"
            rel="noreferrer"
            style={{
              background: "#1C2B41",
              border: "1px solid #579DFF",
              color: "#579DFF",
              padding: "7px 14px",
              borderRadius: "6px",
              fontSize: "12.5px",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Open Kanban Board ↗
          </a>
          <a
            href="/prioritize.html?view=card"
            target="_blank"
            rel="noreferrer"
            style={{
              background: "#1D2125",
              border: "1px solid #333C44",
              color: "#F7F8F9",
              padding: "7px 14px",
              borderRadius: "6px",
              fontSize: "12.5px",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Open Card Modal ↗
          </a>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
        {[
          { id: "kanban-screen", label: "📋 Screen 2: Kanban Prioritization Board" },
          { id: "card-modal-screen", label: "🎯 Screen 1: Card Scoring Modal (RICE / WSJF / MOSCOW)" },
          { id: "iframe-preview", label: "🖥️ Live /prioritize.html Iframe" },
          { id: "overview", label: "⚙️ Power-Up Endpoints & Admin" },
          { id: "auth-settings", label: "🔑 Auth & Settings Popups" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: "9px 16px",
              borderRadius: "6px",
              border: "1px solid",
              borderColor: activeTab === tab.id ? "#579DFF" : "#333C44",
              background: activeTab === tab.id ? "#1C2B41" : "#1D2125",
              color: activeTab === tab.id ? "#579DFF" : "#9FADBC",
              fontWeight: 600,
              fontSize: "13px",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: KANBAN BOARD SCREEN (IMAGE 2) */}
      {activeTab === "kanban-screen" && (
        <div
          style={{
            background: "#070b14",
            border: "1px solid #1a253c",
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
          }}
        >
          <div
            style={{
              background: "#0a101f",
              padding: "10px 18px",
              borderBottom: "1px solid #1a253c",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: "13px", color: "#94a3b8", fontWeight: 600 }}>
              Live Interactive Screen 2 Preview (Click any card to open the Screen 1 scoring modal)
            </span>
            <a
              href="/prioritize.html?view=board"
              target="_blank"
              rel="noreferrer"
              style={{ color: "#579DFF", fontSize: "12.5px", fontWeight: 600, textDecoration: "none" }}
            >
              Open Standalone ↗
            </a>
          </div>
          <div style={{ height: "760px" }}>
            <KanbanBoardScreen />
          </div>
        </div>
      )}

      {/* TAB 2: CARD PRIORITIZATION MODAL (IMAGE 1) */}
      {activeTab === "card-modal-screen" && (
        <div
          style={{
            background: "#1D2125",
            border: "1px solid #333C44",
            borderRadius: "12px",
            padding: "24px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <div>
              <h2 style={{ fontSize: "16px", margin: 0, color: "#F7F8F9" }}>
                Card Prioritization Modal (Image 1 Exact Reference)
              </h2>
              <p style={{ margin: "4px 0 0", color: "#9FADBC", fontSize: "13px" }}>
                Interactive live preview with RICE, Effort vs Impact, WSJF, MoSCoW, and ICE framework calculations.
              </p>
            </div>
            <a
              href="/prioritize.html?view=card"
              target="_blank"
              rel="noreferrer"
              style={{ color: "#579DFF", fontSize: "12.5px", fontWeight: 600, textDecoration: "none" }}
            >
              Open Standalone Modal ↗
            </a>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              background: "#050811",
              padding: "40px 20px",
              borderRadius: "12px",
              border: "1px solid #1a253c",
            }}
          >
            <CardPrioritizeModal
              card={cardModalSample}
              onApply={(updated) => setCardModalSample(updated)}
            />
          </div>
        </div>
      )}

      {/* TAB 3: LIVE IFRAME PREVIEW */}
      {activeTab === "iframe-preview" && (
        <div style={{ background: "#1D2125", border: "1px solid #333C44", borderRadius: "10px", padding: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <div>
              <h2 style={{ fontSize: "16px", margin: 0, color: "#F7F8F9" }}>
                Prioritize Modal Iframe Preview (/prioritize.html)
              </h2>
              <p style={{ margin: "4px 0 0", color: "#9FADBC", fontSize: "13px" }}>
                Embedded Trello Power-Up modal environment with view toggling and set evaluation.
              </p>
            </div>
            <a
              href="/prioritize.html"
              target="_blank"
              rel="noreferrer"
              style={{ color: "#579DFF", fontSize: "13px", fontWeight: 600, textDecoration: "none" }}
            >
              Open Full Screen ↗
            </a>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              background: "#060a14",
              padding: "16px",
              borderRadius: "12px",
              border: "1px solid #22272B",
            }}
          >
            <iframe
              src="/prioritize.html"
              title="Prioritize Preview"
              style={{
                width: "100%",
                maxWidth: "100%",
                height: "760px",
                border: "1px solid #333C44",
                borderRadius: "10px",
                background: "#070b14",
              }}
            />
          </div>
        </div>
      )}

      {/* TAB 4: OVERVIEW & ENDPOINTS */}
      {activeTab === "overview" && (
        <div style={{ background: "#1D2125", border: "1px solid #333C44", borderRadius: "10px", padding: "24px" }}>
          <h2 style={{ fontSize: "17px", marginTop: 0, color: "#F7F8F9" }}>Power-Up Endpoints for Trello Admin</h2>
          <p style={{ color: "#9FADBC", fontSize: "13.5px", lineHeight: 1.6 }}>
            When registering your Power-Up at{" "}
            <a
              href="https://trello.com/power-ups/admin"
              target="_blank"
              rel="noreferrer"
              style={{ color: "#579DFF" }}
            >
              trello.com/power-ups/admin
            </a>
            , use the following endpoints:
          </p>

          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "16px", fontSize: "13px" }}>
            <thead>
              <tr style={{ textAlign: "left", borderBottom: "1px solid #333C44", color: "#9FADBC" }}>
                <th style={{ padding: "10px 8px" }}>Capability</th>
                <th style={{ padding: "10px 8px" }}>Endpoint URL</th>
                <th style={{ padding: "10px 8px" }}>Features</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: "1px solid #22272B" }}>
                <td style={{ padding: "12px 8px", fontWeight: 600, color: "#F7F8F9" }}>Board Prioritize Screen</td>
                <td style={{ padding: "12px 8px", fontFamily: "monospace", color: "#579DFF" }}>/prioritize.html?view=board</td>
                <td style={{ padding: "12px 8px", color: "#9FADBC" }}>Interactive 4-column Kanban board with score badges and rank sorting</td>
              </tr>
              <tr style={{ borderBottom: "1px solid #22272B" }}>
                <td style={{ padding: "12px 8px", fontWeight: 600, color: "#F7F8F9" }}>Card Prioritize Modal</td>
                <td style={{ padding: "12px 8px", fontFamily: "monospace", color: "#579DFF" }}>/prioritize.html?view=card</td>
                <td style={{ padding: "12px 8px", color: "#9FADBC" }}>Card scoring modal with RICE, WSJF, MoSCoW, ICE, and Effort/Impact</td>
              </tr>
              <tr style={{ borderBottom: "1px solid #22272B" }}>
                <td style={{ padding: "12px 8px", fontWeight: 600, color: "#F7F8F9" }}>Power-Up Connector</td>
                <td style={{ padding: "12px 8px", fontFamily: "monospace", color: "#579DFF" }}>/powerup.html</td>
                <td style={{ padding: "12px 8px", color: "#9FADBC" }}>Handles card-badges, card-detail-badges, board-buttons, card-buttons</td>
              </tr>
              <tr style={{ borderBottom: "1px solid #22272B" }}>
                <td style={{ padding: "12px 8px", fontWeight: 600, color: "#F7F8F9" }}>Authorization Popup</td>
                <td style={{ padding: "12px 8px", fontFamily: "monospace", color: "#579DFF" }}>/auth.html</td>
                <td style={{ padding: "12px 8px", color: "#9FADBC" }}>Member token authorization</td>
              </tr>
              <tr>
                <td style={{ padding: "12px 8px", fontWeight: 600, color: "#F7F8F9" }}>Settings Popup</td>
                <td style={{ padding: "12px 8px", fontFamily: "monospace", color: "#579DFF" }}>/settings.html</td>
                <td style={{ padding: "12px 8px", color: "#9FADBC" }}>Account details, reconnect, and disconnect</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 5: AUTH & SETTINGS */}
      {activeTab === "auth-settings" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          <div style={{ background: "#1D2125", border: "1px solid #333C44", borderRadius: "10px", padding: "24px" }}>
            <h2 style={{ fontSize: "16px", margin: "0 0 16px", color: "#F7F8F9" }}>Auth Popup Preview (/auth.html)</h2>
            <div style={{ display: "flex", justifyContent: "center", background: "#0F1214", padding: "20px", borderRadius: "8px" }}>
              <iframe
                src="/auth.html"
                title="Auth Preview"
                style={{ width: "360px", height: "260px", border: "1px solid #333C44", borderRadius: "8px" }}
              />
            </div>
          </div>

          <div style={{ background: "#1D2125", border: "1px solid #333C44", borderRadius: "10px", padding: "24px" }}>
            <h2 style={{ fontSize: "16px", margin: "0 0 16px", color: "#F7F8F9" }}>Settings Popup Preview (/settings.html)</h2>
            <div style={{ display: "flex", justifyContent: "center", background: "#0F1214", padding: "20px", borderRadius: "8px" }}>
              <iframe
                src="/settings.html"
                title="Settings Preview"
                style={{ width: "360px", height: "280px", border: "1px solid #333C44", borderRadius: "8px" }}
              />
            </div>
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

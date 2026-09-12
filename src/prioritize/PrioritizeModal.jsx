import React, { useState, useEffect } from "react";
import KanbanBoardScreen from "./KanbanBoardScreen.jsx";
import CardPrioritizeModal from "./CardPrioritizeModal.jsx";
import { FRAMEWORKS, getCardBadge } from "../lib/frameworks.js";
import "./prioritize.css";

// Checkmark Icon
function CheckIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

// Plus Icon
function PlusIcon(props) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

// Trash Icon
function TrashIcon(props) {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );
}

// Default card for standalone card modal preview matching Image 1
const DEFAULT_SAMPLE_CARD = {
  id: "c1",
  name: "New checkout",
  framework: "RICE",
  reach: 800,
  impact: 3,
  confidence: 0.8,
  effort: 4,
  score: 480,
};

const DEFAULT_BATCH_CARDS = [
  { id: "c1", name: "New checkout", framework: "RICE", reach: 800, impact: 3, confidence: 0.8, effort: 4, score: 480, selected: true },
  { id: "c2", name: "Search improvement", framework: "RICE", reach: 660, impact: 3, confidence: 0.8, effort: 4, score: 396, selected: true },
  { id: "c3", name: "Mobile redesign", framework: "RICE", reach: 840, impact: 2, confidence: 0.8, effort: 4, score: 336, selected: true },
  { id: "c4", name: "Export to CSV & PDF", framework: "EFFORT_IMPACT", eiImpact: 8.5, eiEffort: 2, score: 8.5, selected: true },
  { id: "c5", name: "One-click social login", framework: "MOSCOW", moscowCat: "must", score: 100, selected: true },
  { id: "c6", name: "Stripe webhook retry queue", framework: "WSJF", userValue: 8, timeCriticality: 5, riskReduction: 6.5, jobSize: 1, score: 19.5, selected: true },
  { id: "c7", name: "Upgrade Node runtime", framework: "RICE", reach: 500, impact: 2, confidence: 1.0, effort: 5, score: 200, selected: true },
];

export default function PrioritizeModal({ t, onClose }) {
  // Check URL parameters for default view mode
  const urlParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
  const initialMode = urlParams?.get("view") === "card" ? "card" : "board";

  const [activeView, setActiveView] = useState(initialMode); // "board" | "card" | "batch"
  const [selectedCardForScoring, setSelectedCardForScoring] = useState(DEFAULT_SAMPLE_CARD);

  // Batch evaluation sets state
  const [batchCards, setBatchCards] = useState(DEFAULT_BATCH_CARDS);
  const [sets, setSets] = useState([
    { id: "set-1", name: "Product Roadmap" },
    { id: "set-2", name: "Growth Initiatives" },
  ]);
  const [activeSetId, setActiveSetId] = useState("set-1");
  const [showAddSetDialog, setShowAddSetDialog] = useState(false);
  const [newSetName, setNewSetName] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isSortedByRank, setIsSortedByRank] = useState(false);

  // Load real card from Trello if in card mode
  useEffect(() => {
    if (!t) return;
    if (typeof t.card === "function") {
      t.card("id", "name").then((trelloCard) => {
        if (trelloCard && trelloCard.id) {
          t.get("card", "shared", "priority_data").then((savedData) => {
            if (savedData) {
              setSelectedCardForScoring({ ...savedData, id: trelloCard.id, name: trelloCard.name });
            } else {
              setSelectedCardForScoring((prev) => ({
                ...prev,
                id: trelloCard.id,
                name: trelloCard.name,
              }));
            }
          }).catch(() => {});
        }
      }).catch(() => {});
    }
  }, [t]);

  // Handle saving score from CardPrioritizeModal
  function handleCardScoreApplied(updatedCard) {
    setSelectedCardForScoring(updatedCard);

    // Save to Trello shared pluginData
    if (t && typeof t.set === "function") {
      t.set(updatedCard.id || "current", "shared", "priority_data", updatedCard).catch(() => {});
    }

    // Also update batch cards if present
    setBatchCards((prev) =>
      prev.map((c) => (c.id === updatedCard.id ? { ...c, ...updatedCard } : c))
    );
  }

  // Open card scoring modal from Kanban Board or batch table
  function handleOpenCardModal(card) {
    setSelectedCardForScoring(card);
    setActiveView("card");
  }

  // Batch actions
  function handleToggleCard(cardId) {
    setBatchCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, selected: !c.selected } : c))
    );
  }

  function handleSelectAll() {
    setBatchCards((prev) => prev.map((c) => ({ ...c, selected: true })));
  }

  function handleClearAll() {
    setBatchCards((prev) => prev.map((c) => ({ ...c, selected: false })));
  }

  function handleToggleRank() {
    if (isSortedByRank) {
      setBatchCards(DEFAULT_BATCH_CARDS);
      setIsSortedByRank(false);
    } else {
      const sorted = [...batchCards].sort((a, b) => (b.score || 0) - (a.score || 0));
      setBatchCards(sorted);
      setIsSortedByRank(true);
    }
  }

  function handleCreateSet(e) {
    e.preventDefault();
    if (!newSetName.trim()) return;
    const newSet = { id: `set-${Date.now()}`, name: newSetName.trim() };
    setSets((prev) => [...prev, newSet]);
    setActiveSetId(newSet.id);
    setNewSetName("");
    setShowAddSetDialog(false);
  }

  function handleDeleteSet() {
    if (sets.length <= 1) {
      alert("At least one evaluation set must be retained.");
      setShowDeleteConfirm(false);
      return;
    }
    const filtered = sets.filter((s) => s.id !== activeSetId);
    setSets(filtered);
    setActiveSetId(filtered[0].id);
    setShowDeleteConfirm(false);
  }

  return (
    <div style={{ width: "100%", height: "100%", minHeight: "100vh", display: "flex", flexDirection: "column", background: "#070b14" }}>
      {/* Top View Switcher Ribbon (Dev & Navigation Bar) */}
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "8px 20px",
          background: "#0a101d",
          borderBottom: "1px solid #1a253c",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "7px",
              background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: 800,
              fontSize: "13px",
            }}
          >
            ✦
          </div>
          <span style={{ fontSize: "14px", fontWeight: 700, color: "#f8fafc" }}>
            Prioritize Power-Up
          </span>
        </div>

        {/* View Switcher Tabs */}
        <div style={{ display: "flex", background: "#131c2e", padding: "3px", borderRadius: "8px", border: "1px solid #23304a" }}>
          <button
            type="button"
            onClick={() => setActiveView("board")}
            style={{
              background: activeView === "board" ? "#2563eb" : "transparent",
              color: activeView === "board" ? "#ffffff" : "#94a3b8",
              border: "none",
              borderRadius: "6px",
              padding: "5px 14px",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            📋 Kanban Board (Image 2)
          </button>

          <button
            type="button"
            onClick={() => setActiveView("card")}
            style={{
              background: activeView === "card" ? "#2563eb" : "transparent",
              color: activeView === "card" ? "#ffffff" : "#94a3b8",
              border: "none",
              borderRadius: "6px",
              padding: "5px 14px",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            🎯 Card Prioritize Modal (Image 1)
          </button>

          <button
            type="button"
            onClick={() => setActiveView("batch")}
            style={{
              background: activeView === "batch" ? "#2563eb" : "transparent",
              color: activeView === "batch" ? "#ffffff" : "#94a3b8",
              border: "none",
              borderRadius: "6px",
              padding: "5px 14px",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            📊 Batch Matrix Table
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* VIEW 1: KANBAN BOARD SCREEN (IMAGE 2) */}
        {activeView === "board" && (
          <KanbanBoardScreen
            onOpenCardModal={handleOpenCardModal}
            onOpenPanel={() => setActiveView("batch")}
          />
        )}

        {/* VIEW 2: CARD PRIORITIZATION MODAL (IMAGE 1) */}
        {activeView === "card" && (
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "24px",
              overflowY: "auto",
              background: "#070b14",
            }}
          >
            <CardPrioritizeModal
              card={selectedCardForScoring}
              onApply={handleCardScoreApplied}
              onClose={() => setActiveView("board")}
            />
          </div>
        )}

        {/* VIEW 3: BATCH MATRIX & EVALUATION SETS */}
        {activeView === "batch" && (
          <div className="prio-container" style={{ background: "#0d1424", height: "100%", padding: "16px 24px" }}>
            {/* Controls Bar */}
            <div className="prio-controls-bar" style={{ padding: "0 0 12px 0" }}>
              <div className="prio-section-heading">
                <span className="prio-heading-title">Cards in Evaluation Set</span>
                <span className="prio-count-badge">
                  {batchCards.filter((c) => c.selected).length} of {batchCards.length}
                </span>
              </div>

              <div className="prio-controls-right">
                <button type="button" className="prio-quick-link" onClick={handleSelectAll}>
                  Select all
                </button>
                <span className="prio-dot-divider">·</span>
                <button type="button" className="prio-quick-link" onClick={handleClearAll}>
                  Clear
                </button>
                <span className="prio-dot-divider">·</span>
                <select
                  value={activeSetId}
                  onChange={(e) => setActiveSetId(e.target.value)}
                  className="prio-set-selector"
                >
                  {sets.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* List Box */}
            <div className="prio-list-container" style={{ margin: 0, background: "#111827", border: "1px solid #1f293d" }}>
              <div className="prio-card-scroll-area">
                {batchCards.map((card, idx) => {
                  const badge = getCardBadge(card);
                  return (
                    <div
                      key={card.id}
                      className={`prio-card-item ${card.selected ? "selected" : "deselected"}`}
                      style={{ borderBottom: "1px solid #1e293b", padding: "10px 14px" }}
                    >
                      <div className="prio-card-item-left">
                        <label className="prio-checkbox-container">
                          <input
                            type="checkbox"
                            className="prio-native-checkbox"
                            checked={Boolean(card.selected)}
                            onChange={() => handleToggleCard(card.id)}
                          />
                          <div className="prio-checkbox-box">
                            {card.selected && <CheckIcon className="prio-check-svg" />}
                          </div>
                        </label>
                        <span className="prio-card-name-text" style={{ fontSize: "13.5px", fontWeight: 600 }}>
                          {card.name}
                        </span>
                      </div>

                      <div className="prio-card-item-right">
                        <span
                          className="prio-rank-pill"
                          style={{
                            background: "#380d16",
                            borderColor: "#7f1d1d",
                            color: "#fca5a5",
                            fontWeight: 700,
                          }}
                        >
                          {isSortedByRank ? `#${idx + 1} · ` : ""}
                          {badge?.fullLabel || `${card.score} ${card.framework || "RICE"}`}
                        </span>

                        <button
                          type="button"
                          className="prio-score-link"
                          onClick={() => handleOpenCardModal(card)}
                        >
                          Edit Score ↗
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action Bar */}
            <div className="prio-action-bar" style={{ padding: "14px 0 0 0" }}>
              <div className="prio-action-group-left">
                <button
                  type="button"
                  className="prio-btn-secondary"
                  onClick={() => setShowAddSetDialog(true)}
                >
                  <PlusIcon />
                  Add New Set
                </button>
                <button
                  type="button"
                  className="prio-btn-danger-subtle"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  <TrashIcon />
                  Delete Set
                </button>
              </div>

              <button
                type="button"
                className="prio-btn-primary"
                onClick={handleToggleRank}
              >
                {isSortedByRank ? "Reset Ranking" : "Auto-Rank Cards By Score"}
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Add New Set Dialog */}
      {showAddSetDialog && (
        <div className="prio-overlay" onClick={() => setShowAddSetDialog(false)}>
          <form
            className="prio-dialog"
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleCreateSet}
          >
            <div className="prio-dialog-head">
              <h3 className="prio-dialog-title">New Evaluation Set</h3>
              <p className="prio-dialog-desc">
                Organize cards into evaluation groups for upcoming sprints or quarters.
              </p>
            </div>

            <div>
              <input
                type="text"
                placeholder="e.g. Q4 Sprint, Growth Backlog"
                className="prio-text-input"
                value={newSetName}
                onChange={(e) => setNewSetName(e.target.value)}
                autoFocus
                required
              />
            </div>

            <div className="prio-dialog-foot">
              <button
                type="button"
                className="prio-btn-secondary"
                onClick={() => setShowAddSetDialog(false)}
              >
                Cancel
              </button>
              <button type="submit" className="prio-btn-primary">
                Create Set
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Delete Set Confirmation */}
      {showDeleteConfirm && (
        <div className="prio-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="prio-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="prio-dialog-head">
              <h3 className="prio-dialog-title" style={{ color: "#F87168" }}>
                Delete Set: {sets.find((s) => s.id === activeSetId)?.name}?
              </h3>
              <p className="prio-dialog-desc">
                Are you sure you want to remove this evaluation set? Cards on your Trello board will not be deleted.
              </p>
            </div>

            <div className="prio-dialog-foot">
              <button
                type="button"
                className="prio-btn-secondary"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="prio-btn-danger-subtle"
                style={{ background: "rgba(248, 113, 104, 0.15)", border: "1px solid rgba(248, 113, 104, 0.4)" }}
                onClick={handleDeleteSet}
              >
                Delete Set
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect } from "react";
import "./prioritize.css";

// Sparkle/Prioritize Icon
function SparkleIcon(props) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

// Chart/Rank Icon
function RankIcon(props) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}

// Close Cross Icon
function CloseIcon(props) {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

// Checkmark Icon
function CheckIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

// Plus Icon
function PlusIcon(props) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

// Trash Icon
function TrashIcon(props) {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );
}

const FRAMEWORKS = [
  {
    id: "rice",
    label: "RICE — Product/features with reach and expected impact",
    short: "RICE",
    factors: "Reach, Impact, Confidence, Effort",
    formulaText: "(Reach × Impact × Confidence) ÷ Effort",
  },
  {
    id: "ice",
    label: "ICE — Quick, simple prioritization",
    short: "ICE",
    factors: "Impact, Confidence, Effort",
    formulaText: "(Impact × Confidence) ÷ Effort",
  },
  {
    id: "effort-impact",
    label: "Effort vs Impact — Finding quick wins",
    short: "Effort vs Impact",
    factors: "Effort and Impact",
    formulaText: "Impact vs Effort Matrix",
  },
];

const DEFAULT_SAMPLE_CARDS = [
  { id: "c1", name: "New checkout", framework: "rice", reach: 9, impact: 9, confidence: 9, effort: 4, score: 92, selected: true },
  { id: "c2", name: "Search improvement", framework: "rice", reach: 8, impact: 8, confidence: 8, effort: 4, score: 84, selected: true },
  { id: "c3", name: "Mobile redesign", framework: "rice", reach: 8, impact: 9, confidence: 7, effort: 6, score: 78, selected: true },
  { id: "c4", name: "Email automation", framework: "ice", impact: 7, confidence: 8, effort: 5, score: 71, selected: true },
  { id: "c5", name: "Dark mode theme", framework: "effort-impact", impact: 6, effort: 4, score: 65, quadrant: "🌟 Quick Win", selected: true },
  { id: "c6", name: "Onboarding flow", framework: "rice", reach: 9, impact: 9, confidence: 8, effort: 5, score: 86, selected: true },
  { id: "c7", name: "Stripe billing upgrade", framework: "rice", reach: 10, impact: 10, confidence: 9, effort: 6, score: 95, selected: true },
  { id: "c8", name: "Performance optimization", framework: "ice", impact: 8, confidence: 7, effort: 4, score: 80, selected: true },
  { id: "c9", name: "Multi-currency support", framework: "effort-impact", impact: 7, effort: 6, score: 68, quadrant: "🚀 Major Project", selected: true },
];

const INITIAL_SETS = [
  { id: "set-1", name: "Product Roadmap" },
  { id: "set-2", name: "Growth Initiatives" },
];

export default function PrioritizeModal({ t, onClose }) {
  const [sets, setSets] = useState(INITIAL_SETS);
  const [activeSetId, setActiveSetId] = useState("set-1");
  const [cards, setCards] = useState(DEFAULT_SAMPLE_CARDS);

  // Target card when selecting framework
  const [targetCard, setTargetCard] = useState(null);

  // Dialogs
  const [showAddSetDialog, setShowAddSetDialog] = useState(false);
  const [newSetName, setNewSetName] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isSortedByRank, setIsSortedByRank] = useState(false);
  const [activeView, setActiveView] = useState("cards"); // "cards" | "choose-framework"

  // Active selected framework
  const [selectedFramework, setSelectedFramework] = useState("rice");

  // Load real cards from Trello if available (excluding Cardlytics / utility cards)
  useEffect(() => {
    if (!t || typeof t.cards !== "function") return;

    const getLists = typeof t.lists === "function" ? t.lists("id", "name") : Promise.resolve([]);
    const getCards = t.cards("id", "name", "idList");

    Promise.all([getCards, getLists])
      .then(([trelloCards, trelloLists]) => {
        if (trelloCards && trelloCards.length > 0) {
          // Identify Cardlytics or system utility list IDs
          const cardlyticsListIds = new Set(
            (trelloLists || [])
              .filter((l) => l.name && l.name.toLowerCase().includes("cardlytics"))
              .map((l) => l.id)
          );

          // Filter out Cardlytics cards and pure emoji/number utility cards
          const filteredCards = trelloCards.filter((card) => {
            // 1. Exclude if belonging to Cardlytics list
            if (card.idList && cardlyticsListIds.has(card.idList)) {
              return false;
            }
            // 2. Exclude if the card name is only a single emoji symbol or a bare number (e.g. "📌", "⚠️", "🏷️", "6")
            const name = (card.name || "").trim();
            const isSingleEmoji = /^[\p{Emoji_Presentation}\p{Extended_Pictographic}\uFE0F\s]{1,3}$/u.test(name);
            const isNumberOnly = /^[0-9]+$/.test(name);
            if (isSingleEmoji || isNumberOnly) {
              return false;
            }
            return true;
          });

          // Use filtered cards (or fallback to original if filter is too aggressive)
          const finalCards = filteredCards.length > 0 ? filteredCards : trelloCards;

          setCards(
            finalCards.map((c, i) => ({
              id: c.id,
              name: c.name,
              framework: "rice",
              reach: 8,
              impact: 7,
              confidence: 8,
              effort: 5,
              score: Math.max(50, 95 - i * 4),
              selected: true,
            }))
          );
        }
      })
      .catch((err) => {
        console.warn("Using fallback sample cards:", err);
      });
  }, [t]);

  // Select all / clear
  function handleSelectAll() {
    setCards((prev) => prev.map((c) => ({ ...c, selected: true })));
  }

  function handleClearAll() {
    setCards((prev) => prev.map((c) => ({ ...c, selected: false })));
  }

  // Toggle card
  function handleToggleCard(cardId) {
    setCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, selected: !c.selected } : c))
    );
  }

  // Open framework selection screen
  function handleOpenFrameworkSelect(card) {
    setTargetCard(card);
    setSelectedFramework(card?.framework || "rice");
    setActiveView("choose-framework");
  }

  // Save framework choice and return to cards view
  function handleSelectFrameworkAndReturn() {
    if (targetCard) {
      setCards((prev) =>
        prev.map((c) =>
          c.id === targetCard.id
            ? { ...c, framework: selectedFramework }
            : c
        )
      );

      if (t && typeof t.set === "function") {
        t.set(targetCard.id, "shared", "priority_framework", selectedFramework).catch(() => {});
      }
    }
    setActiveView("cards");
    setTargetCard(null);
  }

  // Cancel framework selection and return to cards view
  function handleCancelFrameworkSelect() {
    setActiveView("cards");
    setTargetCard(null);
  }

  // Create new set
  function handleCreateSet(e) {
    e.preventDefault();
    if (!newSetName.trim()) return;
    const newSet = {
      id: `set-${Date.now()}`,
      name: newSetName.trim(),
    };
    setSets((prev) => [...prev, newSet]);
    setActiveSetId(newSet.id);
    setNewSetName("");
    setShowAddSetDialog(false);
  }

  // Delete set
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

  // Auto-Rank cards
  function handleToggleRank() {
    if (isSortedByRank) {
      setCards(DEFAULT_SAMPLE_CARDS);
      setIsSortedByRank(false);
    } else {
      const sorted = [...cards].sort((a, b) => (b.score || 0) - (a.score || 0));
      setCards(sorted);
      setIsSortedByRank(true);
    }
  }

  // Close modal
  function handleClose() {
    if (onClose) {
      onClose();
    } else if (t && typeof t.closeModal === "function") {
      t.closeModal();
    } else if (t && typeof t.closePopup === "function") {
      t.closePopup();
    }
  }

  const selectedCount = cards.filter((c) => c.selected).length;
  const activeSet = sets.find((s) => s.id === activeSetId) || sets[0];

  return (
    <div className="prio-container">
      {/* Header */}
      <header className="prio-header">
        <div className="prio-header-brand">
          <div className="prio-brand-icon">
            <RankIcon />
          </div>
          <div className="prio-brand-titles">
            <div className="prio-title-line">
              <h1 className="prio-title-text">Prioritize</h1>
              <span className="prio-powerup-tag">Power-Up</span>
            </div>
            <p className="prio-subtitle-text">
              Score cards and automatically rank what your team should build first.
            </p>
          </div>
        </div>
      </header>

      {/* View 1: Choose Framework Screen */}
      {activeView === "choose-framework" ? (
        <>
          <div className="prio-framework-view">
            <div className="prio-framework-header-info">
              <h2 className="prio-framework-screen-label">Choose Framework</h2>
              <p className="prio-framework-card-subtitle">
                {targetCard ? (
                  <>
                    Selecting framework for: <strong>{targetCard.name}</strong>
                  </>
                ) : (
                  "Select an evaluation framework to prioritize cards."
                )}
              </p>
            </div>

            {/* Main Framework Dropdown matching user reference */}
            <select
              className="prio-framework-main-dropdown"
              value={selectedFramework}
              onChange={(e) => setSelectedFramework(e.target.value)}
            >
              {FRAMEWORKS.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.label}
                </option>
              ))}
            </select>

            {/* Framework Details List matching user annotations */}
            <div className="prio-framework-cards-container">
              {FRAMEWORKS.map((f) => {
                const isSelected = f.id === selectedFramework;
                return (
                  <div
                    key={f.id}
                    className={`prio-framework-info-box ${isSelected ? "selected" : ""}`}
                    onClick={() => setSelectedFramework(f.id)}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="prio-framework-info-main">
                      <div className="prio-framework-info-title">
                        <span>{f.short}</span>
                        {isSelected && (
                          <span className="prio-framework-tag-active">Selected</span>
                        )}
                      </div>
                      <div className="prio-framework-info-factors">
                        Factors: {f.factors}
                      </div>
                    </div>
                    <div className={`prio-framework-status-badge ${isSelected ? "active" : ""}`}>
                      {isSelected ? "✓ Active" : "Select"}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Row for Framework View */}
          <div className="prio-framework-action-row">
            <button
              type="button"
              className="prio-btn-secondary"
              onClick={handleCancelFrameworkSelect}
            >
              ← Back to Cards
            </button>
            <button
              type="button"
              className="prio-btn-primary"
              onClick={handleSelectFrameworkAndReturn}
            >
              Select Framework & Return
            </button>
          </div>
        </>
      ) : (
        /* View 2: Cards To Prioritize Screen */
        <>
          {/* Controls & Filter Bar */}
          <div className="prio-controls-bar">
            <div className="prio-section-heading">
              <span className="prio-heading-title">Cards to prioritize</span>
              <span className="prio-count-badge">
                {selectedCount} of {cards.length}
              </span>
            </div>

            <div className="prio-controls-right">
              <button
                type="button"
                className="prio-quick-link"
                onClick={handleSelectAll}
              >
                Select all
              </button>
              <span className="prio-dot-divider">·</span>
              <button
                type="button"
                className="prio-quick-link"
                onClick={handleClearAll}
              >
                Clear
              </button>

              {sets.length > 1 && (
                <>
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
                </>
              )}
            </div>
          </div>

          {/* Cards List Box */}
          <div className="prio-list-container">
            <div className="prio-card-scroll-area">
              {cards.map((card, idx) => (
                <div
                  key={card.id}
                  className={`prio-card-item ${card.selected ? "selected" : "deselected"}`}
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
                    <span className="prio-card-name-text">{card.name}</span>
                  </div>

                  <div className="prio-card-item-right">
                    {card.score !== undefined && (
                      <span className="prio-rank-pill" title={`Scored with ${card.framework?.toUpperCase() || "RICE"}`}>
                        {isSortedByRank ? `#${idx + 1} · ` : ""}{card.quadrant ? card.quadrant : `Score: ${card.score}`}
                      </span>
                    )}
                    <button
                      type="button"
                      className="prio-score-link"
                      onClick={() => handleOpenFrameworkSelect(card)}
                    >
                      Edit scores
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Bar */}
          <div className="prio-action-bar">
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
              <RankIcon />
              {isSortedByRank ? "Reset Ranking" : "Auto-Rank Cards"}
            </button>
          </div>
        </>
      )}

      {/* Footer */}
      <footer className="prio-footer-bar">
        <p className="prio-footer-tip">
          <span>💡</span> Tip: You can also score cards individually by clicking any card on the board.
        </p>
        <span className="prio-footer-brand">Task Prioritize Power-Up</span>
      </footer>

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
              <button
                type="submit"
                className="prio-btn-primary"
              >
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
                Delete Set: {activeSet?.name}?
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

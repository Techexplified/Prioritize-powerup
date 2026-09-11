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

const DEFAULT_SAMPLE_CARDS = [
  { id: "c1", name: "New checkout", impact: 9, confidence: 9, effort: 4, score: 92, selected: true },
  { id: "c2", name: "Search improvement", impact: 8, confidence: 8, effort: 4, score: 84, selected: true },
  { id: "c3", name: "Mobile redesign", impact: 9, confidence: 7, effort: 6, score: 78, selected: true },
  { id: "c4", name: "Email automation", impact: 7, confidence: 8, effort: 5, score: 71, selected: true },
  { id: "c5", name: "Dark mode theme", impact: 6, confidence: 9, effort: 5, score: 65, selected: true },
  { id: "c6", name: "Onboarding flow", impact: 9, confidence: 8, effort: 5, score: 86, selected: true },
  { id: "c7", name: "Stripe billing upgrade", impact: 10, confidence: 9, effort: 6, score: 95, selected: true },
  { id: "c8", name: "Performance optimization", impact: 8, confidence: 7, effort: 4, score: 80, selected: true },
  { id: "c9", name: "Multi-currency support", impact: 7, confidence: 7, effort: 6, score: 68, selected: true },
];

const INITIAL_SETS = [
  { id: "set-1", name: "Product Roadmap" },
  { id: "set-2", name: "Growth Initiatives" },
];

export default function PrioritizeModal({ t, onClose }) {
  const [sets, setSets] = useState(INITIAL_SETS);
  const [activeSetId, setActiveSetId] = useState("set-1");
  const [cards, setCards] = useState(DEFAULT_SAMPLE_CARDS);

  // Dialogs
  const [scoringCard, setScoringCard] = useState(null);
  const [showAddSetDialog, setShowAddSetDialog] = useState(false);
  const [newSetName, setNewSetName] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isSortedByRank, setIsSortedByRank] = useState(false);

  // Sliders for scoring
  const [editImpact, setEditImpact] = useState(8);
  const [editConfidence, setEditConfidence] = useState(8);
  const [editEffort, setEditEffort] = useState(4);

  // Load real cards from Trello if available
  useEffect(() => {
    if (!t || typeof t.cards !== "function") return;
    t.cards("id", "name", "idList")
      .then((trelloCards) => {
        if (trelloCards && trelloCards.length > 0) {
          setCards(
            trelloCards.map((c, i) => ({
              id: c.id,
              name: c.name,
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

  // Open scoring modal
  function handleOpenScoreEditor(card) {
    setScoringCard(card);
    setEditImpact(card.impact || 8);
    setEditConfidence(card.confidence || 8);
    setEditEffort(card.effort || 4);
  }

  // Live calculated score
  const computedScore = Math.round(
    Math.min(100, Math.max(10, ((editImpact * editConfidence) / Math.max(1, editEffort)) * 5))
  );

  // Save scores
  function handleSaveScores() {
    if (!scoringCard) return;
    setCards((prev) =>
      prev.map((c) =>
        c.id === scoringCard.id
          ? {
              ...c,
              impact: editImpact,
              confidence: editConfidence,
              effort: editEffort,
              score: computedScore,
            }
          : c
      )
    );

    if (t && typeof t.set === "function") {
      t.set(scoringCard.id, "shared", "priority_score", {
        impact: editImpact,
        confidence: editConfidence,
        effort: editEffort,
        score: computedScore,
      }).catch(() => {});
    }
    setScoringCard(null);
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
                  <span className="prio-rank-pill" title="Calculated Priority Score">
                    {isSortedByRank ? `#${idx + 1} · ` : ""}Score: {card.score}
                  </span>
                )}
                <button
                  type="button"
                  className="prio-score-link"
                  onClick={() => handleOpenScoreEditor(card)}
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

      {/* Footer */}
      <footer className="prio-footer-bar">
        <p className="prio-footer-tip">
          <span>💡</span> Tip: You can also score cards individually by clicking any card on the board.
        </p>
        <span className="prio-footer-brand">Task Prioritize Power-Up</span>
      </footer>

      {/* Score Editing Dialog */}
      {scoringCard && (
        <div className="prio-overlay" onClick={() => setScoringCard(null)}>
          <div className="prio-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="prio-dialog-head">
              <h3 className="prio-dialog-title">Score: {scoringCard.name}</h3>
              <p className="prio-dialog-desc">
                Adjust criteria to calculate the card's priority rank for your team.
              </p>
            </div>

            <div className="prio-sliders">
              {/* Impact */}
              <div className="prio-slider-item">
                <div className="prio-slider-labels">
                  <span className="prio-slider-name">Impact (Value)</span>
                  <span className="prio-slider-score-tag">{editImpact} / 10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={editImpact}
                  onChange={(e) => setEditImpact(Number(e.target.value))}
                  className="prio-range"
                />
              </div>

              {/* Confidence */}
              <div className="prio-slider-item">
                <div className="prio-slider-labels">
                  <span className="prio-slider-name">Confidence</span>
                  <span className="prio-slider-score-tag">{editConfidence} / 10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={editConfidence}
                  onChange={(e) => setEditConfidence(Number(e.target.value))}
                  className="prio-range"
                />
              </div>

              {/* Effort */}
              <div className="prio-slider-item">
                <div className="prio-slider-labels">
                  <span className="prio-slider-name">Effort / Complexity</span>
                  <span className="prio-slider-score-tag">{editEffort} / 10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={editEffort}
                  onChange={(e) => setEditEffort(Number(e.target.value))}
                  className="prio-range"
                />
              </div>

              {/* Score result */}
              <div className="prio-score-result-box">
                <div>
                  <div style={{ fontSize: "11px", color: "#9FADBC", fontWeight: 600, textTransform: "uppercase" }}>
                    Priority Score
                  </div>
                  <div style={{ fontSize: "11px", color: "#738496" }}>
                    Formula: (Impact × Confidence) ÷ Effort
                  </div>
                </div>
                <div className="prio-score-result-val">
                  {computedScore} <span style={{ fontSize: "12px", color: "#9FADBC" }}>/ 100</span>
                </div>
              </div>
            </div>

            <div className="prio-dialog-foot">
              <button
                type="button"
                className="prio-btn-secondary"
                onClick={() => setScoringCard(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="prio-btn-primary"
                onClick={handleSaveScores}
              >
                Save Score
              </button>
            </div>
          </div>
        </div>
      )}

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

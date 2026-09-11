import React, { useState, useEffect } from "react";
import "./prioritize.css";

// Sparkle Star Icon matching the glowing logo in the reference
function SparkleIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path d="M12 2L13.8 8.2L20 10L13.8 11.8L12 18L10.2 11.8L4 10L10.2 8.2L12 2Z" />
      <path d="M19 16L19.9 19.1L23 20L19.9 20.9L19 24L18.1 20.9L15 20L18.1 19.1L19 16Z" opacity="0.85" />
      <path d="M5 2L5.6 4.4L8 5L5.6 5.6L5 8L4.4 5.6L2 5L4.4 4.4L5 2Z" opacity="0.75" />
    </svg>
  );
}

// Close Cross Icon
function CloseIcon(props) {
  return (
    <svg
      width="16"
      height="16"
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
  { id: "set-1", name: "Main Product Roadmap" },
  { id: "set-2", name: "Sprint 34 Fast-Tracks" },
];

export default function PrioritizeModal({ t, onClose }) {
  const [sets, setSets] = useState(INITIAL_SETS);
  const [activeSetId, setActiveSetId] = useState("set-1");
  const [cards, setCards] = useState(DEFAULT_SAMPLE_CARDS);
  
  // Dialogs state
  const [scoringCard, setScoringCard] = useState(null);
  const [showAddSetDialog, setShowAddSetDialog] = useState(false);
  const [newSetName, setNewSetName] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isSortedByRank, setIsSortedByRank] = useState(false);

  // Temporary scores during edit modal
  const [editImpact, setEditImpact] = useState(8);
  const [editConfidence, setEditConfidence] = useState(8);
  const [editEffort, setEditEffort] = useState(4);

  // Load cards from Trello if available
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
              score: Math.max(50, 95 - i * 5),
              selected: true,
            }))
          );
        }
      })
      .catch((err) => {
        console.warn("Using fallback sample cards:", err);
      });
  }, [t]);

  // Handle Select All / Clear
  function handleSelectAll() {
    setCards((prev) => prev.map((c) => ({ ...c, selected: true })));
  }

  function handleClearAll() {
    setCards((prev) => prev.map((c) => ({ ...c, selected: false })));
  }

  // Toggle individual card
  function handleToggleCard(cardId) {
    setCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, selected: !c.selected } : c))
    );
  }

  // Open Score Editor for card
  function handleOpenScoreEditor(card) {
    setScoringCard(card);
    setEditImpact(card.impact || 8);
    setEditConfidence(card.confidence || 8);
    setEditEffort(card.effort || 4);
  }

  // Calculate live score (normalized 1 - 100)
  const computedScore = Math.round(
    Math.min(100, Math.max(10, ((editImpact * editConfidence) / Math.max(1, editEffort)) * 5))
  );

  // Save updated scores
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
    // If inside Trello, persist score data to card
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

  // Add New Set
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

  // Delete Set
  function handleDeleteSet() {
    if (sets.length <= 1) {
      alert("At least one prioritization set must be retained.");
      setShowDeleteConfirm(false);
      return;
    }
    const filtered = sets.filter((s) => s.id !== activeSetId);
    setSets(filtered);
    setActiveSetId(filtered[0].id);
    setShowDeleteConfirm(false);
  }

  // Sort by priority rank
  function handleToggleRank() {
    if (isSortedByRank) {
      // Revert to original order
      setCards(DEFAULT_SAMPLE_CARDS);
      setIsSortedByRank(false);
    } else {
      const sorted = [...cards].sort((a, b) => (b.score || 0) - (a.score || 0));
      setCards(sorted);
      setIsSortedByRank(true);
    }
  }

  // Close handler
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
    <div className="prio-modal-wrapper">
      {/* Header */}
      <header className="prio-header">
        <div className="prio-header-left">
          <div className="prio-logo-box">
            <SparkleIcon className="prio-sparkle-icon" />
          </div>
          <div className="prio-title-group">
            <div className="prio-title-row">
              <h1 className="prio-title">Prioritize</h1>
              <span className="prio-powerup-badge">Power-Up</span>
            </div>
            <p className="prio-subtitle">
              Score cards and automatically rank what your team should build first
            </p>
          </div>
        </div>
        <button
          type="button"
          className="prio-close-btn"
          onClick={handleClose}
          aria-label="Close"
        >
          <CloseIcon />
        </button>
      </header>

      {/* Section Heading & Quick Actions */}
      <div className="prio-section-header">
        <h2 className="prio-section-title">
          Cards to prioritize ({selectedCount}/{cards.length})
        </h2>
        <div className="prio-action-links">
          <button
            type="button"
            className="prio-link-btn"
            onClick={handleSelectAll}
          >
            Select all
          </button>
          <span className="prio-dot-separator">·</span>
          <button
            type="button"
            className="prio-link-btn"
            onClick={handleClearAll}
          >
            Clear
          </button>
        </div>
      </div>

      {/* Card List Box */}
      <div className="prio-card-list-box">
        <div className="prio-card-list">
          {cards.map((card) => (
            <div
              key={card.id}
              className={`prio-card-row ${card.selected ? "checked" : "unchecked"}`}
            >
              <div className="prio-card-left">
                <label className="prio-checkbox-wrap">
                  <input
                    type="checkbox"
                    className="prio-checkbox-input"
                    checked={Boolean(card.selected)}
                    onChange={() => handleToggleCard(card.id)}
                  />
                  <div className="prio-custom-checkbox">
                    {card.selected && <CheckIcon className="prio-check-icon" />}
                  </div>
                </label>
                <span className="prio-card-title">{card.name}</span>
              </div>

              <div className="prio-card-right">
                <button
                  type="button"
                  className="prio-edit-scores-btn"
                  onClick={() => handleOpenScoreEditor(card)}
                >
                  Edit scores
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons below list */}
      <div className="prio-button-row">
        <button
          type="button"
          className="prio-btn-add-set"
          onClick={() => setShowAddSetDialog(true)}
        >
          +Add New Set
        </button>
        <button
          type="button"
          className="prio-btn-delete-set"
          onClick={() => setShowDeleteConfirm(true)}
        >
          Delete Set
        </button>
      </div>

      {/* Footer */}
      <footer className="prio-footer">
        <p className="prio-tip-text">
          Tip: You can also score cards individually by clicking any card on the board.
        </p>
        <span className="prio-brand-text">Task Prioritize Power-Up</span>
      </footer>

        {/* Edit Scores Dialog / Panel */}
        {scoringCard && (
          <div className="prio-dialog-overlay" onClick={() => setScoringCard(null)}>
            <div className="prio-dialog-card" onClick={(e) => e.stopPropagation()}>
              <div>
                <h3 className="prio-dialog-title">Edit Scores: {scoringCard.name}</h3>
                <p className="prio-dialog-desc">
                  Adjust impact, confidence, and effort parameters to dynamically calculate the card's priority rank.
                </p>
              </div>

              <div className="prio-score-grid">
                {/* Impact */}
                <div className="prio-slider-group">
                  <div className="prio-slider-label-row">
                    <span className="prio-slider-title">Impact (Business Value)</span>
                    <span className="prio-slider-val">{editImpact} / 10</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={editImpact}
                    onChange={(e) => setEditImpact(Number(e.target.value))}
                    className="prio-range-slider"
                  />
                </div>

                {/* Confidence */}
                <div className="prio-slider-group">
                  <div className="prio-slider-label-row">
                    <span className="prio-slider-title">Confidence</span>
                    <span className="prio-slider-val">{editConfidence} / 10</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={editConfidence}
                    onChange={(e) => setEditConfidence(Number(e.target.value))}
                    className="prio-range-slider"
                  />
                </div>

                {/* Effort */}
                <div className="prio-slider-group">
                  <div className="prio-slider-label-row">
                    <span className="prio-slider-title">Effort / Complexity</span>
                    <span className="prio-slider-val">{editEffort} / 10</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={editEffort}
                    onChange={(e) => setEditEffort(Number(e.target.value))}
                    className="prio-range-slider"
                  />
                </div>

                {/* Computed Score Preview */}
                <div className="prio-score-summary-box">
                  <div>
                    <div style={{ fontSize: "12px", color: "#94a3b8", fontWeight: 600 }}>
                      CALCULATED PRIORITY
                    </div>
                    <div style={{ fontSize: "11px", color: "#64748b" }}>
                      Formula: (Impact × Confidence) ÷ Effort
                    </div>
                  </div>
                  <div className="prio-score-summary-val">
                    {computedScore} <span style={{ fontSize: "13px", color: "#94a3b8" }}>/ 100</span>
                  </div>
                </div>
              </div>

              <div className="prio-dialog-actions">
                <button
                  type="button"
                  className="prio-btn-subtle"
                  onClick={() => setScoringCard(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="prio-btn-dialog-primary"
                  onClick={handleSaveScores}
                >
                  Save Scores
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add New Set Dialog */}
        {showAddSetDialog && (
          <div className="prio-dialog-overlay" onClick={() => setShowAddSetDialog(false)}>
            <form
              className="prio-dialog-card"
              onClick={(e) => e.stopPropagation()}
              onSubmit={handleCreateSet}
            >
              <div>
                <h3 className="prio-dialog-title">+ Add New Prioritization Set</h3>
                <p className="prio-dialog-desc">
                  Create a new evaluation group to organize and prioritize features for upcoming sprints or quarters.
                </p>
              </div>

              <div>
                <input
                  type="text"
                  placeholder="e.g. Q4 Growth Sprint, Mobile v2 Backlog"
                  className="prio-input-field"
                  value={newSetName}
                  onChange={(e) => setNewSetName(e.target.value)}
                  autoFocus
                  required
                />
              </div>

              <div className="prio-dialog-actions">
                <button
                  type="button"
                  className="prio-btn-subtle"
                  onClick={() => setShowAddSetDialog(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="prio-btn-dialog-primary"
                >
                  Create Set
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Delete Set Confirmation */}
        {showDeleteConfirm && (
          <div className="prio-dialog-overlay" onClick={() => setShowDeleteConfirm(false)}>
            <div className="prio-dialog-card" onClick={(e) => e.stopPropagation()}>
              <div>
                <h3 className="prio-dialog-title" style={{ color: "#f87171" }}>
                  Delete Set: {activeSet?.name}?
                </h3>
                <p className="prio-dialog-desc">
                  Are you sure you want to remove this prioritization set? Individual cards on the Trello board will not be deleted.
                </p>
              </div>

              <div className="prio-dialog-actions">
                <button
                  type="button"
                  className="prio-btn-subtle"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Keep Set
                </button>
                <button
                  type="button"
                  className="prio-btn-dialog-danger"
                  onClick={handleDeleteSet}
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}

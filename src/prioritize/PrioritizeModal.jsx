import React, { useState, useEffect, useMemo } from "react";
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

// Glowing Sparkle Star Icon for Screen 1 Header
function SparkleStarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2C12 7.5 7.5 12 2 12C7.5 12 12 16.5 12 22C12 16.5 16.5 12 22 12C16.5 12 12 7.5 12 2Z"
        fill="#FFFFFF"
      />
      <circle cx="19" cy="5" r="1.5" fill="#93C5FD" />
      <circle cx="5" cy="19" r="1" fill="#93C5FD" />
    </svg>
  );
}

// Floppy Disk / Save Icon matching Screen 1 Button
function FloppyDiskIcon(props) {
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
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" />
      <polyline points="7 3 7 8 15 8" />
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
  { id: "c1", name: "New checkout", framework: "rice", reach: 800, impact: 3, confidence: 0.8, effort: 4, score: 480, selected: true },
  { id: "c2", name: "Search improvement", framework: "rice", reach: 660, impact: 3, confidence: 0.8, effort: 4, score: 396, selected: true },
  { id: "c3", name: "Mobile redesign", framework: "rice", reach: 840, impact: 2, confidence: 0.8, effort: 4, score: 336, selected: true },
  { id: "c4", name: "Email automation", framework: "rice", reach: 700, impact: 3, confidence: 0.8, effort: 5, score: 336, selected: true },
  { id: "c5", name: "Dark mode theme", framework: "rice", reach: 950, impact: 2, confidence: 0.8, effort: 3, score: 507, selected: true },
  { id: "c6", name: "Onboarding flow", framework: "rice", reach: 900, impact: 3, confidence: 0.8, effort: 5, score: 432, selected: true },
  { id: "c7", name: "Stripe billing upgrade", framework: "rice", reach: 1000, impact: 3, confidence: 0.9, effort: 6, score: 450, selected: true },
  { id: "c8", name: "Performance optimization", framework: "rice", reach: 600, impact: 3, confidence: 0.8, effort: 4, score: 360, selected: true },
  { id: "c9", name: "Multi-currency support", framework: "rice", reach: 750, impact: 2, confidence: 0.8, effort: 4, score: 300, selected: true },
];

const INITIAL_SETS = [
  { id: "set-1", name: "Product Roadmap" },
  { id: "set-2", name: "Growth Initiatives" },
];

export default function PrioritizeModal({ t, onClose }) {
  const [sets, setSets] = useState(INITIAL_SETS);
  const [activeSetId, setActiveSetId] = useState("set-1");
  const [cards, setCards] = useState(DEFAULT_SAMPLE_CARDS);

  // Target card when editing scores
  const [targetCard, setTargetCard] = useState(null);

  // Dialogs & Views: "cards" | "choose-framework" | "score-card"
  const [activeView, setActiveView] = useState("cards");
  const [showAddSetDialog, setShowAddSetDialog] = useState(false);
  const [newSetName, setNewSetName] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isSortedByRank, setIsSortedByRank] = useState(false);

  // Active selected framework
  const [selectedFramework, setSelectedFramework] = useState("rice");

  // RICE factor states
  const [reach, setReach] = useState(800);
  const [impact, setImpact] = useState(3);
  const [confidence, setConfidence] = useState(0.8);
  const [effort, setEffort] = useState(4);

  // ICE factor states
  const [iceImpact, setIceImpact] = useState(8);
  const [iceConfidence, setIceConfidence] = useState(8);
  const [iceEffort, setIceEffort] = useState(4);

  // Effort vs Impact factor states
  const [eiImpact, setEiImpact] = useState(8);
  const [eiEffort, setEiEffort] = useState(3);

  // Load real cards from Trello if available
  useEffect(() => {
    if (!t) return;

    // If opened directly from a card button or card badge
    if (typeof t.card === "function") {
      t.card("id", "name")
        .then((currentCard) => {
          if (currentCard && currentCard.id && currentCard.name) {
            const cardObj = {
              id: currentCard.id,
              name: currentCard.name,
              framework: "rice",
              reach: 800,
              impact: 3,
              confidence: 0.8,
              effort: 4,
              score: 480,
              selected: true,
            };
            setTargetCard(cardObj);
            setSelectedFramework("rice");
            setReach(800);
            setImpact(3);
            setConfidence(0.8);
            setEffort(4);
            setActiveView("score-card");
          }
        })
        .catch(() => {});
    }

    if (typeof t.cards !== "function") return;

    const getLists = typeof t.lists === "function" ? t.lists("id", "name") : Promise.resolve([]);
    const getCards = t.cards("id", "name", "idList");

    Promise.all([getCards, getLists])
      .then(([trelloCards, trelloLists]) => {
        if (trelloCards && trelloCards.length > 0) {
          const cardlyticsListIds = new Set(
            (trelloLists || [])
              .filter((l) => l.name && l.name.toLowerCase().includes("cardlytics"))
              .map((l) => l.id)
          );

          const filteredCards = trelloCards.filter((card) => {
            if (card.idList && cardlyticsListIds.has(card.idList)) return false;
            const name = (card.name || "").trim();
            const isSingleEmoji = /^[\p{Emoji_Presentation}\p{Extended_Pictographic}\uFE0F\s]{1,3}$/u.test(name);
            const isNumberOnly = /^[0-9]+$/.test(name);
            return !(isSingleEmoji || isNumberOnly);
          });

          const finalCards = filteredCards.length > 0 ? filteredCards : trelloCards;

          setCards(
            finalCards.map((c, i) => ({
              id: c.id,
              name: c.name,
              framework: "rice",
              reach: 800,
              impact: 3,
              confidence: 0.8,
              effort: 4,
              score: Math.max(50, 480 - i * 30),
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

  // Open framework selection screen when user clicks "Edit scores"
  function handleOpenFrameworkSelect(card) {
    setTargetCard(card);
    const fw = card?.framework || "rice";
    setSelectedFramework(fw);

    // Initialize factor states from card
    setReach(card?.reach !== undefined ? card.reach : 800);
    setImpact(card?.impact !== undefined ? card.impact : 3);
    setConfidence(card?.confidence !== undefined ? card.confidence : 0.8);
    setEffort(card?.effort !== undefined ? card.effort : 4);
    setIceImpact(card?.iceImpact || 8);
    setIceConfidence(card?.iceConfidence || 8);
    setIceEffort(card?.iceEffort || 4);
    setEiImpact(card?.eiImpact || 8);
    setEiEffort(card?.eiEffort || 3);

    setActiveView("choose-framework");
  }

  // Proceed from framework selection to score editing screen (Screen 1)
  function handleProceedToScore() {
    setActiveView("score-card");
  }

  // Cancel back to cards list
  function handleCancelToCards() {
    setActiveView("cards");
    setTargetCard(null);
  }

  // Live score calculation
  const computedScore = useMemo(() => {
    if (selectedFramework === "rice") {
      const r = Number(reach) || 0;
      const imp = Number(impact) || 1;
      const conf = Number(confidence) || 1;
      const eff = Math.max(0.5, Number(effort) || 1);
      return Math.round((r * imp * conf) / eff);
    }
    if (selectedFramework === "ice") {
      const imp = Number(impact) || 1;
      const conf = Number(confidence) || 1;
      const eff = Math.max(0.5, Number(effort) || 1);
      return Math.round((imp * conf * 100) / eff);
    }
    if (selectedFramework === "effort-impact") {
      return Number(impact) || 5;
    }
    return 0;
  }, [selectedFramework, reach, impact, confidence, effort]);

  // Quadrant for Effort vs Impact
  const computedQuadrant = useMemo(() => {
    if (selectedFramework !== "effort-impact") return null;
    if (impact >= 1 && effort <= 5) return "🌟 Quick Win";
    if (impact >= 1 && effort > 5) return "🚀 Major Project";
    if (impact < 1 && effort <= 5) return "⚡ Fill-in";
    return "⏳ Thankless Task";
  }, [selectedFramework, impact, effort]);

  // Impact label formatting for RICE
  const impactLabel = useMemo(() => {
    if (impact === 0.25) return "0.25 (Min)";
    if (impact === 0.5) return "0.5 (Low)";
    if (impact === 1) return "1 (Med)";
    if (impact === 2) return "2 (High)";
    if (impact === 3) return "3 (Massive)";
    return `${impact}`;
  }, [impact]);

  // Confidence label formatting for RICE
  const confidenceLabel = useMemo(() => {
    return `${Math.round(confidence * 100)}%`;
  }, [confidence]);

  // Save score and return to main screen (where scores are displayed)
  function handleApplyScoreAndReturn() {
    if (targetCard) {
      setCards((prev) =>
        prev.map((c) =>
          c.id === targetCard.id
            ? {
                ...c,
                framework: selectedFramework,
                score: computedScore,
                reach,
                impact,
                confidence,
                effort,
                iceImpact,
                iceConfidence,
                iceEffort,
                eiImpact,
                eiEffort,
                quadrant: computedQuadrant,
              }
            : c
        )
      );

      // Save to Trello shared plugin data if available
      if (t && typeof t.set === "function") {
        t.set(targetCard.id, "shared", "priority_score", computedScore).catch(() => {});
        t.set(targetCard.id, "shared", "priority_framework", selectedFramework).catch(() => {});
      }
    }

    // Return to main cards screen
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

  const selectedCount = cards.filter((c) => c.selected).length;
  const activeSet = sets.find((s) => s.id === activeSetId) || sets[0];
  const currentFw = FRAMEWORKS.find((f) => f.id === selectedFramework) || FRAMEWORKS[0];

  // Dynamic slider percentages
  const reachPercent = Math.min(100, Math.max(0, (reach / 2000) * 100));
  const effortPercent = Math.min(100, Math.max(0, ((effort - 1) / 9) * 100));
  const eiImpactPercent = Math.min(100, Math.max(0, (eiImpact / 10) * 100));
  const eiEffortPercent = Math.min(100, Math.max(0, ((eiEffort - 1) / 9) * 100));

  return (
    <div className="prio-container">
      {/* Top Header - only displayed on main cards screen */}
      {activeView === "cards" && (
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
      )}

      {/* ========================================================= */}
      {/* VIEW 1: CHOOSE FRAMEWORK SCREEN                           */}
      {/* ========================================================= */}
      {activeView === "choose-framework" && (
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

            {/* Main Framework Dropdown */}
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

            {/* Framework Details List */}
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

          {/* Action Row: Advance to Score Card */}
          <div className="prio-framework-action-row">
            <button
              type="button"
              className="prio-btn-secondary"
              onClick={handleCancelToCards}
            >
              ← Back to Cards
            </button>
            <button
              type="button"
              className="prio-btn-primary"
              onClick={handleProceedToScore}
            >
              Continue to Edit Scores →
            </button>
          </div>
        </>
      )}

      {/* ========================================================= */}
      {/* VIEW 2: SCORE CARD SCREEN (MATCHING USER REFERENCE IMAGE) */}
      {/* ========================================================= */}
      {activeView === "score-card" && (
        <>
          <div className="prio-scoring-screen">
            {/* Header matching image */}
            <div className="prio-scoring-header">
              <div className="prio-scoring-header-left">
                <button
                  type="button"
                  className="prio-back-btn"
                  onClick={() => setActiveView("choose-framework")}
                  title="Back to Framework Selection"
                >
                  ←
                </button>
                <div className="prio-scoring-icon-box">
                  <SparkleStarIcon />
                </div>
                <div className="prio-scoring-titles">
                  <h2 className="prio-scoring-title-text">PRIORITIZE</h2>
                  <p className="prio-scoring-subtitle">
                    Power-Up on this card
                    {targetCard && (
                      <span className="prio-scoring-target-tag">
                        · {targetCard.name}
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* Framework Dropdown */}
              <div className="prio-scoring-fw-wrap">
                <span className="prio-scoring-fw-label">Framework:</span>
                <select
                  className="prio-scoring-fw-dropdown"
                  value={selectedFramework}
                  onChange={(e) => setSelectedFramework(e.target.value)}
                >
                  {FRAMEWORKS.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.short}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Divider line matching reference */}
            <div className="prio-scoring-divider" />

            {/* Factor Controls */}
            <div className="prio-scoring-body">
              {/* RICE SCORING (EXACT PHOTO FEATURES) */}
              {selectedFramework === "rice" && (
                <>
                  {/* Reach */}
                  <div className="prio-scoring-factor-item">
                    <div className="prio-scoring-factor-head">
                      <span className="prio-scoring-factor-name">Reach (users/month impacted)</span>
                      <span className="prio-scoring-val-blue">{reach}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="2000"
                      step="50"
                      value={reach}
                      onChange={(e) => setReach(Number(e.target.value))}
                      className="prio-range-slider prio-slider-blue"
                      style={{
                        background: `linear-gradient(to right, #2563EB 0%, #2563EB ${reachPercent}%, #CBD5E1 ${reachPercent}%, #CBD5E1 100%)`,
                      }}
                    />
                  </div>

                  {/* Impact */}
                  <div className="prio-scoring-factor-item">
                    <div className="prio-scoring-factor-head">
                      <span className="prio-scoring-factor-name">Impact (per user)</span>
                      <span className="prio-scoring-val-white">{impactLabel}</span>
                    </div>
                    <div className="prio-pills-row">
                      {[
                        { val: 0.25, label: "0.25 Min" },
                        { val: 0.5, label: "0.5 Low" },
                        { val: 1, label: "1 Med" },
                        { val: 2, label: "2 High" },
                        { val: 3, label: "3 Massive" },
                      ].map((item) => (
                        <button
                          key={item.val}
                          type="button"
                          className={`prio-pill-button ${impact === item.val ? "active" : ""}`}
                          onClick={() => setImpact(item.val)}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Confidence */}
                  <div className="prio-scoring-factor-item">
                    <div className="prio-scoring-factor-head">
                      <span className="prio-scoring-factor-name">Confidence</span>
                      <span className="prio-scoring-val-white">{confidenceLabel}</span>
                    </div>
                    <div className="prio-pills-row">
                      {[
                        { val: 0.5, label: "50% (Low)" },
                        { val: 0.8, label: "80% (Medium)" },
                        { val: 1.0, label: "100% (High)" },
                      ].map((item) => (
                        <button
                          key={item.val}
                          type="button"
                          className={`prio-pill-button ${confidence === item.val ? "active" : ""}`}
                          onClick={() => setConfidence(item.val)}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Effort */}
                  <div className="prio-scoring-factor-item">
                    <div className="prio-scoring-factor-head">
                      <span className="prio-scoring-factor-name">Effort (person-months or sprints)</span>
                      <span className="prio-scoring-val-orange">{effort}</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      step="1"
                      value={effort}
                      onChange={(e) => setEffort(Number(e.target.value))}
                      className="prio-range-slider prio-slider-orange"
                      style={{
                        background: `linear-gradient(to right, #EA580C 0%, #EA580C ${effortPercent}%, #333C44 ${effortPercent}%, #333C44 100%)`,
                      }}
                    />
                  </div>
                </>
              )}

              {/* ICE SCORING (SAME RICH SEGMENTED PILLS & CONTROLS) */}
              {selectedFramework === "ice" && (
                <>
                  {/* Impact */}
                  <div className="prio-scoring-factor-item">
                    <div className="prio-scoring-factor-head">
                      <span className="prio-scoring-factor-name">Impact (per user)</span>
                      <span className="prio-scoring-val-white">{impactLabel}</span>
                    </div>
                    <div className="prio-pills-row">
                      {[
                        { val: 0.25, label: "0.25 Min" },
                        { val: 0.5, label: "0.5 Low" },
                        { val: 1, label: "1 Med" },
                        { val: 2, label: "2 High" },
                        { val: 3, label: "3 Massive" },
                      ].map((item) => (
                        <button
                          key={item.val}
                          type="button"
                          className={`prio-pill-button ${impact === item.val ? "active" : ""}`}
                          onClick={() => setImpact(item.val)}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Confidence */}
                  <div className="prio-scoring-factor-item">
                    <div className="prio-scoring-factor-head">
                      <span className="prio-scoring-factor-name">Confidence</span>
                      <span className="prio-scoring-val-white">{confidenceLabel}</span>
                    </div>
                    <div className="prio-pills-row">
                      {[
                        { val: 0.5, label: "50% (Low)" },
                        { val: 0.8, label: "80% (Medium)" },
                        { val: 1.0, label: "100% (High)" },
                      ].map((item) => (
                        <button
                          key={item.val}
                          type="button"
                          className={`prio-pill-button ${confidence === item.val ? "active" : ""}`}
                          onClick={() => setConfidence(item.val)}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Effort / Ease */}
                  <div className="prio-scoring-factor-item">
                    <div className="prio-scoring-factor-head">
                      <span className="prio-scoring-factor-name">Effort / Ease (person-months or sprints)</span>
                      <span className="prio-scoring-val-orange">{effort}</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      step="1"
                      value={effort}
                      onChange={(e) => setEffort(Number(e.target.value))}
                      className="prio-range-slider prio-slider-orange"
                      style={{
                        background: `linear-gradient(to right, #EA580C 0%, #EA580C ${effortPercent}%, #333C44 ${effortPercent}%, #333C44 100%)`,
                      }}
                    />
                  </div>
                </>
              )}

              {/* EFFORT VS IMPACT SCORING */}
              {selectedFramework === "effort-impact" && (
                <>
                  <div className="prio-scoring-factor-item">
                    <div className="prio-scoring-factor-head">
                      <span className="prio-scoring-factor-name">Impact</span>
                      <span className="prio-scoring-val-white">{impactLabel}</span>
                    </div>
                    <div className="prio-pills-row">
                      {[
                        { val: 0.25, label: "0.25 Min" },
                        { val: 0.5, label: "0.5 Low" },
                        { val: 1, label: "1 Med" },
                        { val: 2, label: "2 High" },
                        { val: 3, label: "3 Massive" },
                      ].map((item) => (
                        <button
                          key={item.val}
                          type="button"
                          className={`prio-pill-button ${impact === item.val ? "active" : ""}`}
                          onClick={() => setImpact(item.val)}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="prio-scoring-factor-item">
                    <div className="prio-scoring-factor-head">
                      <span className="prio-scoring-factor-name">Effort</span>
                      <span className="prio-scoring-val-orange">{effort}</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      step="1"
                      value={effort}
                      onChange={(e) => setEffort(Number(e.target.value))}
                      className="prio-range-slider prio-slider-orange"
                      style={{
                        background: `linear-gradient(to right, #EA580C 0%, #EA580C ${effortPercent}%, #333C44 ${effortPercent}%, #333C44 100%)`,
                      }}
                    />
                  </div>
                </>
              )}

              {/* Result Score Card matching reference photo */}
              <div className="prio-score-result-card">
                <span className="prio-score-result-label">
                  {currentFw.short} SCORE
                </span>
                <span className="prio-score-result-value">
                  {computedQuadrant ? computedQuadrant : computedScore}
                </span>
              </div>

              {/* Primary Action Button */}
              <button
                type="button"
                className="prio-btn-apply"
                onClick={handleApplyScoreAndReturn}
              >
                <FloppyDiskIcon />
                <span>Apply {currentFw.short} Badge to Card</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* ========================================================= */}
      {/* VIEW 3: MAIN CARDS LIST (WHERE SCORES ARE DISPLAYED)      */}
      {/* ========================================================= */}
      {activeView === "cards" && (
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
              {cards.map((card, idx) => {
                const isRICE = (card.framework || "rice").toLowerCase() === "rice";
                const isHighPriority = card.score >= 350;

                return (
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
                        <span
                          className="prio-rank-pill"
                          title={`Prioritization Score (${(card.framework || "RICE").toUpperCase()})`}
                          style={
                            isHighPriority
                              ? {
                                  background: "rgba(248, 113, 104, 0.16)",
                                  borderColor: "rgba(248, 113, 104, 0.4)",
                                  color: "#FCA5A5",
                                }
                              : card.score >= 100
                              ? {
                                  background: "rgba(87, 157, 255, 0.14)",
                                  borderColor: "rgba(87, 157, 255, 0.35)",
                                  color: "#579DFF",
                                }
                              : {}
                          }
                        >
                          {isSortedByRank ? `#${idx + 1} · ` : ""}
                          {card.quadrant
                            ? card.quadrant
                            : `🏆 ${card.score} ${(card.framework || "RICE").toUpperCase()}`}
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
                );
              })}
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

      {/* Docked Footer - only displayed on main cards screen */}
      {activeView === "cards" && (
        <footer className="prio-footer-bar">
          <p className="prio-footer-tip">
            <span>💡</span> Tip: You can also score cards individually by clicking Edit scores on any card.
          </p>
          <span className="prio-footer-brand">Task Prioritize Power-Up</span>
        </footer>
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

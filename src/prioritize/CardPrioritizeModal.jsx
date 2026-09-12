import React, { useState, useEffect, useMemo } from "react";
import { FRAMEWORKS, FRAMEWORK_LIST, getCardBadge } from "../lib/frameworks.js";
import "./cardModal.css";

// Glowing Sparkle Icon matching Image 1
function SparkleStarIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      {/* Center 4-point sparkle */}
      <path
        d="M12 2C12 7.5 7.5 12 2 12C7.5 12 12 16.5 12 22C12 16.5 16.5 12 22 12C16.5 12 12 7.5 12 2Z"
        fill="#FFFFFF"
      />
      {/* Top right mini sparkle */}
      <circle cx="19" cy="5" r="1.5" fill="#93C5FD" />
      {/* Bottom left mini sparkle */}
      <circle cx="5" cy="19" r="1" fill="#93C5FD" />
    </svg>
  );
}

// Floppy Disk / Save Icon matching Image 1 button
function DiskIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" />
      <polyline points="7 3 7 8 15 8" />
    </svg>
  );
}

// Close Icon
function CloseIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export default function CardPrioritizeModal({ card, onApply, onClose }) {
  // Normalize card framework
  const initialFw = (card?.framework || "RICE").toUpperCase().replace(/\s+/g, "_");
  const [activeFwKey, setActiveFwKey] = useState(
    FRAMEWORKS[initialFw] ? initialFw : "RICE"
  );

  // RICE factors
  const [reach, setReach] = useState(card?.reach !== undefined ? card.reach : 800);
  const [impact, setImpact] = useState(card?.impact !== undefined ? card.impact : 3);
  const [confidence, setConfidence] = useState(card?.confidence !== undefined ? card.confidence : 0.8);
  const [effort, setEffort] = useState(card?.effort !== undefined ? card.effort : 4);

  // EFFORT VS IMPACT factors
  const [eiImpact, setEiImpact] = useState(card?.eiImpact || 8.5);
  const [eiEffort, setEiEffort] = useState(card?.eiEffort || 4);

  // WSJF factors
  const [userValue, setUserValue] = useState(card?.userValue !== undefined ? card.userValue : 8);
  const [timeCriticality, setTimeCriticality] = useState(card?.timeCriticality !== undefined ? card.timeCriticality : 5);
  const [riskReduction, setRiskReduction] = useState(card?.riskReduction !== undefined ? card.riskReduction : 6.5);
  const [jobSize, setJobSize] = useState(card?.jobSize !== undefined ? card.jobSize : 1);

  // MOSCOW factor
  const [moscowCat, setMoscowCat] = useState(card?.moscowCat || "must");

  // ICE factors
  const [iceImpact, setIceImpact] = useState(card?.iceImpact || 8);
  const [iceConfidence, setIceConfidence] = useState(card?.iceConfidence || 8);
  const [iceEase, setIceEase] = useState(card?.iceEase || 6);

  const [appliedToast, setAppliedToast] = useState(false);

  // Active framework definition
  const currentFw = FRAMEWORKS[activeFwKey] || FRAMEWORKS.RICE;

  // Calculate live score
  const computedScore = useMemo(() => {
    switch (activeFwKey) {
      case "RICE":
        return currentFw.calculateScore({ reach, impact, confidence, effort });
      case "EFFORT_IMPACT":
        return currentFw.calculateScore({ impact: eiImpact, effort: eiEffort });
      case "WSJF":
        return currentFw.calculateScore({ userValue, timeCriticality, riskReduction, jobSize });
      case "MOSCOW":
        return currentFw.calculateScore({ category: moscowCat });
      case "ICE":
        return currentFw.calculateScore({ impact: iceImpact, confidence: iceConfidence, ease: iceEase });
      default:
        return 0;
    }
  }, [activeFwKey, reach, impact, confidence, effort, eiImpact, eiEffort, userValue, timeCriticality, riskReduction, jobSize, moscowCat, iceImpact, iceConfidence, iceEase, currentFw]);

  // Handle Apply badge
  function handleApply() {
    const updatedData = {
      ...(card || {}),
      framework: currentFw.label,
      score: computedScore,
      reach,
      impact,
      confidence,
      effort,
      eiImpact,
      eiEffort,
      userValue,
      timeCriticality,
      riskReduction,
      jobSize,
      moscowCat,
      iceImpact,
      iceConfidence,
      iceEase,
    };

    const badge = currentFw.formatBadge(computedScore, updatedData);
    updatedData.badge = badge;

    if (onApply) {
      onApply(updatedData);
    }

    setAppliedToast(true);
    setTimeout(() => {
      setAppliedToast(false);
      if (onClose) {
        onClose();
      }
    }, 600);
  }

  // Calculate percentage fills for sliders
  const reachPercent = Math.min(100, Math.max(0, (reach / 2000) * 100));
  const effortPercent = Math.min(100, Math.max(0, ((effort - 1) / 9) * 100));
  const eiImpactPercent = Math.min(100, Math.max(0, (eiImpact / 10) * 100));
  const eiEffortPercent = Math.min(100, Math.max(0, ((eiEffort - 1) / 9) * 100));

  // Impact label lookup
  const currentImpactLabel = useMemo(() => {
    const opt = FRAMEWORKS.RICE.impactOptions.find((o) => o.value === impact);
    if (opt) {
      if (opt.value === 0.25) return "0.25 (Minimal)";
      if (opt.value === 0.5) return "0.5 (Low)";
      if (opt.value === 1) return "1 (Medium)";
      if (opt.value === 2) return "2 (High)";
      if (opt.value === 3) return "3 (Massive)";
    }
    return `${impact}`;
  }, [impact]);

  return (
    <div className="card-modal-container">
      {/* Header */}
      <div className="card-modal-header">
        <div className="card-modal-header-left">
          <div className="card-modal-brand-icon">
            <SparkleStarIcon />
          </div>
          <div className="card-modal-brand-text">
            <h2 className="card-modal-title">PRIORITIZE</h2>
            <p className="card-modal-subtitle">Power-Up on this card</p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div className="card-modal-framework-select-wrap">
            <span className="card-modal-framework-label">Framework:</span>
            <select
              className="card-modal-framework-select"
              value={activeFwKey}
              onChange={(e) => setActiveFwKey(e.target.value)}
            >
              {FRAMEWORK_LIST.map((fw) => (
                <option key={fw.id} value={fw.id}>
                  {fw.label}
                </option>
              ))}
            </select>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              style={{
                background: "transparent",
                border: "none",
                color: "#94a3b8",
                cursor: "pointer",
                padding: "6px",
                borderRadius: "6px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              title="Close modal"
            >
              <CloseIcon />
            </button>
          )}
        </div>
      </div>

      <div className="card-modal-divider" />

      {/* Target card banner if specified */}
      {card?.name && (
        <div className="card-modal-target-banner">
          <span>Target Card: <strong className="card-modal-target-title">{card.name}</strong></span>
          <span style={{ fontSize: "11px", opacity: 0.85 }}>Framework: {currentFw.label}</span>
        </div>
      )}

      {/* Body: Framework specific inputs */}
      <div className="card-modal-body">
        {/* ======================= RICE INPUTS (IMAGE 1 EXACT) ======================= */}
        {activeFwKey === "RICE" && (
          <>
            {/* Reach Slider */}
            <div className="card-modal-factor-row">
              <div className="card-modal-factor-header">
                <span className="card-modal-factor-name">Reach (users/month impacted)</span>
                <span className="card-modal-factor-value val-blue">{reach}</span>
              </div>
              <input
                type="range"
                min="0"
                max="2000"
                step="50"
                value={reach}
                onChange={(e) => setReach(Number(e.target.value))}
                className="card-modal-slider slider-blue"
                style={{
                  background: `linear-gradient(to right, #2563eb 0%, #2563eb ${reachPercent}%, #334155 ${reachPercent}%, #334155 100%)`,
                }}
              />
            </div>

            {/* Impact Pills */}
            <div className="card-modal-factor-row">
              <div className="card-modal-factor-header">
                <span className="card-modal-factor-name">Impact (per user)</span>
                <span className="card-modal-factor-value">{currentImpactLabel}</span>
              </div>
              <div className="card-modal-pills">
                {FRAMEWORKS.RICE.impactOptions.map((opt) => {
                  const isSelected = impact === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      className={`card-modal-pill ${isSelected ? "active" : ""}`}
                      onClick={() => setImpact(opt.value)}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Confidence Pills */}
            <div className="card-modal-factor-row">
              <div className="card-modal-factor-header">
                <span className="card-modal-factor-name">Confidence</span>
                <span className="card-modal-factor-value">{Math.round(confidence * 100)}%</span>
              </div>
              <div className="card-modal-pills">
                {FRAMEWORKS.RICE.confidenceOptions.map((opt) => {
                  const isSelected = confidence === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      className={`card-modal-pill ${isSelected ? "active" : ""}`}
                      onClick={() => setConfidence(opt.value)}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Effort Slider */}
            <div className="card-modal-factor-row">
              <div className="card-modal-factor-header">
                <span className="card-modal-factor-name">Effort (person-months or sprints)</span>
                <span className="card-modal-factor-value val-orange">{effort}</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={effort}
                onChange={(e) => setEffort(Number(e.target.value))}
                className="card-modal-slider slider-orange"
                style={{
                  background: `linear-gradient(to right, #ea580c 0%, #ea580c ${effortPercent}%, #334155 ${effortPercent}%, #334155 100%)`,
                }}
              />
            </div>
          </>
        )}

        {/* ======================= EFFORT VS IMPACT INPUTS ======================= */}
        {activeFwKey === "EFFORT_IMPACT" && (
          <>
            {/* Impact */}
            <div className="card-modal-factor-row">
              <div className="card-modal-factor-header">
                <span className="card-modal-factor-name">Impact (1 to 10)</span>
                <span className="card-modal-factor-value val-blue">{eiImpact}</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                step="0.5"
                value={eiImpact}
                onChange={(e) => setEiImpact(Number(e.target.value))}
                className="card-modal-slider slider-blue"
                style={{
                  background: `linear-gradient(to right, #2563eb 0%, #2563eb ${eiImpactPercent}%, #334155 ${eiImpactPercent}%, #334155 100%)`,
                }}
              />
            </div>

            {/* Effort */}
            <div className="card-modal-factor-row">
              <div className="card-modal-factor-header">
                <span className="card-modal-factor-name">Effort / Complexity (1 to 10)</span>
                <span className="card-modal-factor-value val-orange">{eiEffort}</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={eiEffort}
                onChange={(e) => setEiEffort(Number(e.target.value))}
                className="card-modal-slider slider-orange"
                style={{
                  background: `linear-gradient(to right, #ea580c 0%, #ea580c ${eiEffortPercent}%, #334155 ${eiEffortPercent}%, #334155 100%)`,
                }}
              />
            </div>

            {/* Matrix Quadrant preview */}
            <div style={{ background: "#111827", padding: "10px 14px", borderRadius: "8px", border: "1px solid #1f293d", fontSize: "12.5px" }}>
              <span style={{ color: "#94a3b8" }}>Quadrant: </span>
              <strong style={{ color: eiImpact >= 5 && eiEffort <= 5 ? "#4bce97" : eiImpact >= 5 ? "#38bdf8" : "#f59e0b" }}>
                {eiImpact >= 5 && eiEffort <= 5 ? "🌟 Quick Win" : eiImpact >= 5 ? "🚀 Major Project" : eiEffort <= 5 ? "⚡ Fill-in" : "⏳ Thankless Task"}
              </strong>
            </div>
          </>
        )}

        {/* ======================= WSJF INPUTS ======================= */}
        {activeFwKey === "WSJF" && (
          <>
            <div className="card-modal-factor-row">
              <div className="card-modal-factor-header">
                <span className="card-modal-factor-name">User-Business Value</span>
                <span className="card-modal-factor-value val-blue">{userValue}</span>
              </div>
              <input
                type="range"
                min="1"
                max="20"
                step="1"
                value={userValue}
                onChange={(e) => setUserValue(Number(e.target.value))}
                className="card-modal-slider slider-blue"
                style={{ background: `linear-gradient(to right, #2563eb 0%, #2563eb ${(userValue / 20) * 100}%, #334155 ${(userValue / 20) * 100}%, #334155 100%)` }}
              />
            </div>

            <div className="card-modal-factor-row">
              <div className="card-modal-factor-header">
                <span className="card-modal-factor-name">Time Criticality</span>
                <span className="card-modal-factor-value val-blue">{timeCriticality}</span>
              </div>
              <input
                type="range"
                min="1"
                max="20"
                step="1"
                value={timeCriticality}
                onChange={(e) => setTimeCriticality(Number(e.target.value))}
                className="card-modal-slider slider-blue"
                style={{ background: `linear-gradient(to right, #2563eb 0%, #2563eb ${(timeCriticality / 20) * 100}%, #334155 ${(timeCriticality / 20) * 100}%, #334155 100%)` }}
              />
            </div>

            <div className="card-modal-factor-row">
              <div className="card-modal-factor-header">
                <span className="card-modal-factor-name">Risk Reduction / Opp Enablement</span>
                <span className="card-modal-factor-value val-blue">{riskReduction}</span>
              </div>
              <input
                type="range"
                min="1"
                max="20"
                step="0.5"
                value={riskReduction}
                onChange={(e) => setRiskReduction(Number(e.target.value))}
                className="card-modal-slider slider-blue"
                style={{ background: `linear-gradient(to right, #2563eb 0%, #2563eb ${(riskReduction / 20) * 100}%, #334155 ${(riskReduction / 20) * 100}%, #334155 100%)` }}
              />
            </div>

            <div className="card-modal-factor-row">
              <div className="card-modal-factor-header">
                <span className="card-modal-factor-name">Job Size / Effort</span>
                <span className="card-modal-factor-value val-orange">{jobSize}</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={jobSize}
                onChange={(e) => setJobSize(Number(e.target.value))}
                className="card-modal-slider slider-orange"
                style={{ background: `linear-gradient(to right, #ea580c 0%, #ea580c ${((jobSize - 1) / 9) * 100}%, #334155 ${((jobSize - 1) / 9) * 100}%, #334155 100%)` }}
              />
            </div>
          </>
        )}

        {/* ======================= MOSCOW INPUTS ======================= */}
        {activeFwKey === "MOSCOW" && (
          <div className="card-modal-factor-row">
            <div className="card-modal-factor-header">
              <span className="card-modal-factor-name">MoSCoW Priority Tier</span>
              <span className="card-modal-factor-value">
                {FRAMEWORKS.MOSCOW.categoryOptions.find((o) => o.id === moscowCat)?.label}
              </span>
            </div>
            <div className="card-modal-pills">
              {FRAMEWORKS.MOSCOW.categoryOptions.map((opt) => {
                const isSelected = moscowCat === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    className={`card-modal-pill ${isSelected ? "active" : ""}`}
                    onClick={() => setMoscowCat(opt.id)}
                    style={isSelected ? { background: opt.color, borderColor: opt.color } : {}}
                  >
                    {opt.label} ({opt.score})
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ======================= ICE INPUTS ======================= */}
        {activeFwKey === "ICE" && (
          <>
            <div className="card-modal-factor-row">
              <div className="card-modal-factor-header">
                <span className="card-modal-factor-name">Impact (1-10)</span>
                <span className="card-modal-factor-value val-blue">{iceImpact}</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={iceImpact}
                onChange={(e) => setIceImpact(Number(e.target.value))}
                className="card-modal-slider slider-blue"
              />
            </div>

            <div className="card-modal-factor-row">
              <div className="card-modal-factor-header">
                <span className="card-modal-factor-name">Confidence (1-10)</span>
                <span className="card-modal-factor-value val-blue">{iceConfidence}</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={iceConfidence}
                onChange={(e) => setIceConfidence(Number(e.target.value))}
                className="card-modal-slider slider-blue"
              />
            </div>

            <div className="card-modal-factor-row">
              <div className="card-modal-factor-header">
                <span className="card-modal-factor-name">Ease (1-10)</span>
                <span className="card-modal-factor-value val-orange">{iceEase}</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={iceEase}
                onChange={(e) => setIceEase(Number(e.target.value))}
                className="card-modal-slider slider-orange"
              />
            </div>
          </>
        )}
      </div>

      {/* Score Box */}
      <div className="card-modal-score-box">
        <div className="card-modal-score-label">
          {currentFw.label} SCORE
        </div>
        <div className="card-modal-score-num">
          {computedScore}
        </div>
        <div className="card-modal-score-sub">
          Formula: {currentFw.formulaText}
        </div>
      </div>

      {appliedToast && (
        <div className="card-modal-applied-toast">
          ✓ {currentFw.label} badge updated on card!
        </div>
      )}

      {/* Primary Action Button */}
      <button
        type="button"
        className="card-modal-apply-btn"
        onClick={handleApply}
      >
        <span className="card-modal-btn-icon">
          <DiskIcon />
        </span>
        <span>Apply {currentFw.label} Badge to Card</span>
      </button>
    </div>
  );
}

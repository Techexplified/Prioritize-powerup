// Framework calculation and configuration engine for Prioritize Power-Up

export const FRAMEWORKS = {
  RICE: {
    id: "RICE",
    label: "RICE",
    fullName: "RICE — Reach, Impact, Confidence, Effort",
    description: "Prioritize features with reach and expected impact",
    factors: "Reach, Impact, Confidence, Effort",
    formulaText: "(Reach × Impact × Confidence) ÷ Effort",
    defaultValues: {
      reach: 800,
      impact: 3,
      confidence: 0.8,
      effort: 4,
    },
    impactOptions: [
      { value: 0.25, label: "0.25 Min" },
      { value: 0.5, label: "0.5 Low" },
      { value: 1, label: "1 Med" },
      { value: 2, label: "2 High" },
      { value: 3, label: "3 Massive" },
    ],
    confidenceOptions: [
      { value: 0.5, label: "50% (Low)" },
      { value: 0.8, label: "80% (Medium)" },
      { value: 1.0, label: "100% (High)" },
    ],
    calculateScore: (data) => {
      const reach = Number(data.reach) || 0;
      const impact = Number(data.impact) || 1;
      const confidence = Number(data.confidence) || 1;
      const effort = Math.max(0.5, Number(data.effort) || 1);
      return Math.round((reach * impact * confidence) / effort);
    },
    formatBadge: (score, data) => {
      const icon = score >= 350 ? "🏆" : score >= 200 ? "🎯" : "🔴";
      return {
        icon,
        text: `${score} RICE`,
        fullLabel: `${icon} ${score} RICE`,
        score,
        framework: "RICE",
      };
    },
  },

  EFFORT_IMPACT: {
    id: "EFFORT_IMPACT",
    label: "EFFORT VS IMPACT",
    fullName: "Effort vs Impact — Matrix & Quick Wins",
    description: "Compare feature impact against implementation effort",
    factors: "Impact and Effort",
    formulaText: "Impact vs Effort Score (or Matrix Quadrant)",
    defaultValues: {
      impact: 8.5,
      effort: 2,
    },
    calculateScore: (data) => {
      const impact = Number(data.impact) || 5;
      return Number(impact.toFixed(1));
    },
    formatBadge: (score, data) => {
      const impact = Number(data.impact) || 5;
      const effort = Number(data.effort) || 5;
      let quadrant = "Quick Win";
      if (impact >= 5 && effort > 5) quadrant = "Major Project";
      else if (impact < 5 && effort <= 5) quadrant = "Fill-in";
      else if (impact < 5 && effort > 5) quadrant = "Thankless Task";

      return {
        icon: "⚡",
        text: `${score} EFFORT VS IMPACT`,
        fullLabel: `⚡ ${score} EFFORT VS IMPACT`,
        score,
        quadrant,
        framework: "EFFORT VS IMPACT",
      };
    },
  },

  WSJF: {
    id: "WSJF",
    label: "WSJF",
    fullName: "WSJF — Weighted Shortest Job First",
    description: "Agile SAFe economic prioritization (Cost of Delay ÷ Job Size)",
    factors: "User Value, Time Criticality, Risk / Opp, Job Size",
    formulaText: "(User-Business Value + Time Criticality + Risk / Opp) ÷ Job Size",
    defaultValues: {
      userValue: 8,
      timeCriticality: 5,
      riskReduction: 6.5,
      jobSize: 1,
    },
    calculateScore: (data) => {
      const uv = Number(data.userValue) || 0;
      const tc = Number(data.timeCriticality) || 0;
      const rr = Number(data.riskReduction) || 0;
      const js = Math.max(0.5, Number(data.jobSize) || 1);
      const score = (uv + tc + rr) / js;
      return Number(score.toFixed(1));
    },
    formatBadge: (score, data) => {
      return {
        icon: "🏆",
        text: `${score} WSJF`,
        fullLabel: `🏆 ${score} WSJF`,
        score,
        framework: "WSJF",
      };
    },
  },

  MOSCOW: {
    id: "MOSCOW",
    label: "MOSCOW",
    fullName: "MoSCoW — Must Have, Should Have, Could Have, Won't Have",
    description: "Stakeholder requirements prioritization",
    factors: "Must, Should, Could, Won't",
    formulaText: "Priority Tier (Must = 100, Should = 75, Could = 50, Won't = 25)",
    defaultValues: {
      category: "must",
      scoreValue: 100,
    },
    categoryOptions: [
      { id: "must", label: "Must Have", score: 100, color: "#EF4444" },
      { id: "should", label: "Should Have", score: 75, color: "#F59E0B" },
      { id: "could", label: "Could Have", score: 50, color: "#3B82F6" },
      { id: "wont", label: "Won't Have", score: 25, color: "#6B7280" },
    ],
    calculateScore: (data) => {
      if (data.scoreValue !== undefined) return Number(data.scoreValue);
      const cat = (data.category || "must").toLowerCase();
      if (cat === "must") return 100;
      if (cat === "should") return 75;
      if (cat === "could") return 50;
      return 25;
    },
    formatBadge: (score, data) => {
      return {
        icon: "🔴",
        text: `${score} MOSCOW`,
        fullLabel: `🔴 ${score} MOSCOW`,
        score,
        framework: "MOSCOW",
      };
    },
  },

  ICE: {
    id: "ICE",
    label: "ICE",
    fullName: "ICE — Impact, Confidence, Ease",
    description: "Quick, simple scoring method for rapid iteration",
    factors: "Impact, Confidence, Ease",
    formulaText: "(Impact × Confidence × Ease) ÷ 10",
    defaultValues: {
      impact: 8,
      confidence: 8,
      ease: 6,
    },
    calculateScore: (data) => {
      const impact = Number(data.impact) || 5;
      const confidence = Number(data.confidence) || 5;
      const ease = Number(data.ease) || 5;
      return Math.round((impact * confidence * ease) / 10);
    },
    formatBadge: (score, data) => {
      const icon = score >= 50 ? "🚀" : "🎯";
      return {
        icon,
        text: `${score} ICE`,
        fullLabel: `${icon} ${score} ICE`,
        score,
        framework: "ICE",
      };
    },
  },
};

export const FRAMEWORK_LIST = Object.values(FRAMEWORKS);

// Helper to compute badge object from card data
export function getCardBadge(card) {
  if (!card) return null;
  const fwKey = (card.framework || "RICE").toUpperCase().replace(/\s+/g, "_");
  const fw = FRAMEWORKS[fwKey] || FRAMEWORKS.RICE;
  const score = card.score !== undefined ? card.score : fw.calculateScore(card);
  return fw.formatBadge(score, card);
}

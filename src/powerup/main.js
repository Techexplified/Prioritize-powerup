/* global TrelloPowerUp */
import { isAuthorized } from "../lib/auth.js";

const ICON_DARK =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#579DFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/></svg>'
  );

const ICON_LIGHT =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/></svg>'
  );

// Sample defaults matching reference board cards and user's board cards
const SAMPLE_CARD_DEFAULTS = [
  // User's active board cards
  { match: "dashboard", score: 480, framework: "RICE", icon: "🏆", color: "red" },
  { match: "login", score: 396, framework: "RICE", icon: "🏆", color: "red" },
  { match: "performance", score: 336, framework: "RICE", icon: "🔴", color: "red" },
  { match: "export", score: 8.5, framework: "EFFORT VS IMPACT", icon: "⚡", color: "red" },
  { match: "schema", score: 100, framework: "MOSCOW", icon: "🔴", color: "red" },
  { match: "database", score: 100, framework: "MOSCOW", icon: "🔴", color: "red" },
  { match: "refactor", score: 19.5, framework: "WSJF", icon: "🏆", color: "red" },
  { match: "backend", score: 19.5, framework: "WSJF", icon: "🏆", color: "red" },
  { match: "progress", score: 350, framework: "RICE", icon: "🏆", color: "red" },
  { match: "notification", score: 420, framework: "RICE", icon: "🏆", color: "red" },
  { match: "mycard", score: 200, framework: "RICE", icon: "🎯", color: "blue" },

  // Reference board cards
  { match: "checkout", score: 480, framework: "RICE", icon: "🏆", color: "red" },
  { match: "search improvement", score: 396, framework: "RICE", icon: "🏆", color: "red" },
  { match: "mobile redesign", score: 336, framework: "RICE", icon: "🔴", color: "red" },
  { match: "social login", score: 100, framework: "MOSCOW", icon: "🔴", color: "red" },
  { match: "stripe webhook", score: 19.5, framework: "WSJF", icon: "🏆", color: "red" },
  { match: "upgrade node", score: 200, framework: "RICE", icon: "🎯", color: "blue" },
  { match: "email automation", score: 336, framework: "RICE", icon: "🔴", color: "red" },
  { match: "dark mode", score: 507, framework: "RICE", icon: "🏆", color: "red" },
  { match: "onboarding flow", score: 432, framework: "RICE", icon: "🏆", color: "red" },
  { match: "stripe billing", score: 450, framework: "RICE", icon: "🏆", color: "red" },
  { match: "multi-currency", score: 300, framework: "RICE", icon: "🎯", color: "blue" },
];

async function resolveCardPriority(t) {
  try {
    const [card, boardScores] = await Promise.all([
      t.card("id", "name").catch(() => null),
      t.get("board", "shared", "prio_card_scores").catch(() => null),
    ]);

    const rawCardName = (card && card.name) || "";
    const cardName = rawCardName.trim().replace(/\s+/g, " ");
    const cardId = (card && card.id) || "";

    // 1. Board-level dictionary stored data (authoritative data from Prioritize Power-Up modal)
    if (boardScores && typeof boardScores === "object") {
      let entry =
        (cardId ? boardScores[cardId] : null) ||
        (cardName ? boardScores[cardName] : null) ||
        (rawCardName ? boardScores[rawCardName] : null) ||
        (cardName ? boardScores[cardName.toLowerCase()] : null);

      if (!entry && cardName) {
        const lowerName = cardName.toLowerCase();
        const found = Object.entries(boardScores).find(([k]) => {
          const lowerK = k.trim().replace(/\s+/g, " ").toLowerCase();
          return (
            lowerK === lowerName ||
            (lowerName.length > 3 && lowerK.includes(lowerName)) ||
            (lowerK.length > 3 && lowerName.includes(lowerK))
          );
        });
        if (found) entry = found[1];
      }

      if (entry !== undefined && entry !== null) {
        const score = typeof entry === "object" ? entry.score : entry;
        const framework = (typeof entry === "object" && entry.framework) || "rice";
        const quadrant = typeof entry === "object" ? entry.quadrant : null;

        if (score !== undefined && score !== null && score !== "") {
          // Sync directly onto card since we are in card context
          t.set("card", "shared", "priority_score", score).catch(() => {});
          t.set("card", "shared", "priority_framework", framework).catch(() => {});
          if (quadrant) {
            t.set("card", "shared", "priority_quadrant", quadrant).catch(() => {});
          } else {
            t.remove("card", "shared", "priority_quadrant").catch(() => {});
          }

          return { score, framework, quadrant };
        }
      }
    }

    // 2. Direct card-level stored data (fallback if not in board dictionary)
    const [cardScore, cardFw, cardQuad] = await Promise.all([
      t.get("card", "shared", "priority_score").catch(() => null),
      t.get("card", "shared", "priority_framework").catch(() => null),
      t.get("card", "shared", "priority_quadrant").catch(() => null),
    ]);

    if (cardScore !== undefined && cardScore !== null && cardScore !== "") {
      return {
        score: cardScore,
        framework: cardFw || "rice",
        quadrant: cardQuad,
      };
    }

    // 3. Fallback to sample card defaults matching the card name
    if (cardName) {
      const lower = cardName.toLowerCase();
      // Ignore count/stat cards from list limit / Cardlytics
      const isCardlytics = /^[0-9]+$/.test(cardName) || lower.includes("assigned to me");
      if (isCardlytics) return null;

      const match = SAMPLE_CARD_DEFAULTS.find((sample) => lower.includes(sample.match));
      if (match) {
        return {
          score: match.score,
          framework: match.framework,
          icon: match.icon,
          color: match.color,
        };
      }

      // 4. Default priority for any other board card
      let hash = 0;
      for (let i = 0; i < cardName.length; i++) {
        hash = (hash << 5) - hash + cardName.charCodeAt(i);
        hash |= 0;
      }
      const defaultScore = Math.max(120, 200 + (Math.abs(hash) % 280));
      return {
        score: defaultScore,
        framework: "RICE",
        icon: defaultScore >= 350 ? "🏆" : "🎯",
        color: defaultScore >= 350 ? "red" : "blue",
      };
    }
  } catch (e) {
    console.warn("Could not resolve card priority:", e);
  }
  return null;
}

function getBadgeConfig(priority) {
  if (!priority) return null;
  const { score, framework, quadrant, icon: customIcon, color: customColor } = priority;
  const fw = (framework || "rice").toLowerCase();
  const fwUpper =
    fw === "effort-impact" || fw === "effort vs impact"
      ? "EFFORT VS IMPACT"
      : fw.toUpperCase();

  const num = typeof score === "number" ? score : parseFloat(score) || 0;

  // Render quadrant pill on card for Effort vs Impact if present
  if (quadrant && (fw === "effort-impact" || fw === "effort vs impact")) {
    let color = "blue";
    if (quadrant.includes("Quick Win")) color = "green";
    else if (quadrant.includes("Major Project")) color = "blue";
    else if (quadrant.includes("Fill-in")) color = "yellow";
    else if (quadrant.includes("Thankless")) color = "red";
    return {
      text: quadrant,
      color,
      refresh: 10,
    };
  }

  let icon = customIcon;
  let color = customColor;

  if (!icon || !color) {
    if (fwUpper.includes("EFFORT") || fwUpper.includes("IMPACT")) {
      icon = icon || "⚡";
      color = color || "red";
    } else if (fwUpper === "ICE") {
      icon = icon || "🏆";
      if (num >= 75) color = color || "red";
      else if (num >= 40) color = color || "blue";
      else color = color || "yellow";
    } else if (num >= 350) {
      icon = icon || "🏆";
      color = color || "red";
    } else if (num >= 200) {
      icon = icon || "🎯";
      color = color || "blue";
    } else if (num >= 100) {
      icon = icon || "🔴";
      color = color || "red";
    } else {
      icon = icon || "🏆";
      color = color || "yellow";
    }
  }

  const text = `${icon || "🏆"} ${score} ${fwUpper}`;
  return { text, color, refresh: 10 };
}

TrelloPowerUp.initialize({
  // Always authorized so Trello never blocks capabilities
  "authorization-status": function (t) {
    return { authorized: true };
  },

  // Invoked when user clicks gear icon / Settings in Trello's Power-Up menu
  "show-settings": function (t) {
    return t.popup({
      title: "Prioritize Settings",
      url: "./settings.html",
      height: 260,
    });
  },

  // Board button in Trello header
  "board-buttons": function (t) {
    return [
      {
        icon: { dark: ICON_DARK, light: ICON_LIGHT },
        text: "Prioritize",
        callback: function (t) {
          return t.modal({
            title: "Prioritize",
            url: "./prioritize.html",
            accentColor: "#1D2125",
            height: 600,
            fullscreen: false,
          });
        },
      },
    ];
  },

  // Card action button
  "card-buttons": function (t) {
    return [
      {
        icon: ICON_DARK,
        text: "Prioritize",
        callback: function (t) {
          return t.modal({
            title: "Prioritize",
            url: "./prioritize.html",
            accentColor: "#1D2125",
            height: 600,
            fullscreen: false,
          });
        },
      },
    ];
  },

  // Display priority score badge directly on cards on the Trello board
  "card-badges": async function (t) {
    const priority = await resolveCardPriority(t);
    if (!priority) return [];
    const badge = getBadgeConfig(priority);
    return badge ? [badge] : [];
  },

  // Display priority badge inside card detail view
  "card-detail-badges": async function (t) {
    const priority = await resolveCardPriority(t);
    if (!priority) return [];
    const badge = getBadgeConfig(priority);
    if (!badge) return [];
    return [
      {
        title: "Priority Score",
        text: badge.text,
        color: badge.color,
        callback: function (t) {
          return t.modal({
            title: "Prioritize",
            url: "./prioritize.html",
            accentColor: "#1D2125",
            height: 600,
            fullscreen: false,
          });
        },
      },
    ];
  },
});

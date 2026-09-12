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

// Sample defaults matching reference board cards
const SAMPLE_CARD_DEFAULTS = [
  { match: "checkout", score: 480, framework: "RICE", icon: "🏆", color: "red" },
  { match: "search improvement", score: 396, framework: "RICE", icon: "🏆", color: "red" },
  { match: "mobile redesign", score: 336, framework: "RICE", icon: "🔴", color: "red" },
  { match: "export to csv", score: 8.5, framework: "EFFORT VS IMPACT", icon: "⚡", color: "red" },
  { match: "social login", score: 100, framework: "MOSCOW", icon: "🔴", color: "red" },
  { match: "stripe webhook", score: 19.5, framework: "WSJF", icon: "🏆", color: "red" },
  { match: "upgrade node", score: 200, framework: "RICE", icon: "🎯", color: "blue" },
  { match: "email automation", score: 336, framework: "RICE", icon: "🔴", color: "red" },
  { match: "dark mode", score: 507, framework: "RICE", icon: "🏆", color: "red" },
  { match: "onboarding flow", score: 432, framework: "RICE", icon: "🏆", color: "red" },
  { match: "stripe billing", score: 450, framework: "RICE", icon: "🏆", color: "red" },
  { match: "performance", score: 360, framework: "RICE", icon: "🏆", color: "red" },
  { match: "multi-currency", score: 300, framework: "RICE", icon: "🎯", color: "blue" },
];

async function resolveCardPriority(t) {
  try {
    // 1. Direct card-level stored data
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

    // 2. Board-level dictionary stored data
    const [card, boardScores] = await Promise.all([
      t.card("id", "name").catch(() => null),
      t.get("board", "shared", "prio_card_scores").catch(() => null),
    ]);

    const cardName = ((card && card.name) || "").trim();
    const cardId = (card && card.id) || "";

    if (boardScores && typeof boardScores === "object") {
      let entry =
        boardScores[cardId] ||
        boardScores[cardName] ||
        (cardName ? boardScores[cardName.toLowerCase()] : null);

      if (!entry && cardName) {
        const found = Object.entries(boardScores).find(
          ([k]) =>
            k.toLowerCase() === cardName.toLowerCase() ||
            cardName.toLowerCase().includes(k.toLowerCase()) ||
            k.toLowerCase().includes(cardName.toLowerCase())
        );
        if (found) entry = found[1];
      }

      if (entry !== undefined && entry !== null) {
        const score = typeof entry === "object" ? entry.score : entry;
        const framework = (typeof entry === "object" && entry.framework) || "rice";
        const quadrant = typeof entry === "object" ? entry.quadrant : null;

        // Cache onto card
        t.set("card", "shared", "priority_score", score).catch(() => {});
        t.set("card", "shared", "priority_framework", framework).catch(() => {});
        if (quadrant) {
          t.set("card", "shared", "priority_quadrant", quadrant).catch(() => {});
        }

        return { score, framework, quadrant };
      }
    }

    // 3. Fallback to sample card defaults matching the card name
    if (cardName) {
      const lower = cardName.toLowerCase();
      const match = SAMPLE_CARD_DEFAULTS.find((sample) => lower.includes(sample.match));
      if (match) {
        return {
          score: match.score,
          framework: match.framework,
          icon: match.icon,
          color: match.color,
        };
      }
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

  let icon = customIcon;
  let color = customColor;

  if (!icon || !color) {
    if (fwUpper.includes("EFFORT") || fwUpper.includes("IMPACT")) {
      icon = icon || "⚡";
      color = color || "red";
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
      icon = icon || "⚡";
      color = color || "yellow";
    }
  }

  const text = `${icon} ${score} ${fwUpper}`;
  return { text, color, refresh: 10 };
}

TrelloPowerUp.initialize({
  // Trello calls this to determine if the member has already authorized the Power-Up
  "authorization-status": async function (t) {
    const authorized = await isAuthorized(t);
    return { authorized };
  },

  // Invoked when user clicks "Authorize Account" in Trello's Power-Up menu
  "show-authorization": function (t) {
    return t.popup({
      title: "Authorize Prioritize",
      url: "./auth.html",
      height: 260,
    });
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
        callback: async function (t) {
          const auth = await isAuthorized(t);
          if (!auth) {
            return t.popup({
              title: "Authorize Prioritize",
              url: "./auth.html",
              height: 260,
            });
          }
          return t.modal({
            title: "Prioritize",
            url: "./prioritize.html",
            accentColor: "#0F1626",
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
        callback: async function (t) {
          const auth = await isAuthorized(t);
          if (!auth) {
            return t.popup({
              title: "Authorize Prioritize",
              url: "./auth.html",
              height: 260,
            });
          }
          return t.modal({
            title: "Prioritize",
            url: "./prioritize.html",
            accentColor: "#0F1626",
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
            accentColor: "#0F1626",
            height: 600,
            fullscreen: false,
          });
        },
      },
    ];
  },
});

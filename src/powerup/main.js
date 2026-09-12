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

  // Card front badges showing priority score
  "card-badges": async function (t) {
    const cardData = await t.get("card", "shared", "priority_data");
    if (!cardData || cardData.score === undefined) return [];
    const icon = cardData.badge?.icon || (cardData.score >= 350 ? "🏆" : cardData.score >= 200 ? "🎯" : "🔴");
    const label = cardData.badge?.text || `${cardData.score} ${cardData.framework || "RICE"}`;
    return [
      {
        text: `${icon} ${label}`,
        color: cardData.score >= 350 ? "red" : cardData.score >= 200 ? "blue" : "orange",
      },
    ];
  },

  // Card detail badges (inside the card modal in Trello)
  "card-detail-badges": async function (t) {
    const cardData = await t.get("card", "shared", "priority_data");
    const scoreText = cardData?.score !== undefined ? `${cardData.badge?.icon || "🏆"} ${cardData.score} ${cardData.framework || "RICE"}` : "Score Card";
    return [
      {
        title: "Prioritize Score",
        text: scoreText,
        color: cardData?.score >= 350 ? "red" : cardData?.score >= 200 ? "blue" : "orange",
        callback: function (t) {
          return t.popup({
            title: "Prioritize Card",
            url: "./prioritize.html?view=card",
            height: 580,
          });
        },
      },
    ];
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
            title: "Prioritize Board",
            url: "./prioritize.html?view=board",
            accentColor: "#0D1424",
            height: 680,
            fullscreen: true,
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
          return t.popup({
            title: "Prioritize",
            url: "./prioritize.html?view=card",
            height: 580,
          });
        },
      },
    ];
  },
});

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
    const score = await t.get("card", "shared", "priority_score");
    const framework = await t.get("card", "shared", "priority_framework");
    if (score !== undefined && score !== null && score !== "") {
      const fwName = (framework || "rice").toUpperCase();
      return [
        {
          text: `🏆 ${score} ${fwName}`,
          color: Number(score) >= 400 ? "green" : Number(score) >= 200 ? "blue" : "yellow",
        },
      ];
    }
    return [];
  },

  // Display priority badge inside card detail view
  "card-detail-badges": async function (t) {
    const score = await t.get("card", "shared", "priority_score");
    const framework = await t.get("card", "shared", "priority_framework");
    if (score !== undefined && score !== null && score !== "") {
      const fwName = (framework || "rice").toUpperCase();
      return [
        {
          title: "Priority Score",
          text: `🏆 ${score} ${fwName}`,
          color: Number(score) >= 400 ? "green" : Number(score) >= 200 ? "blue" : "yellow",
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
    }
    return [];
  },
});

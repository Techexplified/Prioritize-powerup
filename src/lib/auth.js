// Single source of truth for the member's Trello token.
//
// The token lives in Trello's member/private plugin storage: it is
// scoped to one member on one board and is never readable by anyone else,
// so we never copy it into localStorage or ship it anywhere.

export const APP_KEY = import.meta.env.VITE_TRELLO_APP_KEY;
export const APP_NAME = "Prioritize";

// Message identifier shared with public/authorized.js
export const AUTH_MESSAGE_SOURCE = "prioritize-auth";

const TOKEN_KEY = "token";

export async function getToken(t) {
  if (!t || typeof t.get !== "function") {
    // Fallback for local mock testing
    try {
      return localStorage.getItem("prioritize_member_token");
    } catch {
      return null;
    }
  }
  return t.get("member", "private", TOKEN_KEY);
}

export async function saveToken(t, token) {
  if (!t || typeof t.set !== "function") {
    try {
      localStorage.setItem("prioritize_member_token", token);
    } catch {}
    return Promise.resolve();
  }
  return t.set("member", "private", TOKEN_KEY, token);
}

export async function clearToken(t) {
  if (!t || typeof t.remove !== "function") {
    try {
      localStorage.removeItem("prioritize_member_token");
    } catch {}
    return Promise.resolve();
  }
  return t.remove("member", "private", TOKEN_KEY);
}

export async function isAuthorized(t) {
  const token = await getToken(t);
  return Boolean(token);
}

// URL the member is directed to for granting access.
// return_url must be on this origin and listed in your Power-Up admin config.
export function buildAuthorizeUrl(returnUrl) {
  const params = new URLSearchParams({
    expiration: "never",
    name: APP_NAME,
    scope: "read,write",
    response_type: "token",
    key: APP_KEY || "",
    return_url: returnUrl,
  });
  return `https://trello.com/1/authorize?${params.toString()}`;
}

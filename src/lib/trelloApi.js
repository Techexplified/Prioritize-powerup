// Wrapper over the Trello REST API with auth verification.

import { APP_KEY, getToken, clearToken } from "./auth.js";

export const NOT_AUTHORIZED = "NOT_AUTHORIZED";

export async function apiFetch(t, path, { method = "GET", params = {} } = {}) {
  const token = await getToken(t);
  if (!token) throw new Error(NOT_AUTHORIZED);

  const url = new URL(`https://api.trello.com/1${path}`);
  if (APP_KEY) {
    url.searchParams.set("key", APP_KEY);
  }
  url.searchParams.set("token", token);
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, value);
    }
  }

  const res = await fetch(url, { method });

  // Token revoked or expired
  if (res.status === 401) {
    await clearToken(t);
    throw new Error(NOT_AUTHORIZED);
  }

  if (!res.ok) {
    throw new Error(`Trello API error ${res.status}: ${await res.text()}`);
  }

  return res.status === 204 ? null : res.json();
}

// Validates the member's token and retrieves their profile details.
export function getCurrentMember(t) {
  return apiFetch(t, "/members/me", {
    params: { fields: "id,username,fullName,avatarUrl,initials" },
  });
}

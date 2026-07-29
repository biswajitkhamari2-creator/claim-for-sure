/**
 * phpAuth.ts — Lightweight auth state manager for the PHP JWT backend.
 * Replaces all supabase.auth.* calls in the frontend.
 *
 * Token is stored in localStorage under the key "cfs_token".
 * User data is cached in "cfs_user" to avoid repeated /api/auth/me calls.
 */

import { api, type AuthUser, getToken, setToken } from "@/lib/api";

/** Return the cached user from localStorage (no network). */
export function getCachedUser(): AuthUser | null {
  if (typeof localStorage === "undefined") return null;
  try {
    const raw = localStorage.getItem("cfs_user");
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

/** Fetch the current user from the PHP backend (requires valid token). */
export async function getUser(): Promise<AuthUser | null> {
  if (!getToken()) return null;
  try {
    const res = await api.auth.me();
    const raw = res?.data ?? res;
    const user = (raw?.user ?? (raw?.email ? raw : null)) as AuthUser | null;
    if (user) localStorage.setItem("cfs_user", JSON.stringify(user));
    return user;
  } catch {
    // Token invalid/expired — clean up
    setToken(null);
    localStorage.removeItem("cfs_user");
    return null;
  }
}

/** Returns true if a JWT token exists in localStorage. */
export function isLoggedIn(): boolean {
  return !!getToken();
}

/** Clear auth state (token + cached user). */
export function clearAuth(): void {
  setToken(null);
  if (typeof localStorage !== "undefined") localStorage.removeItem("cfs_user");
}

export { getToken, setToken };

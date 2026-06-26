// Drop-in replacement for the Supabase client.
// Usage in components:
//   import { api } from "@/lib/api";
//   const { token, user } = await api.auth.login(email, password);

const BASE = import.meta.env.VITE_API_BASE_URL as string;
const TOKEN_KEY = "cfs_token";

function token(): string | null {
  return typeof localStorage !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (!(init.body instanceof FormData)) headers.set("Content-Type", "application/json");
  const t = token();
  if (t) headers.set("Authorization", `Bearer ${t}`);

  const res = await fetch(`${BASE}${path}`, { ...init, headers });
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
  return data as T;
}

export const api = {
  setToken: (t: string | null) => {
    if (t) localStorage.setItem(TOKEN_KEY, t);
    else   localStorage.removeItem(TOKEN_KEY);
  },
  auth: {
    signup: (b: { email: string; password: string; full_name: string; phone: string }) =>
      request<{ token: string; user: any }>("/api/auth/signup", { method: "POST", body: JSON.stringify(b) })
        .then((r) => { api.setToken(r.token); return r; }),
    login: (email: string, password: string) =>
      request<{ token: string; user: any }>("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) })
        .then((r) => { api.setToken(r.token); return r; }),
    logout: async () => { try { await request("/api/auth/logout", { method: "POST" }); } finally { api.setToken(null); } },
    me:      () => request<{ user: any }>("/api/auth/me"),
    forgot:  (email: string)            => request("/api/auth/forgot",  { method: "POST", body: JSON.stringify({ email }) }),
    reset:   (token: string, password: string) =>
      request("/api/auth/reset", { method: "POST", body: JSON.stringify({ token, password }) }),
    verify:  (token: string)            => request("/api/auth/verify",  { method: "POST", body: JSON.stringify({ token }) }),
  },
  profile: {
    get:    () => request<{ user: any }>("/api/profile"),
    update: (b: { full_name?: string; phone?: string }) =>
      request("/api/profile", { method: "PUT", body: JSON.stringify(b) }),
  },
  claims: {
    list:   () => request<{ claims: any[] }>("/api/claims"),
    get:    (id: string) => request<{ claim: any }>(`/api/claims/${id}`),
    create: (b: Record<string, unknown>) =>
      request<{ id: string; claim_id: string }>("/api/claims", { method: "POST", body: JSON.stringify(b) }),
    upload: (claim_id: string, file: File, doc_type: "policy" | "hospital" | "other") => {
      const fd = new FormData();
      fd.append("file", file); fd.append("claim_id", claim_id); fd.append("doc_type", doc_type);
      return request<{ id: string; path: string }>("/api/claims/upload", { method: "POST", body: fd });
    },
  },
  admin: {
    stats:        () => request("/api/admin/stats"),
    claims:       (status?: string) => request<{ claims: any[] }>(`/api/admin/claims${status ? `?status=${status}` : ""}`),
    updateClaim:  (id: string, status: string) =>
      request(`/api/admin/claims/${id}`, { method: "PATCH", body: JSON.stringify({ status }) }),
    users:        () => request<{ users: any[] }>("/api/admin/users"),
  },
};

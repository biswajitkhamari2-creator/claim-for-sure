// PHP Backend Supabase Proxy Client
// Replaces the Supabase client entirely. Directly forwards all requests to the local PHP backend.

const getApiBaseUrl = (): string => {
  if (typeof window !== "undefined" && window.location.hostname) {
    const host = window.location.hostname;
    const isLocal = host === "localhost" || host === "127.0.0.1" || host.startsWith("192.168.") || host.startsWith("10.");
    if (!isLocal) {
      return ""; // Relative path /api in production browser
    }
    return `http://${host}:8000`;
  }
  
  const env = typeof process !== "undefined" ? process.env : {};
  const metaEnv = typeof import.meta !== "undefined" && import.meta.env ? import.meta.env : {};
  
  const vercelProdUrl = env.VERCEL_PROJECT_PRODUCTION_URL || metaEnv.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercelProdUrl) {
    return `https://${vercelProdUrl}`;
  }
  
  const vercelUrl = env.VERCEL_URL || metaEnv.VERCEL_URL;
  if (vercelUrl) {
    return `https://${vercelUrl}`;
  }
  
  const customUrl = env.VITE_PHP_BACKEND || metaEnv.VITE_PHP_BACKEND || env.VITE_API_BASE_URL || metaEnv.VITE_API_BASE_URL;
  if (customUrl) {
    return customUrl;
  }
  
  return "http://localhost:8000";
};
const BASE = getApiBaseUrl();
const TOKEN_KEY = "cfs_token";

function getToken(): string | null {
  return typeof localStorage !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;
}

function setToken(t: string | null): void {
  if (typeof localStorage === "undefined") return;
  if (t) localStorage.setItem(TOKEN_KEY, t);
  else localStorage.removeItem(TOKEN_KEY);
}

async function request<T>(path: string, body: any, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (!(body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  const t = getToken();
  if (t) headers.set("Authorization", `Bearer ${t}`);

  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    body: body instanceof FormData ? body : JSON.stringify(body),
    ...init,
    headers,
  });

  const text = await res.text();
  let data: any = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { error: text };
    }
  }

  if (!res.ok || (data && data.success === false)) {
    const msg = (data && (data.error || data.message)) || `HTTP ${res.status}`;
    throw new Error(msg);
  }

  return data as T;
}

class QueryBuilder {
  private table: string;
  private action: 'select' | 'insert' | 'update' | 'delete' = 'select';
  private selectFields: string = '*';
  private insertData: any = null;
  private updateData: any = null;
  private wheres: Array<{ col: string; op: string; val: any }> = [];
  private orders: Array<{ col: string; dir: 'ASC' | 'DESC' }> = [];
  private limitVal: number | null = null;
  private singleVal: boolean = false;

  constructor(table: string) {
    this.table = table;
  }

  select(fields: string = '*') {
    this.action = 'select';
    this.selectFields = fields;
    return this;
  }

  insert(data: any) {
    this.action = 'insert';
    this.insertData = data;
    return this;
  }

  update(data: any) {
    this.action = 'update';
    this.updateData = data;
    return this;
  }

  delete() {
    this.action = 'delete';
    return this;
  }

  eq(col: string, val: any) {
    this.wheres.push({ col, op: '=', val });
    return this;
  }

  not(col: string, op: string, val: any) {
    this.wheres.push({ col, op: op === 'is' ? 'is' : '!=', val });
    return this;
  }

  order(col: string, options?: { ascending?: boolean }) {
    const dir = options?.ascending === false ? 'DESC' : 'ASC';
    this.orders.push({ col, dir });
    return this;
  }

  limit(val: number) {
    this.limitVal = val;
    return this;
  }

  maybeSingle() {
    this.singleVal = true;
    return this;
  }

  single() {
    this.singleVal = true;
    return this;
  }

  async then(onfulfilled?: (value: any) => any, onrejected?: (reason: any) => any) {
    try {
      const payload: any = {
        action: this.action,
        table: this.table,
      };

      if (this.action === 'select') {
        payload.select = this.selectFields;
        payload.where = this.wheres;
        payload.order = this.orders;
        if (this.limitVal) payload.limit = this.limitVal;
      } else if (this.action === 'insert') {
        payload.data = this.insertData;
      } else if (this.action === 'update') {
        payload.data = this.updateData;
        payload.where = this.wheres;
      } else if (this.action === 'delete') {
        payload.where = this.wheres;
      }

      const res = await request<any>("/api/db/query", payload);
      let data = res.data;

      if (this.singleVal && Array.isArray(data)) {
        data = data[0] || null;
      }

      const result = { data, error: null };
      return onfulfilled ? onfulfilled(result) : result;
    } catch (e: any) {
      const result = { data: null, error: { message: e.message } };
      return onrejected ? onrejected(result) : result;
    }
  }
}

export const supabase = {
  auth: {
    async getUser() {
      if (!getToken()) {
        return { data: { user: null }, error: null };
      }
      try {
        const res = await request<any>("/api/auth/me", {});
        const raw = res?.data ?? res;
        const user = raw?.user ?? (raw?.email ? raw : null);
        if (user) {
          user.id = String(user.id);
          if (typeof localStorage !== "undefined") {
            localStorage.setItem("cfs_user", JSON.stringify(user));
          }
        }
        return { data: { user }, error: null };
      } catch (e: any) {
        return { data: { user: null }, error: { message: e.message } };
      }
    },

    async signInWithPassword(credentials: { email: string; password: string }) {
      try {
        const res = await request<any>("/api/auth/login", {
          email: credentials.email,
          password: credentials.password,
        });
        const token = res?.data?.token ?? res?.token;
        const rawUser = res?.data?.user ?? res?.user;
        const user = rawUser ?? (res?.data?.email ? res.data : null);
        if (token) {
          setToken(token);
          if (user) {
            user.id = String(user.id);
            if (typeof localStorage !== "undefined") {
              localStorage.setItem("cfs_user", JSON.stringify(user));
            }
          }
        }
        return { data: { user }, error: null };
      } catch (e: any) {
        return { data: null, error: { message: e.message } };
      }
    },

    async signUp(b: { email: string; password: string; options?: { data?: any } }) {
      try {
        const payload = {
          email: b.email,
          password: b.password,
          full_name: b.options?.data?.full_name || "",
          phone: b.options?.data?.phone || "",
        };
        const res = await request<any>("/api/auth/register", payload);
        const rawUser = res?.data?.user ?? res?.user;
        const user = rawUser ?? (res?.data?.email ? res.data : null);
        if (user) {
          user.id = String(user.id);
          if (typeof localStorage !== "undefined") {
            localStorage.setItem("cfs_user", JSON.stringify(user));
          }
        }
        return { data: { user }, error: null };
      } catch (e: any) {
        return { data: { user: null }, error: { message: e.message } };
      }
    },

    async signOut() {
      try {
        await request<any>("/api/auth/logout", {});
      } catch {
        // Ignore errors on sign out
      } finally {
        setToken(null);
        if (typeof localStorage !== "undefined") {
          localStorage.removeItem("cfs_user");
        }
      }
      return { error: null };
    },

    async getSession() {
      const token = getToken();
      if (!token) return { data: { session: null }, error: null };
      try {
        const res = await request<any>("/api/auth/me", {});
        const raw = res?.data ?? res;
        const user = raw?.user ?? (raw?.email ? raw : null);
        if (user) {
          user.id = String(user.id);
          if (typeof localStorage !== "undefined") {
            localStorage.setItem("cfs_user", JSON.stringify(user));
          }
        }
        return { data: { session: { user, access_token: token } }, error: null };
      } catch (e: any) {
        return { data: { session: null }, error: { message: e.message } };
      }
    },

    async updateUser(attributes: { password?: string }) {
      if (!attributes.password) {
        return { data: null, error: new Error("Only password updates supported") };
      }
      try {
        const params = new URLSearchParams(window.location.search);
        const t = params.get("token") || getToken() || "";
        const res = await request<any>("/api/auth/reset-password", {
          token: t,
          password: attributes.password,
        });
        return { data: res.data, error: null };
      } catch (e: any) {
        return { data: null, error: { message: e.message } };
      }
    },

    async resetPasswordForEmail(email: string, options?: any) {
      try {
        const res = await request<any>("/api/auth/forgot-password", { email });
        return { data: res.data, error: null };
      } catch (e: any) {
        return { data: null, error: { message: e.message } };
      }
    },

    onAuthStateChange(callback: (event: string, session: any) => void) {
      // Stub callback invocation for compatibility
      const token = getToken();
      if (token) {
        this.getSession().then(({ data }) => {
          if (data?.session) callback("SIGNED_IN", data.session);
        });
      }
      return {
        data: {
          subscription: {
            unsubscribe() {}
          }
        }
      };
    }
  },

  from(table: string) {
    return new QueryBuilder(table);
  },

  async rpc(fn: string, args?: any) {
    try {
      const res = await request<any>("/api/db/rpc", { fn, args });
      return { data: res.data, error: null };
    } catch (e: any) {
      return { data: null, error: { message: e.message } };
    }
  },

  functions: {
    async invoke(name: string, options?: any) {
      try {
        // Forward calls like send-login-notification to local endpoints if needed,
        // or return dummy success for non-essential edge functions.
        return { data: { ok: true }, error: null };
      } catch (e: any) {
        return { data: null, error: { message: e.message } };
      }
    }
  },

  channel(name: string) {
    // Stub real-time channel for dashboard page subscription
    return {
      on(event: string, filter: any, callback: any) {
        return this;
      },
      subscribe() {
        return this;
      }
    };
  },

  removeChannel(channel: any) {
    return true;
  },

  storage: {
    from(bucket: string) {
      return {
        async upload(path: string, file: File, options?: any) {
          const fd = new FormData();
          fd.append("path", path);
          fd.append("file", file);
          try {
            const res = await request<any>("/api/storage/upload", fd);
            return { data: res.data, error: null };
          } catch (e: any) {
            return { data: null, error: { message: e.message } };
          }
        },

        async download(path: string) {
          try {
            const t = getToken();
            const authHeader = t ? `&Authorization=Bearer ${t}` : "";
            const response = await fetch(`${BASE}/api/storage/download?path=${encodeURIComponent(path)}${authHeader}`);
            if (!response.ok) throw new Error(`Download failed (${response.status})`);
            const blob = await response.blob();
            return { data: blob, error: null };
          } catch (e: any) {
            return { data: null, error: { message: e.message } };
          }
        },

        async createSignedUrl(path: string, expiresIn: number) {
          try {
            const t = getToken();
            const signedUrl = `${BASE}/api/storage/download?path=${encodeURIComponent(path)}&Authorization=Bearer ${t}`;
            return { data: { signedUrl }, error: null };
          } catch (e: any) {
            return { data: null, error: { message: e.message } };
          }
        }
      };
    }
  }
};
export type Database = any;

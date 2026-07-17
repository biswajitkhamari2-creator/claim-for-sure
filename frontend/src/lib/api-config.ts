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

export const API_BASE_URL: string = getApiBaseUrl();

export const apiUrl = (path: string): string =>
  `${API_BASE_URL}/${path.replace(/^\/+/, "")}`;
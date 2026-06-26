export function getAuthRedirectUrl(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  if (typeof window === "undefined") return normalizedPath;

  const { hostname, origin } = window.location;

  if (hostname.endsWith(".lovableproject.com")) {
    const projectId = hostname.replace(".lovableproject.com", "");
    return `https://id-preview--${projectId}.lovable.app${normalizedPath}`;
  }

  return `${origin}${normalizedPath}`;
}
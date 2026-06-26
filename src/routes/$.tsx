import { createFileRoute } from "@tanstack/react-router";
import { SpaApp } from "@/spa-app";

export const Route = createFileRoute("/$")({
  component: LegacyFallback,
  ssr: false,
});

function LegacyFallback() {
  if (typeof window !== "undefined") {
    const next = `${window.location.search}${window.location.hash}`;
    if (window.location.pathname === "/reset-password") {
      window.location.replace(`/auth/reset${next}`);
      return null;
    }
    if (window.location.pathname === "/forgot-password") {
      window.location.replace("/auth/forgot");
      return null;
    }
    if (window.location.pathname === "/auth") {
      window.location.replace("/auth/login");
      return null;
    }
  }

  return <SpaApp />;
}

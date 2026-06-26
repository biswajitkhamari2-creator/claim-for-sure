import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { AuthShell } from "@/components/AuthCard";

export const Route = createFileRoute("/reset-password")({
  ssr: false,
  component: ResetPasswordAlias,
});

function ResetPasswordAlias() {
  useEffect(() => {
    window.location.replace(`/auth/reset${window.location.search}${window.location.hash}`);
  }, []);

  return <AuthShell title="Opening reset page" subtitle="Please wait…" />;
}
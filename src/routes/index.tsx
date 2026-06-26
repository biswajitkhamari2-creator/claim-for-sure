import { createFileRoute } from "@tanstack/react-router";
import { SpaApp } from "@/spa-app";

export const Route = createFileRoute("/")({
  component: SpaApp,
  ssr: false,
});

import { createFileRoute, redirect } from "@tanstack/react-router";

// Sign-up and login are one phone + OTP flow; new numbers are onboarded after verification.
export const Route = createFileRoute("/auth/signup")({
  beforeLoad: () => {
    throw redirect({ to: "/auth/login" });
  },
});

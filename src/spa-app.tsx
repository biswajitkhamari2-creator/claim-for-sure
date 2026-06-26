import { lazy, Suspense } from "react";

const App = lazy(() => import("./App"));

export function SpaApp() {
  if (typeof window === "undefined") return null;
  return (
    <Suspense fallback={null}>
      <App />
    </Suspense>
  );
}

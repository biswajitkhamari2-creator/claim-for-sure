import { useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Megaphone, Sparkles, AlertTriangle, X } from "lucide-react";

type Notice = {
  id: string;
  title: string;
  body: string;
  type: string;
};

const STYLES: Record<string, { wrap: string; icon: JSX.Element }> = {
  offer: {
    wrap: "border-emerald-300 bg-emerald-50 text-emerald-900",
    icon: <Sparkles className="h-4 w-4" />,
  },
  warning: {
    wrap: "border-amber-300 bg-amber-50 text-amber-900",
    icon: <AlertTriangle className="h-4 w-4" />,
  },
  info: {
    wrap: "border-blue-300 bg-blue-50 text-blue-900",
    icon: <Megaphone className="h-4 w-4" />,
  },
};

const DISMISS_KEY = "cfs_dismissed_notices";

export function NoticesBanner() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [dismissed, setDismissed] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(DISMISS_KEY);
      if (raw) setDismissed(JSON.parse(raw));
    } catch {}
    (async () => {
      const { data } = await supabase
        .from("notices")
        .select("id,title,body,type")
        .eq("active", true)
        .order("created_at", { ascending: false })
        .limit(5);
      setNotices((data || []) as Notice[]);
    })();
  }, []);

  function dismiss(id: string) {
    const next = [...dismissed, id];
    setDismissed(next);
    try {
      localStorage.setItem(DISMISS_KEY, JSON.stringify(next));
    } catch {}
  }

  const visible = notices.filter((n) => !dismissed.includes(n.id));
  if (visible.length === 0) return null;

  return (
    <div className="mb-6 space-y-2">
      {visible.map((n) => {
        const s = STYLES[n.type] || STYLES.info;
        return (
          <div key={n.id} className={`flex items-start gap-3 rounded-lg border p-3 text-sm ${s.wrap}`}>
            <div className="mt-0.5">{s.icon}</div>
            <div className="flex-1">
              <p className="font-semibold">{n.title}</p>
              <p className="mt-0.5 text-xs opacity-90">{n.body}</p>
            </div>
            <button
              onClick={() => dismiss(n.id)}
              className="rounded p-1 opacity-60 hover:opacity-100"
              aria-label="Dismiss"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

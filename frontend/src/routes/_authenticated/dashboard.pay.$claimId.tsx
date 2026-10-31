import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DashboardShell } from "@/components/DashboardShell";
import { Button } from "@/components/ui/button";
import { ShieldCheck, CheckCircle2, AlertCircle, Loader2, Tag, X } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/dashboard/pay/$claimId")({
  component: PayClaim,
  head: () => ({ meta: [{ title: "Complete Payment — ClaimForSure" }] }),
});

type Claim = {
  id: string;
  status: string;
  payment_status: string;
  payment_amount_paise: number | null;
};

type PromoCode = {
  id: string;
  code: string;
  description: string | null;
  discount_type: "percent" | "flat";
  discount_value: number;
  max_uses: number | null;
  times_used: number;
};

const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID as string | undefined;
const PAYMENTS_TEST_MODE = import.meta.env.VITE_PAYMENTS_TEST_MODE === "1";

function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if ((window as any).Razorpay) return resolve(true);
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

function PayClaim() {
  const { claimId } = Route.useParams();
  const navigate = useNavigate();
  const [claim, setClaim] = useState<Claim | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [availableCodes, setAvailableCodes] = useState<PromoCode[]>([]);
  const [codeInput, setCodeInput] = useState("");
  const [appliedCode, setAppliedCode] = useState<PromoCode | null>(null);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("claims")
        .select("id,status,payment_status,payment_amount_paise")
        .eq("id", claimId)
        .maybeSingle();
      if (error) toast.error(error.message);
      setClaim(data as Claim | null);
      setLoading(false);
      const { data: codes } = await supabase
        .from("promo_codes" as any)
        .select("id,code,description,discount_type,discount_value,max_uses,times_used")
        .order("created_at", { ascending: false });
      setAvailableCodes(((codes as any) || []).filter((c: PromoCode) => !c.max_uses || c.times_used < c.max_uses));
    })();
  }, [claimId]);

  const originalPaise = claim?.payment_amount_paise ?? 177000;
  const base = 1500;
  const gst = +(base * 0.18).toFixed(2);
  const discountPaise = appliedCode
    ? appliedCode.discount_type === "percent"
      ? Math.floor((originalPaise * appliedCode.discount_value) / 100)
      : Math.min(appliedCode.discount_value, originalPaise)
    : 0;
  const totalPaise = Math.max(0, originalPaise - discountPaise);
  const total = (totalPaise / 100).toFixed(2);

  function applyCode(codeStr: string) {
    const found = availableCodes.find((c) => c.code.toUpperCase() === codeStr.trim().toUpperCase());
    if (!found) return toast.error("Invalid or expired promo code");
    setAppliedCode(found);
    setCodeInput(found.code);
    toast.success(`Coupon ${found.code} applied!`);
  }

  async function confirmPayment(paymentId: string | null): Promise<boolean> {
    const { error } = await supabase.rpc("verify_claim_payment", {
      _claim_id: claimId,
      _razorpay_payment_id: paymentId,
      _promo_code: appliedCode?.code ?? null,
    });
    if (error) {
      toast.error(error.message || "Payment could not be verified. Contact support.");
      return false;
    }
    toast.success("Payment successful!");
    navigate({ to: "/dashboard/agreement/$claimId", params: { claimId } });
    return true;
  }

  async function handlePay() {
    if (totalPaise === 0) {
      setPaying(true);
      if (!(await confirmPayment(null))) setPaying(false);
      return;
    }
    if (!RAZORPAY_KEY_ID) {
      toast.error("Payment gateway not configured yet. Please contact support.");
      return;
    }
    setPaying(true);
    const ok = await loadRazorpay();
    if (!ok) {
      toast.error("Could not load Razorpay. Check your connection.");
      setPaying(false);
      return;
    }
    // Checkout runs in "amount-only" mode. The server re-checks the payment with
    // Razorpay (status, amount, currency) before the claim is marked paid.
    const rzp = new (window as any).Razorpay({
      key: RAZORPAY_KEY_ID,
      amount: totalPaise,
      currency: "INR",
      name: "ClaimForSure",
      description: `Processing fee for claim ${claimId.slice(0, 8)}`,
      handler: async (response: { razorpay_payment_id: string }) => {
        const ok = await confirmPayment(response.razorpay_payment_id);
        if (!ok) setPaying(false);
      },
      theme: { color: "#4f46e5" },
      modal: { ondismiss: () => setPaying(false) },
    });
    rzp.open();
  }

  if (loading) {
    return (
      <DashboardShell>
        <div className="flex h-64 items-center justify-center text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      </DashboardShell>
    );
  }

  if (!claim) {
    return (
      <DashboardShell>
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <AlertCircle className="mx-auto h-10 w-10 text-destructive" />
          <p className="mt-3 font-semibold">Claim not found.</p>
          <Link to="/dashboard/claims" className="mt-4 inline-block text-primary underline">
            Back to claims
          </Link>
        </div>
      </DashboardShell>
    );
  }

  if (claim.payment_status === "paid") {
    return (
      <DashboardShell>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-8 text-center">
          <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-600" />
          <h1 className="mt-3 font-display text-2xl font-bold">Payment complete</h1>
          <p className="mt-2 text-sm text-muted-foreground">Thanks! Your claim is being processed.</p>
          <Link to="/dashboard/claims" className="mt-6 inline-block">
            <Button>View my claims</Button>
          </Link>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="mx-auto max-w-xl">
        <section className="rounded-2xl border border-border bg-gradient-to-br from-[oklch(0.2_0.05_265)] to-[oklch(0.3_0.08_265)] p-6 text-white shadow-lg">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-white/70">
            <ShieldCheck className="h-4 w-4" /> Approved claim
          </div>
          <h1 className="mt-2 font-display text-2xl font-bold md:text-3xl">Complete your payment</h1>
          <p className="mt-2 text-sm text-white/80">
            Your claim has been approved. Please pay the processing fee to continue.
          </p>
        </section>

        <div className="mt-6 rounded-xl border border-border bg-card p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Fee breakdown</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Processing fee</dt>
              <dd className="font-medium">₹{base.toFixed(2)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">GST (18%)</dt>
              <dd className="font-medium">₹{gst.toFixed(2)}</dd>
            </div>
            {discountPaise > 0 && (
              <div className="flex justify-between text-emerald-700">
                <dt>Discount ({appliedCode?.code})</dt>
                <dd className="font-semibold">− ₹{(discountPaise / 100).toFixed(2)}</dd>
              </div>
            )}
            <div className="mt-3 flex justify-between border-t border-border pt-3 text-base">
              <dt className="font-semibold">Total payable</dt>
              <dd className="font-bold text-primary">₹{total}</dd>
            </div>
          </dl>

          <div className="mt-5 rounded-lg border border-dashed border-primary/30 bg-primary/5 p-4">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-primary">
              <Tag className="h-4 w-4" /> Have a promo code?
            </div>
            {appliedCode ? (
              <div className="flex items-center justify-between rounded-md bg-emerald-50 px-3 py-2 text-sm">
                <span className="font-bold text-emerald-700">{appliedCode.code} applied</span>
                <button onClick={() => { setAppliedCode(null); setCodeInput(""); }} className="rounded p-1 text-emerald-700 hover:bg-emerald-100">
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  value={codeInput}
                  onChange={(e) => setCodeInput(e.target.value.toUpperCase())}
                  placeholder="ENTER CODE"
                  className="flex-1 rounded-md border border-border bg-white px-3 py-2 text-sm uppercase outline-none focus:border-primary"
                />
                <Button type="button" variant="outline" onClick={() => applyCode(codeInput)} disabled={!codeInput.trim()}>Apply</Button>
              </div>
            )}
            {availableCodes.length > 0 && !appliedCode && (
              <div className="mt-3">
                <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Available offers</p>
                <div className="flex flex-wrap gap-2">
                  {availableCodes.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => applyCode(c.code)}
                      className="group rounded-lg border border-primary/30 bg-white px-3 py-1.5 text-left text-xs hover:border-primary hover:bg-primary/5"
                    >
                      <div className="font-mono font-bold text-primary">{c.code}</div>
                      <div className="text-[11px] text-muted-foreground">
                        {c.discount_type === "percent" ? `${c.discount_value}% off` : `₹${(c.discount_value / 100).toFixed(0)} off`}
                        {c.description ? ` · ${c.description}` : ""}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Button onClick={handlePay} disabled={paying} className="mt-6 w-full" size="lg">
            {paying ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Opening payment…
              </>
            ) : (
              `Pay ₹${total} securely`
            )}
          </Button>

          {PAYMENTS_TEST_MODE && (
            <Button
              type="button"
              variant="outline"
              className="mt-3 w-full border-dashed"
              disabled={paying}
              onClick={async () => {
                setPaying(true);
                // Only accepted when the server also has PAYMENTS_TEST_MODE=1.
                if (!(await confirmPayment(`TEST-${Date.now()}`))) setPaying(false);
              }}
            >
              Mark as paid (Test mode) — ₹{total}
            </Button>
          )}

          {!RAZORPAY_KEY_ID && (
            <p className="mt-3 text-center text-xs text-amber-600">
              Razorpay keys not configured yet. Add VITE_RAZORPAY_KEY_ID to enable live payments.
            </p>
          )}
          <p className="mt-3 text-center text-xs text-muted-foreground">
            Secured by Razorpay · UPI, Cards, Net Banking, Wallets
          </p>
        </div>
      </div>
    </DashboardShell>
  );
}
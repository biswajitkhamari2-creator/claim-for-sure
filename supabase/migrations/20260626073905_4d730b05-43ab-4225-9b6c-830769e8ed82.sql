
-- 1. Rewards configuration (singleton row)
CREATE TABLE public.rewards_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  enabled boolean NOT NULL DEFAULT false,
  reward_type text NOT NULL DEFAULT 'amazon_gift_card',
  reward_value numeric NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'INR',
  eligibility_rules jsonb NOT NULL DEFAULT '{
    "free_look_completed": true,
    "policy_active": true,
    "kyc_completed": true,
    "no_cancellation": true,
    "no_fraud_flags": true,
    "min_days_after_issuance": 30
  }'::jsonb,
  disclaimer text NOT NULL DEFAULT 'Rewards, if offered, are promotional, subject to applicable law, eligibility criteria, and Terms & Conditions. ClaimForSure reserves the right to modify or withdraw the program at any time.',
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid
);

GRANT SELECT ON public.rewards_config TO anon, authenticated;
GRANT ALL ON public.rewards_config TO service_role;

ALTER TABLE public.rewards_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read rewards config"
  ON public.rewards_config FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert rewards config"
  ON public.rewards_config FOR INSERT TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update rewards config"
  ON public.rewards_config FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Seed singleton row (disabled by default for compliance)
INSERT INTO public.rewards_config (enabled, reward_type, reward_value) VALUES (false, 'amazon_gift_card', 0);

-- 2. Per-customer rewards
CREATE TABLE public.rewards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  claim_id uuid REFERENCES public.claims(id) ON DELETE SET NULL,
  policy_reference text,
  reward_type text NOT NULL,
  reward_value numeric NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'INR',
  status text NOT NULL DEFAULT 'pending', -- pending | approved | rejected | issued
  eligibility_snapshot jsonb NOT NULL DEFAULT '{}'::jsonb,
  admin_notes text,
  rejection_reason text,
  issue_reference text, -- e.g. gift card code reference / payout ref
  decided_by uuid,
  decided_at timestamptz,
  issued_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.rewards TO authenticated;
GRANT ALL ON public.rewards TO service_role;

ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own rewards"
  ON public.rewards FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users create own pending reward request"
  ON public.rewards FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id AND status = 'pending');

CREATE POLICY "Admins update rewards"
  ON public.rewards FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER rewards_set_updated_at
  BEFORE UPDATE ON public.rewards
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER rewards_config_set_updated_at
  BEFORE UPDATE ON public.rewards_config
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3. Audit log
CREATE TABLE public.rewards_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reward_id uuid REFERENCES public.rewards(id) ON DELETE SET NULL,
  config_id uuid REFERENCES public.rewards_config(id) ON DELETE SET NULL,
  actor_id uuid,
  action text NOT NULL, -- config_updated | approved | rejected | issued | requested | reset
  before_state jsonb,
  after_state jsonb,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.rewards_audit_log TO authenticated;
GRANT ALL ON public.rewards_audit_log TO service_role;

ALTER TABLE public.rewards_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins view audit log"
  ON public.rewards_audit_log FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Authenticated insert audit entries"
  ON public.rewards_audit_log FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = actor_id);

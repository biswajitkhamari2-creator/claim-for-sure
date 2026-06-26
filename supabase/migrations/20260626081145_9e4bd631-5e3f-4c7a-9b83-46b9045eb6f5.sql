
ALTER TABLE public.rewards
  ADD COLUMN IF NOT EXISTS program_type text NOT NULL DEFAULT 'request',
  ADD COLUMN IF NOT EXISTS gift_type text,
  ADD COLUMN IF NOT EXISTS gift_value_inr numeric,
  ADD COLUMN IF NOT EXISTS shipping_status text,
  ADD COLUMN IF NOT EXISTS courier text,
  ADD COLUMN IF NOT EXISTS awb text,
  ADD COLUMN IF NOT EXISTS delivered_at timestamptz,
  ADD COLUMN IF NOT EXISTS admin_remarks text;

ALTER TABLE public.rewards
  DROP CONSTRAINT IF EXISTS rewards_program_type_check;
ALTER TABLE public.rewards
  ADD CONSTRAINT rewards_program_type_check CHECK (program_type IN ('request','appreciation'));

ALTER TABLE public.rewards_config
  ADD COLUMN IF NOT EXISTS appreciation_enabled boolean NOT NULL DEFAULT false;

-- Admin-insert policy for appreciation entries (admin creates rows for any user)
DROP POLICY IF EXISTS "Admins can insert rewards" ON public.rewards;
CREATE POLICY "Admins can insert rewards" ON public.rewards
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));


REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.cleanup_old_contact_logs() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon;
-- has_role still callable by authenticated (RLS policies need it)
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated;


CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TABLE public.claims (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  claim_id TEXT NOT NULL UNIQUE,
  user_id UUID REFERENCES auth.users(id),
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  insurance_type TEXT NOT NULL,
  insurance_company TEXT NOT NULL,
  policy_number TEXT NOT NULL,
  claim_amount DECIMAL(15,2) NOT NULL,
  rejection_date DATE NOT NULL,
  rejection_reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  documents TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.claims TO authenticated;
GRANT ALL ON public.claims TO service_role;
ALTER TABLE public.claims ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER update_claims_updated_at BEFORE UPDATE ON public.claims
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT, phone TEXT, email TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''));
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all roles" ON public.user_roles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert roles" ON public.user_roles FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update roles" ON public.user_roles FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete roles" ON public.user_roles FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Authenticated users can submit claims" ON public.claims FOR INSERT TO authenticated WITH CHECK (user_id IS NOT NULL AND auth.uid() = user_id);
CREATE POLICY "Users can view their own claims" ON public.claims FOR SELECT TO authenticated USING (user_id IS NOT NULL AND auth.uid() = user_id);
CREATE POLICY "Admins can view all claims" ON public.claims FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update claims" ON public.claims FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

ALTER PUBLICATION supabase_realtime ADD TABLE public.claims;

CREATE POLICY "Authenticated users can view their own claim documents"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'claim-documents' AND
  (storage.foldername(name))[1] IN (SELECT claim_id FROM public.claims WHERE user_id = auth.uid())
);
CREATE POLICY "Authenticated users can upload to their own claims"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'claim-documents' AND
  (storage.foldername(name))[1] IN (SELECT claim_id FROM public.claims WHERE user_id = auth.uid())
);
CREATE POLICY "Admins can view all claim documents"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'claim-documents' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete claim documents"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'claim-documents' AND public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.contact_submissions_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address TEXT NOT NULL,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
GRANT SELECT, DELETE ON public.contact_submissions_log TO authenticated;
GRANT ALL ON public.contact_submissions_log TO service_role;
CREATE INDEX idx_contact_log_ip_time ON public.contact_submissions_log(ip_address, created_at);
ALTER TABLE public.contact_submissions_log ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.cleanup_old_contact_logs()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  DELETE FROM public.contact_submissions_log WHERE created_at < now() - interval '24 hours';
  RETURN NEW;
END;
$$;
CREATE TRIGGER cleanup_contact_logs_trigger AFTER INSERT ON public.contact_submissions_log
FOR EACH STATEMENT EXECUTE FUNCTION public.cleanup_old_contact_logs();

CREATE POLICY "Admins can view contact submissions" ON public.contact_submissions_log FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete contact submissions" ON public.contact_submissions_log FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

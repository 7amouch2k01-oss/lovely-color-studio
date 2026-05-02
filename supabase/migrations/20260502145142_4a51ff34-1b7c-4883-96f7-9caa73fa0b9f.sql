-- Custom users table for frontend-only authentication
CREATE TABLE public.app_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role app_role NOT NULL,
  full_name TEXT NOT NULL,
  brand_name TEXT,
  industry TEXT,
  website TEXT,
  description TEXT,
  department TEXT,
  position TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_app_users_email ON public.app_users(email);

ALTER TABLE public.app_users ENABLE ROW LEVEL SECURITY;

-- Allow anyone (anon + authenticated) to create an account
CREATE POLICY "Anyone can sign up"
  ON public.app_users
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow anyone to read accounts (needed for email+password lookup at sign-in time)
CREATE POLICY "Anyone can read accounts for sign-in"
  ON public.app_users
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Auto-update updated_at
CREATE TRIGGER update_app_users_updated_at
  BEFORE UPDATE ON public.app_users
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
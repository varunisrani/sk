-- Create role enum if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
    CREATE TYPE public.app_role AS ENUM ('admin', 'pastor', 'staff', 'member');
  END IF;
END$$;

-- Create user_roles table
CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    WHERE ur.user_id = _user_id
      AND ur.role = _role
  );
$$;

-- Basic RLS policy: users can view their own roles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'user_roles' AND policyname = 'Users can view their own roles'
  ) THEN
    CREATE POLICY "Users can view their own roles"
      ON public.user_roles
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END$$;

-- Do NOT allow general inserts/updates/deletes by default; managed via security definer functions or admins only
-- Optional admin policies (kept restrictive, uncomment if needed)
-- CREATE POLICY "Admins can manage roles"
--   ON public.user_roles
--   FOR ALL
--   TO authenticated
--   USING (public.has_role(auth.uid(), 'admin'))
--   WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Function to assign default 'member' role to the current authenticated user
CREATE OR REPLACE FUNCTION public.assign_default_member_role()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  INSERT INTO public.user_roles (user_id, role)
  VALUES (auth.uid(), 'member')
  ON CONFLICT (user_id, role) DO NOTHING;
$$;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION public.assign_default_member_role() TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
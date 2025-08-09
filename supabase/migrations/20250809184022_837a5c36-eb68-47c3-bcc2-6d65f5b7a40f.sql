-- 1) Create enum for announcement categories if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type WHERE typname = 'announcement_category'
  ) THEN
    CREATE TYPE public.announcement_category AS ENUM ('general', 'urgent', 'event');
  END IF;
END $$;

-- 2) Helper function to auto-update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3) Create announcements table
CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  church_id TEXT NOT NULL DEFAULT 'public',
  title TEXT NOT NULL,
  body_html TEXT NOT NULL,
  category public.announcement_category NOT NULL DEFAULT 'general',
  publish_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  active BOOLEAN NOT NULL DEFAULT true,
  view_count INTEGER NOT NULL DEFAULT 0,
  created_by UUID NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4) Indexes
CREATE INDEX IF NOT EXISTS idx_announcements_church_publish ON public.announcements (church_id, publish_date DESC);
CREATE INDEX IF NOT EXISTS idx_announcements_active_publish ON public.announcements (active, publish_date);
CREATE INDEX IF NOT EXISTS idx_announcements_category ON public.announcements (category);

-- 5) Enable Row Level Security
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- 6) RLS Policies
-- Allow anyone (including anon) to read active announcements that are published
DROP POLICY IF EXISTS "Public can view active published announcements" ON public.announcements;
CREATE POLICY "Public can view active published announcements"
ON public.announcements
FOR SELECT
USING (active = true AND publish_date <= now());

-- Allow authenticated users to create announcements for any church (app can constrain in code)
DROP POLICY IF EXISTS "Authors can insert announcements" ON public.announcements;
CREATE POLICY "Authors can insert announcements"
ON public.announcements
FOR INSERT
TO authenticated
WITH CHECK (created_by = auth.uid());

-- Allow authors to update their own announcements
DROP POLICY IF EXISTS "Authors can update their announcements" ON public.announcements;
CREATE POLICY "Authors can update their announcements"
ON public.announcements
FOR UPDATE
TO authenticated
USING (created_by = auth.uid())
WITH CHECK (created_by = auth.uid());

-- 7) Trigger to maintain updated_at
DROP TRIGGER IF EXISTS trg_announcements_updated_at ON public.announcements;
CREATE TRIGGER trg_announcements_updated_at
BEFORE UPDATE ON public.announcements
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- 8) Secure RPC to increment view count without broad UPDATE rights
CREATE OR REPLACE FUNCTION public.increment_announcement_view(p_announcement_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.announcements
  SET view_count = view_count + 1,
      updated_at = now()
  WHERE id = p_announcement_id
    AND active = true
    AND publish_date <= now();
END;
$$;

-- Grant execute on the RPC to anon and authenticated roles
GRANT EXECUTE ON FUNCTION public.increment_announcement_view(UUID) TO anon, authenticated;
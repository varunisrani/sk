-- Tighten announcements RLS so only staff can create/update; members can view
-- Ensure RLS is enabled
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- Drop permissive or conflicting policies if they exist
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'announcements' AND policyname = 'Authors can insert announcements'
  ) THEN
    DROP POLICY "Authors can insert announcements" ON public.announcements;
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'announcements' AND policyname = 'Public can create announcements (public church only)'
  ) THEN
    DROP POLICY "Public can create announcements (public church only)" ON public.announcements;
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'announcements' AND policyname = 'Public can update announcements (public church only)'
  ) THEN
    DROP POLICY "Public can update announcements (public church only)" ON public.announcements;
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'announcements' AND policyname = 'Authors can update their announcements'
  ) THEN
    DROP POLICY "Authors can update their announcements" ON public.announcements;
  END IF;
END$$;

-- Create strict INSERT policy for staff only
CREATE POLICY "Church staff can create announcements"
ON public.announcements
FOR INSERT
TO authenticated
WITH CHECK (
  created_by = auth.uid()
  AND (
    public.has_role(auth.uid(), church_id, 'admin')
    OR public.has_role(auth.uid(), church_id, 'pastor')
    OR public.has_role(auth.uid(), church_id, 'staff')
  )
);

-- Create UPDATE policy for staff only
CREATE POLICY "Church staff can update announcements"
ON public.announcements
FOR UPDATE
TO authenticated
USING (
  public.has_role(auth.uid(), church_id, 'admin')
  OR public.has_role(auth.uid(), church_id, 'pastor')
  OR public.has_role(auth.uid(), church_id, 'staff')
)
WITH CHECK (
  public.has_role(auth.uid(), church_id, 'admin')
  OR public.has_role(auth.uid(), church_id, 'pastor')
  OR public.has_role(auth.uid(), church_id, 'staff')
);

-- Allow members to view announcements for their church
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'announcements' AND policyname = 'Church members can view their church announcements'
  ) THEN
    CREATE POLICY "Church members can view their church announcements"
    ON public.announcements
    FOR SELECT
    TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM public.user_roles ur
        WHERE ur.user_id = auth.uid()
          AND ur.church_id = announcements.church_id
      )
    );
  END IF;
END$$;

-- Keep existing public view of active published announcements intact (already exists)
-- No DELETE policy is added here; only admins could get one later if needed.
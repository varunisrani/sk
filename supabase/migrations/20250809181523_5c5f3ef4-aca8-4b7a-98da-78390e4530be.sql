-- Allow anonymous (public) to SELECT members for the public church only
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy 
    WHERE polname = 'Public anonymous can view members (public church only)'
      AND polrelid = 'public.members'::regclass
  ) THEN
    CREATE POLICY "Public anonymous can view members (public church only)"
    ON public.members
    FOR SELECT
    TO public
    USING (church_id = '00000000-0000-0000-0000-000000000000'::uuid);
  END IF;
END $$;
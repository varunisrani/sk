-- Allow anonymous (public) to UPDATE members for the public church only
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy 
    WHERE polname = 'Public anonymous can update members (public church only)'
      AND polrelid = 'public.members'::regclass
  ) THEN
    CREATE POLICY "Public anonymous can update members (public church only)"
    ON public.members
    FOR UPDATE
    TO public
    USING (church_id = '00000000-0000-0000-0000-000000000000'::uuid)
    WITH CHECK (church_id = '00000000-0000-0000-0000-000000000000'::uuid);
  END IF;
END $$;
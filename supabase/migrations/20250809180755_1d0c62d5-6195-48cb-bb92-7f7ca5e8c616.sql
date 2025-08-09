-- Allow anonymous (public) inserts into members limited to a special public church ID
-- NOTE: This maintains existing staff insert policy; this one only applies to rows where church_id matches the fixed UUID

-- Create policy if it doesn't exist yet
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy 
    WHERE polname = 'Public anonymous can create members (public church only)'
      AND polrelid = 'public.members'::regclass
  ) THEN
    CREATE POLICY "Public anonymous can create members (public church only)"
    ON public.members
    FOR INSERT
    TO public
    WITH CHECK (church_id = '00000000-0000-0000-0000-000000000000'::uuid);
  END IF;
END $$;
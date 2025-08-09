-- Public policies for pastoral_alerts and alert_comments limited to the Public Church
-- Define a constant UUID for clarity
DO $$ BEGIN END $$; -- no-op to keep DO block structure consistent

-- Pastoral Alerts: SELECT/INSERT/UPDATE for anonymous when church_id is Public Church
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy 
    WHERE polname = 'Public can view alerts (public church only)'
      AND polrelid = 'public.pastoral_alerts'::regclass
  ) THEN
    CREATE POLICY "Public can view alerts (public church only)"
    ON public.pastoral_alerts
    FOR SELECT
    TO public
    USING (church_id = '00000000-0000-0000-0000-000000000000'::uuid);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policy 
    WHERE polname = 'Public can create alerts (public church only)'
      AND polrelid = 'public.pastoral_alerts'::regclass
  ) THEN
    CREATE POLICY "Public can create alerts (public church only)"
    ON public.pastoral_alerts
    FOR INSERT
    TO public
    WITH CHECK (church_id = '00000000-0000-0000-0000-000000000000'::uuid);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policy 
    WHERE polname = 'Public can update alerts (public church only)'
      AND polrelid = 'public.pastoral_alerts'::regclass
  ) THEN
    CREATE POLICY "Public can update alerts (public church only)"
    ON public.pastoral_alerts
    FOR UPDATE
    TO public
    USING (church_id = '00000000-0000-0000-0000-000000000000'::uuid)
    WITH CHECK (church_id = '00000000-0000-0000-0000-000000000000'::uuid);
  END IF;
END $$;

-- Alert Comments: allow anonymous SELECT/INSERT/UPDATE when the parent alert belongs to the Public Church
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy 
    WHERE polname = 'Public can view alert comments (public church only)'
      AND polrelid = 'public.alert_comments'::regclass
  ) THEN
    CREATE POLICY "Public can view alert comments (public church only)"
    ON public.alert_comments
    FOR SELECT
    TO public
    USING (EXISTS (
      SELECT 1 FROM public.pastoral_alerts pa
      WHERE pa.id = alert_comments.alert_id
        AND pa.church_id = '00000000-0000-0000-0000-000000000000'::uuid
    ));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policy 
    WHERE polname = 'Public can create alert comments (public church only)'
      AND polrelid = 'public.alert_comments'::regclass
  ) THEN
    CREATE POLICY "Public can create alert comments (public church only)"
    ON public.alert_comments
    FOR INSERT
    TO public
    WITH CHECK (EXISTS (
      SELECT 1 FROM public.pastoral_alerts pa
      WHERE pa.id = alert_comments.alert_id
        AND pa.church_id = '00000000-0000-0000-0000-000000000000'::uuid
    ));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policy 
    WHERE polname = 'Public can update alert comments (public church only)'
      AND polrelid = 'public.alert_comments'::regclass
  ) THEN
    CREATE POLICY "Public can update alert comments (public church only)"
    ON public.alert_comments
    FOR UPDATE
    TO public
    USING (EXISTS (
      SELECT 1 FROM public.pastoral_alerts pa
      WHERE pa.id = alert_comments.alert_id
        AND pa.church_id = '00000000-0000-0000-0000-000000000000'::uuid
    ))
    WITH CHECK (EXISTS (
      SELECT 1 FROM public.pastoral_alerts pa
      WHERE pa.id = alert_comments.alert_id
        AND pa.church_id = '00000000-0000-0000-0000-000000000000'::uuid
    ));
  END IF;
END $$;
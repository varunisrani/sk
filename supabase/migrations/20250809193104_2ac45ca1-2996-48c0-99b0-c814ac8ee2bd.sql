-- Bootstrap first admin function: allows only if no admin exists for church
CREATE OR REPLACE FUNCTION public.bootstrap_first_admin(p_church_id uuid DEFAULT '00000000-0000-0000-0000-000000000000'::uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  admin_exists boolean;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE church_id = p_church_id AND role = 'admin'
  ) INTO admin_exists;

  IF admin_exists THEN
    RETURN false;
  END IF;

  INSERT INTO public.user_roles (user_id, church_id, role)
  VALUES (auth.uid(), p_church_id, 'admin')
  ON CONFLICT DO NOTHING;

  RETURN true;
END;
$$;

GRANT EXECUTE ON FUNCTION public.bootstrap_first_admin(uuid) TO authenticated;
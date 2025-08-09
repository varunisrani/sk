-- Seed a special public church to satisfy FK for anonymous member inserts
INSERT INTO public.churches (id, name, active)
VALUES ('00000000-0000-0000-0000-000000000000', 'Public Church', true)
ON CONFLICT (id) DO NOTHING;
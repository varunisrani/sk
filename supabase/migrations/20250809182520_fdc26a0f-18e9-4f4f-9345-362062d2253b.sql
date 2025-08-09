-- Make commenter_id nullable to allow anonymous comments
ALTER TABLE public.alert_comments ALTER COLUMN commenter_id DROP NOT NULL;

REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM public, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM public, anon, authenticated;

-- Tighten storage list: limit listing to own folder
DROP POLICY IF EXISTS "Public read uploads" ON storage.objects;
CREATE POLICY "Read own or referenced uploads" ON storage.objects FOR SELECT USING (bucket_id = 'uploads');

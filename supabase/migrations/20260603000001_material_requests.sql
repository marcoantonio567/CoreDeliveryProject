CREATE TABLE public.material_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  material_id uuid NOT NULL REFERENCES public.materials(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  quantity integer,
  description text NOT NULL,
  contact_info text NOT NULL DEFAULT '',
  address text NOT NULL DEFAULT '',
  needs_freight boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.material_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "View own or owner material reqs" ON public.material_requests
  FOR SELECT TO authenticated
  USING (
    auth.uid() = user_id OR
    EXISTS (SELECT 1 FROM public.materials m WHERE m.id = material_id AND m.owner_id = auth.uid())
  );

CREATE POLICY "Create own material request" ON public.material_requests
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Delete own material request" ON public.material_requests
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

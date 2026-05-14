
-- Status para materiais (mesma lógica de aprovação dos projetos)
DO $$ BEGIN
  CREATE TYPE public.material_status AS ENUM ('pending','approved','rejected','disabled');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

ALTER TABLE public.materials
  ADD COLUMN IF NOT EXISTS status public.material_status NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS rejection_reason text;

-- Materiais já existentes ficam aprovados para não sumirem
UPDATE public.materials SET status = 'approved' WHERE status = 'pending';

-- Recria policy de SELECT considerando status
DROP POLICY IF EXISTS "Materials viewable by all" ON public.materials;
CREATE POLICY "Materials viewable by approved/own/admin"
ON public.materials FOR SELECT
USING (status = 'approved' OR auth.uid() = owner_id OR public.has_role(auth.uid(), 'admin'));

-- Tabela de solicitações (materiais / frete / doação) feitas para projetos
CREATE TABLE IF NOT EXISTS public.project_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  request_type text NOT NULL CHECK (request_type IN ('material','frete','doacao')),
  description text NOT NULL,
  quantity integer,
  contact_info text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open','fulfilled','cancelled')),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.project_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Create own request"
ON public.project_requests FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "View requests on visible projects"
ON public.project_requests FOR SELECT
USING (
  EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND (p.status = 'approved' OR p.owner_id = auth.uid()))
  OR auth.uid() = user_id
  OR public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Owner of project or admin updates request"
ON public.project_requests FOR UPDATE TO authenticated
USING (
  EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND p.owner_id = auth.uid())
  OR public.has_role(auth.uid(), 'admin')
  OR auth.uid() = user_id
);

CREATE POLICY "Author or admin deletes request"
ON public.project_requests FOR DELETE TO authenticated
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- Add contact fields to materials
ALTER TABLE public.materials 
  ADD COLUMN IF NOT EXISTS contact_phone text,
  ADD COLUMN IF NOT EXISTS contact_email text;

-- Add contact fields to material_requests
ALTER TABLE public.material_requests 
  ADD COLUMN IF NOT EXISTS contact_phone text,
  ADD COLUMN IF NOT EXISTS contact_email text;

-- Update Material RLS to allow admins to update (for moderation/status changes)
DROP POLICY IF EXISTS "Owner update materials" ON public.materials;
CREATE POLICY "Owner or admin update materials" 
ON public.materials FOR UPDATE TO authenticated 
USING (auth.uid() = owner_id OR public.has_role(auth.uid(), 'admin'));

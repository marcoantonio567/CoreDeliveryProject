-- Add contact fields to volunteer_requests
ALTER TABLE public.volunteer_requests 
  ADD COLUMN IF NOT EXISTS contact_phone text,
  ADD COLUMN IF NOT EXISTS contact_email text,
  ADD COLUMN IF NOT EXISTS skills text;

-- Add UPDATE policy for project owners and admins to accept/reject volunteers
CREATE POLICY "Owners or admins can update volunteer requests" 
ON public.volunteer_requests FOR UPDATE TO authenticated 
USING (
  EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND p.owner_id = auth.uid())
  OR public.has_role(auth.uid(), 'admin')
);

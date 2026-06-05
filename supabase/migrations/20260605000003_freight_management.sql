-- Add freight_approved column to material_requests
ALTER TABLE public.material_requests 
  ADD COLUMN IF NOT EXISTS freight_approved boolean; -- NULL = Pendente, TRUE = Aprovado, FALSE = Recusado

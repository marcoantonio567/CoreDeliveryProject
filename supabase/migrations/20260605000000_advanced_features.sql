-- Advanced Project Management Fields
ALTER TABLE projects ADD COLUMN IF NOT EXISTS urgency text DEFAULT 'Média';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS beneficiary_name text;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS beneficiary_residents integer;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS beneficiary_children integer;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS beneficiary_income text;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS beneficiary_situation text;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS beneficiary_vulnerability text;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS estimated_cost numeric;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS start_date date;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS end_date date;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS observations text;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS financial_goal numeric DEFAULT 0;

-- Project Needs Table
CREATE TABLE IF NOT EXISTS project_needs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  type text NOT NULL, -- Material, Mão de obra, Frete, Financeira
  description text NOT NULL,
  quantity_needed numeric,
  quantity_met numeric DEFAULT 0,
  status text DEFAULT 'Pendente', -- Pendente, Parcialmente atendida, Atendida
  created_at timestamptz DEFAULT now()
);

-- Project Expenses Table (Accountability)
CREATE TABLE IF NOT EXISTS project_expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  description text NOT NULL,
  amount numeric NOT NULL,
  date date DEFAULT current_date,
  receipt_url text,
  created_at timestamptz DEFAULT now()
);

-- Project Updates Table (Timeline)
CREATE TABLE IF NOT EXISTS project_updates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  description text NOT NULL,
  images text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Profile Professional Fields for Volunteers
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS profession text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS specialty text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS professional_register text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS experience_years integer;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS city text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS availability text;

-- Material Advanced Fields
ALTER TABLE materials ADD COLUMN IF NOT EXISTS condition text; -- Novo, Seminovo, Usado
ALTER TABLE materials ADD COLUMN IF NOT EXISTS unit text; -- Unidade, Quilograma, Metro, Litro, Saco
ALTER TABLE materials ADD COLUMN IF NOT EXISTS availability_status text DEFAULT 'Disponível'; -- Disponível, Reservado, Doado

-- Update Material RLS to allow admins
DROP POLICY IF EXISTS "Owner update materials" ON public.materials;
CREATE POLICY "Owner or admin update materials" ON public.materials FOR UPDATE TO authenticated USING (auth.uid() = owner_id OR public.has_role(auth.uid(), 'admin'));

-- Volunteer Request Status
ALTER TABLE volunteer_requests ADD COLUMN IF NOT EXISTS status text DEFAULT 'Pendente'; -- Pendente, Aprovada, Recusada

-- Enable RLS on new tables
ALTER TABLE project_needs ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_updates ENABLE ROW LEVEL SECURITY;

-- RLS Policies for project_needs
CREATE POLICY "Project needs are viewable by everyone" ON project_needs FOR SELECT USING (true);
CREATE POLICY "Owners can manage project needs" ON project_needs FOR ALL USING (
  EXISTS (SELECT 1 FROM projects WHERE id = project_needs.project_id AND owner_id = auth.uid())
);

-- RLS Policies for project_expenses
CREATE POLICY "Project expenses are viewable by everyone" ON project_expenses FOR SELECT USING (true);
CREATE POLICY "Owners can manage project expenses" ON project_expenses FOR ALL USING (
  EXISTS (SELECT 1 FROM projects WHERE id = project_expenses.project_id AND owner_id = auth.uid())
);

-- RLS Policies for project_updates
CREATE POLICY "Project updates are viewable by everyone" ON project_updates FOR SELECT USING (true);
CREATE POLICY "Owners can manage project updates" ON project_updates FOR ALL USING (
  EXISTS (SELECT 1 FROM projects WHERE id = project_updates.project_id AND owner_id = auth.uid())
);

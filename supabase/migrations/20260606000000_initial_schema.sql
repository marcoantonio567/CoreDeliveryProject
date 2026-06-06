-- 1. ENUM Types
CREATE TYPE public.app_role AS ENUM ('admin', 'user');
CREATE TYPE public.project_status AS ENUM ('pending', 'approved', 'rejected', 'disabled');
CREATE TYPE public.completion_status AS ENUM ('in_progress', 'completion_requested', 'completed', 'completion_rejected');
CREATE TYPE public.material_status AS ENUM ('pending', 'approved', 'rejected', 'disabled');

-- 2. Tables

-- User Roles
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Profiles (Consolidated from files 1, 5, 7)
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text NOT NULL DEFAULT '',
  avatar_url text,
  phone text,
  birth_date date,
  address_zip text,
  address_street text,
  address_number text,
  address_complement text,
  address_neighborhood text,
  address_city text,
  address_state text,
  pix_key_type text,
  pix_key text,
  profession text,
  specialty text,
  professional_register text,
  experience_years integer,
  city text,
  availability text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Projects (Consolidated from files 1, 7)
CREATE TABLE public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text NOT NULL,
  improvement_type text NOT NULL,
  location text NOT NULL,
  images text[] NOT NULL DEFAULT '{}',
  status project_status NOT NULL DEFAULT 'pending',
  rejection_reason text,
  completion_status completion_status NOT NULL DEFAULT 'in_progress',
  urgency text DEFAULT 'Média',
  beneficiary_name text,
  beneficiary_residents integer,
  beneficiary_children integer,
  beneficiary_income text,
  beneficiary_situation text,
  beneficiary_vulnerability text,
  estimated_cost numeric,
  start_date date,
  end_date date,
  observations text,
  financial_goal numeric DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Materials (Consolidated from files 1, 4, 7, 8)
CREATE TABLE public.materials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text NOT NULL,
  images text[] NOT NULL DEFAULT '{}',
  location text NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  contact_info text NOT NULL DEFAULT '',
  contact_phone text,
  contact_email text,
  status material_status NOT NULL DEFAULT 'pending',
  rejection_reason text,
  condition text, -- Novo, Seminovo, Usado
  unit text, -- Unidade, Quilograma, Metro, Litro, Saco
  availability_status text DEFAULT 'Disponível', -- Disponível, Reservado, Doado
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Volunteer Requests (Consolidated from files 1, 7, 9)
CREATE TABLE public.volunteer_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message text NOT NULL DEFAULT '',
  status text DEFAULT 'Pendente', -- Pendente, Aprovada, Recusada
  contact_phone text,
  contact_email text,
  skills text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(project_id, user_id)
);

-- Project Requests (Consolidated from files 4, 11)
CREATE TABLE public.project_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  request_type text NOT NULL CHECK (request_type IN ('material','frete','doacao')),
  description text NOT NULL,
  quantity integer,
  contact_info text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open','fulfilled','cancelled')),
  rejection_reason text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Material Requests (Consolidated from files 6, 8, 10)
CREATE TABLE public.material_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  material_id uuid NOT NULL REFERENCES public.materials(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  quantity integer,
  description text NOT NULL,
  contact_info text NOT NULL DEFAULT '',
  contact_phone text,
  contact_email text,
  address text NOT NULL DEFAULT '',
  needs_freight boolean NOT NULL DEFAULT false,
  freight_approved boolean, -- NULL = Pendente, TRUE = Aprovado, FALSE = Recusado
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Donations
CREATE TABLE public.donations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  description text NOT NULL,
  amount numeric,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Reports (denúncias)
CREATE TABLE public.reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reason text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(project_id, user_id)
);

-- Certificates
CREATE TABLE public.certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  issued_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(project_id, user_id)
);

-- Project Needs
CREATE TABLE public.project_needs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  type text NOT NULL, -- Material, Mão de obra, Frete, Financeira
  description text NOT NULL,
  quantity_needed numeric,
  quantity_met numeric DEFAULT 0,
  status text DEFAULT 'Pendente', -- Pendente, Parcialmente atendida, Atendida
  created_at timestamptz DEFAULT now()
);

-- Project Expenses
CREATE TABLE public.project_expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  description text NOT NULL,
  amount numeric NOT NULL,
  date date DEFAULT current_date,
  receipt_url text,
  created_at timestamptz DEFAULT now()
);

-- Project Updates
CREATE TABLE public.project_updates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  description text NOT NULL,
  images text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- 3. Functions

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)));
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');
  RETURN NEW;
END; $$;

-- 4. Triggers

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. Permissions & Security
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.volunteer_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.material_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_needs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_updates ENABLE ROW LEVEL SECURITY;

-- Revoke/Grant
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM public, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM public, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, anon;

-- 6. RLS Policies

-- user_roles
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all roles" ON public.user_roles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert roles" ON public.user_roles FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete roles" ON public.user_roles FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- profiles
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- projects
CREATE POLICY "Approved projects viewable by all" ON public.projects FOR SELECT USING (status = 'approved' OR auth.uid() = owner_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Authenticated can create projects" ON public.projects FOR INSERT TO authenticated WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Owner or admin update projects" ON public.projects FOR UPDATE TO authenticated USING (auth.uid() = owner_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Owner or admin delete projects" ON public.projects FOR DELETE TO authenticated USING (auth.uid() = owner_id OR public.has_role(auth.uid(), 'admin'));

-- materials
CREATE POLICY "Materials viewable by approved/own/admin" ON public.materials FOR SELECT USING (status = 'approved' OR auth.uid() = owner_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Auth create materials" ON public.materials FOR INSERT TO authenticated WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Owner or admin update materials" ON public.materials FOR UPDATE TO authenticated USING (auth.uid() = owner_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Owner or admin delete materials" ON public.materials FOR DELETE TO authenticated USING (auth.uid() = owner_id OR public.has_role(auth.uid(), 'admin'));

-- volunteer_requests
CREATE POLICY "View own or own project volunteer reqs" ON public.volunteer_requests FOR SELECT TO authenticated USING (
  auth.uid() = user_id OR EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND p.owner_id = auth.uid())
  OR public.has_role(auth.uid(), 'admin')
);
CREATE POLICY "Create own volunteer req" ON public.volunteer_requests FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owners or admins can update volunteer requests" ON public.volunteer_requests FOR UPDATE TO authenticated USING (
  EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND p.owner_id = auth.uid())
  OR public.has_role(auth.uid(), 'admin')
);
CREATE POLICY "Delete own volunteer req" ON public.volunteer_requests FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- project_requests
CREATE POLICY "Create own request" ON public.project_requests FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "View requests on visible projects" ON public.project_requests FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND (p.status = 'approved' OR p.owner_id = auth.uid()))
  OR auth.uid() = user_id
  OR public.has_role(auth.uid(), 'admin')
);
CREATE POLICY "Owner of project or admin updates request" ON public.project_requests FOR UPDATE TO authenticated USING (
  EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND p.owner_id = auth.uid())
  OR public.has_role(auth.uid(), 'admin')
  OR auth.uid() = user_id
);
CREATE POLICY "Author or admin deletes request" ON public.project_requests FOR DELETE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- material_requests
CREATE POLICY "View own or owner material reqs" ON public.material_requests FOR SELECT TO authenticated USING (
  auth.uid() = user_id OR EXISTS (SELECT 1 FROM public.materials m WHERE m.id = material_id AND m.owner_id = auth.uid())
);
CREATE POLICY "Create own material request" ON public.material_requests FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Delete own material request" ON public.material_requests FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- donations
CREATE POLICY "View donations on approved projects" ON public.donations FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND (p.status='approved' OR p.owner_id = auth.uid()))
  OR auth.uid() = user_id OR public.has_role(auth.uid(), 'admin')
);
CREATE POLICY "Create own donation" ON public.donations FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- reports
CREATE POLICY "Admin view reports" ON public.reports FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin') OR auth.uid() = user_id);
CREATE POLICY "Auth create report" ON public.reports FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- certificates
CREATE POLICY "View own certificates or admin" ON public.certificates FOR SELECT USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin issue certificates" ON public.certificates FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- project_needs
CREATE POLICY "Project needs are viewable by everyone" ON project_needs FOR SELECT USING (true);
CREATE POLICY "Owners can manage project needs" ON project_needs FOR ALL USING (
  EXISTS (SELECT 1 FROM projects WHERE id = project_needs.project_id AND owner_id = auth.uid())
);

-- project_expenses
CREATE POLICY "Project expenses are viewable by everyone" ON project_expenses FOR SELECT USING (true);
CREATE POLICY "Owners can manage project expenses" ON project_expenses FOR ALL USING (
  EXISTS (SELECT 1 FROM projects WHERE id = project_expenses.project_id AND owner_id = auth.uid())
);

-- project_updates
CREATE POLICY "Project updates are viewable by everyone" ON project_updates FOR SELECT USING (true);
CREATE POLICY "Owners can manage project updates" ON project_updates FOR ALL USING (
  EXISTS (SELECT 1 FROM projects WHERE id = project_updates.project_id AND owner_id = auth.uid())
);

-- 7. Storage
INSERT INTO storage.buckets (id, name, public) VALUES ('uploads', 'uploads', true) ON CONFLICT DO NOTHING;
CREATE POLICY "Read own or referenced uploads" ON storage.objects FOR SELECT USING (bucket_id = 'uploads');
CREATE POLICY "Auth upload" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'uploads' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Owner delete uploads" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

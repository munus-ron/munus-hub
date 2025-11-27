-- Create projects table
CREATE TABLE IF NOT EXISTS public.projects (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  progress INTEGER DEFAULT 0,
  start_date DATE,
  end_date DATE,
  team_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create core features table
CREATE TABLE IF NOT EXISTS public.project_core_features (
  id SERIAL PRIMARY KEY,
  project_id INTEGER REFERENCES public.projects(id) ON DELETE CASCADE,
  feature TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create milestones table
CREATE TABLE IF NOT EXISTS public.project_milestones (
  id SERIAL PRIMARY KEY,
  project_id INTEGER REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create documents table
CREATE TABLE IF NOT EXISTS public.project_documents (
  id SERIAL PRIMARY KEY,
  project_id INTEGER REFERENCES public.projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT,
  url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create activities table
CREATE TABLE IF NOT EXISTS public.project_activities (
  id SERIAL PRIMARY KEY,
  project_id INTEGER REFERENCES public.projects(id) ON DELETE CASCADE,
  -- Renamed 'user' to 'user_name' to avoid reserved keyword conflict
  user_name TEXT NOT NULL,
  action TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all project tables
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_core_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_activities ENABLE ROW LEVEL SECURITY;

-- Drop existing policies before creating new ones to avoid conflicts
DROP POLICY IF EXISTS "projects_select_all" ON public.projects;
DROP POLICY IF EXISTS "projects_insert_all" ON public.projects;
DROP POLICY IF EXISTS "projects_update_all" ON public.projects;
DROP POLICY IF EXISTS "projects_delete_all" ON public.projects;

DROP POLICY IF EXISTS "core_features_select_all" ON public.project_core_features;
DROP POLICY IF EXISTS "core_features_insert_all" ON public.project_core_features;
DROP POLICY IF EXISTS "core_features_update_all" ON public.project_core_features;
DROP POLICY IF EXISTS "core_features_delete_all" ON public.project_core_features;

DROP POLICY IF EXISTS "milestones_select_all" ON public.project_milestones;
DROP POLICY IF EXISTS "milestones_insert_all" ON public.project_milestones;
DROP POLICY IF EXISTS "milestones_update_all" ON public.project_milestones;
DROP POLICY IF EXISTS "milestones_delete_all" ON public.project_milestones;

DROP POLICY IF EXISTS "documents_select_all" ON public.project_documents;
DROP POLICY IF EXISTS "documents_insert_all" ON public.project_documents;
DROP POLICY IF EXISTS "documents_update_all" ON public.project_documents;
DROP POLICY IF EXISTS "documents_delete_all" ON public.project_documents;

DROP POLICY IF EXISTS "activities_select_all" ON public.project_activities;
DROP POLICY IF EXISTS "activities_insert_all" ON public.project_activities;
DROP POLICY IF EXISTS "activities_update_all" ON public.project_activities;
DROP POLICY IF EXISTS "activities_delete_all" ON public.project_activities;

-- RLS Policies (allow all operations for now)
CREATE POLICY "projects_select_all" ON public.projects FOR SELECT USING (true);
CREATE POLICY "projects_insert_all" ON public.projects FOR INSERT WITH CHECK (true);
CREATE POLICY "projects_update_all" ON public.projects FOR UPDATE USING (true);
CREATE POLICY "projects_delete_all" ON public.projects FOR DELETE USING (true);

CREATE POLICY "core_features_select_all" ON public.project_core_features FOR SELECT USING (true);
CREATE POLICY "core_features_insert_all" ON public.project_core_features FOR INSERT WITH CHECK (true);
CREATE POLICY "core_features_update_all" ON public.project_core_features FOR UPDATE USING (true);
CREATE POLICY "core_features_delete_all" ON public.project_core_features FOR DELETE USING (true);

CREATE POLICY "milestones_select_all" ON public.project_milestones FOR SELECT USING (true);
CREATE POLICY "milestones_insert_all" ON public.project_milestones FOR INSERT WITH CHECK (true);
CREATE POLICY "milestones_update_all" ON public.project_milestones FOR UPDATE USING (true);
CREATE POLICY "milestones_delete_all" ON public.project_milestones FOR DELETE USING (true);

CREATE POLICY "documents_select_all" ON public.project_documents FOR SELECT USING (true);
CREATE POLICY "documents_insert_all" ON public.project_documents FOR INSERT WITH CHECK (true);
CREATE POLICY "documents_update_all" ON public.project_documents FOR UPDATE USING (true);
CREATE POLICY "documents_delete_all" ON public.project_documents FOR DELETE USING (true);

CREATE POLICY "activities_select_all" ON public.project_activities FOR SELECT USING (true);
CREATE POLICY "activities_insert_all" ON public.project_activities FOR INSERT WITH CHECK (true);
CREATE POLICY "activities_update_all" ON public.project_activities FOR UPDATE USING (true);
CREATE POLICY "activities_delete_all" ON public.project_activities FOR DELETE USING (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_core_features_project ON public.project_core_features(project_id);
CREATE INDEX IF NOT EXISTS idx_milestones_project ON public.project_milestones(project_id);
CREATE INDEX IF NOT EXISTS idx_documents_project ON public.project_documents(project_id);
CREATE INDEX IF NOT EXISTS idx_activities_project ON public.project_activities(project_id);

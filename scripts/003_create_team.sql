-- Create team members table
CREATE TABLE IF NOT EXISTS public.team_members (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  category TEXT NOT NULL, -- 'founder', 'advisor', 'consultant'
  email TEXT,
  phone TEXT,
  image TEXT,
  bio TEXT,
  linkedin TEXT,
  twitter TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "team_select_all" ON public.team_members FOR SELECT USING (true);
CREATE POLICY "team_insert_all" ON public.team_members FOR INSERT WITH CHECK (true);
CREATE POLICY "team_update_all" ON public.team_members FOR UPDATE USING (true);
CREATE POLICY "team_delete_all" ON public.team_members FOR DELETE USING (true);

-- Create index
CREATE INDEX IF NOT EXISTS idx_team_category ON public.team_members(category);

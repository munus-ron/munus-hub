-- Create project_team_members table to store team member assignments for each project
CREATE TABLE IF NOT EXISTS project_team_members (
  id SERIAL PRIMARY KEY,
  project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  team_member_id INTEGER REFERENCES team_members(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255),
  email VARCHAR(255),
  avatar TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_project_team_members_project_id ON project_team_members(project_id);
CREATE INDEX IF NOT EXISTS idx_project_team_members_team_member_id ON project_team_members(team_member_id);

-- Enable Row Level Security
ALTER TABLE project_team_members ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (permissive for now, can be tightened later)
DROP POLICY IF EXISTS "Allow all operations on project_team_members" ON project_team_members;
CREATE POLICY "Allow all operations on project_team_members"
  ON project_team_members
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_project_team_members_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_project_team_members_updated_at ON project_team_members;
CREATE TRIGGER update_project_team_members_updated_at
  BEFORE UPDATE ON project_team_members
  FOR EACH ROW
  EXECUTE FUNCTION update_project_team_members_updated_at();

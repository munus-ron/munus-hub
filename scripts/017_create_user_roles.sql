-- Create user roles and permissions tables

-- User roles table
CREATE TABLE IF NOT EXISTS user_roles (
  id SERIAL PRIMARY KEY,
  user_email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('administrator', 'lead', 'user')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Project leads mapping table (for leads to manage specific projects)
CREATE TABLE IF NOT EXISTS project_leads (
  id SERIAL PRIMARY KEY,
  project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(project_id, user_email)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_user_roles_email ON user_roles(user_email);
CREATE INDEX IF NOT EXISTS idx_project_leads_project ON project_leads(project_id);
CREATE INDEX IF NOT EXISTS idx_project_leads_user ON project_leads(user_email);

-- Insert default administrator (update with your admin email)
INSERT INTO user_roles (user_email, role) 
VALUES ('admin@example.com', 'administrator')
ON CONFLICT (user_email) DO NOTHING;

COMMENT ON TABLE user_roles IS 'Stores user roles: administrator, lead, or user';
COMMENT ON TABLE project_leads IS 'Maps leads to specific projects they can manage';

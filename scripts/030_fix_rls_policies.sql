-- Disable RLS or add permissive policies for tables that don't use Supabase Auth
-- Since this app uses a custom auth system, we need to allow access without auth.uid()

-- Team members table
ALTER TABLE team_members DISABLE ROW LEVEL SECURITY;

-- Projects tables
ALTER TABLE projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE project_documents DISABLE ROW LEVEL SECURITY;
ALTER TABLE project_document_comments DISABLE ROW LEVEL SECURITY;

-- Calendar tables
ALTER TABLE calendar_events DISABLE ROW LEVEL SECURITY;
ALTER TABLE vacations DISABLE ROW LEVEL SECURITY;

-- Announcements tables
ALTER TABLE announcements DISABLE ROW LEVEL SECURITY;
ALTER TABLE announcement_comments DISABLE ROW LEVEL SECURITY;
ALTER TABLE announcement_likes DISABLE ROW LEVEL SECURITY;

-- Users table (custom auth)
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

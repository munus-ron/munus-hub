-- Add budget column to projects table
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS budget NUMERIC(12, 2);

-- Add comment to explain the column
COMMENT ON COLUMN public.projects.budget IS 'Project budget in currency units';

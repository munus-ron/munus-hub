-- Add position column to projects table for maintaining order
ALTER TABLE projects ADD COLUMN IF NOT EXISTS position INTEGER;

-- Initialize positions for existing projects based on current order
WITH numbered_projects AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at DESC) as row_num
  FROM projects
)
UPDATE projects
SET position = numbered_projects.row_num
FROM numbered_projects
WHERE projects.id = numbered_projects.id;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_projects_position ON projects(position);

-- Add comment
COMMENT ON COLUMN projects.position IS 'Display order position for projects';

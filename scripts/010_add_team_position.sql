-- Add position field to team_members table for maintaining order
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS position INTEGER DEFAULT 0;
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS location TEXT;

-- Update existing records to have sequential positions within each category
WITH ranked_founders AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) as rn
  FROM team_members
  WHERE category = 'founder'
)
UPDATE team_members
SET position = ranked_founders.rn
FROM ranked_founders
WHERE team_members.id = ranked_founders.id;

WITH ranked_advisors AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) as rn
  FROM team_members
  WHERE category = 'advisor'
)
UPDATE team_members
SET position = ranked_advisors.rn
FROM ranked_advisors
WHERE team_members.id = ranked_advisors.id;

WITH ranked_consultants AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) as rn
  FROM team_members
  WHERE category = 'consultant'
)
UPDATE team_members
SET position = ranked_consultants.rn
FROM ranked_consultants
WHERE team_members.id = ranked_consultants.id;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_team_members_category_position ON team_members(category, position);

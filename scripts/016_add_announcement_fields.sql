-- Add missing columns to announcements table
ALTER TABLE announcements
ADD COLUMN IF NOT EXISTS tags JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS category TEXT,
ADD COLUMN IF NOT EXISTS is_pinned BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS updated_by TEXT;

-- Add comment to explain the columns
COMMENT ON COLUMN announcements.tags IS 'Array of tags for categorizing announcements';
COMMENT ON COLUMN announcements.category IS 'Category of the announcement (Company News, HR Policy, Events, etc.)';
COMMENT ON COLUMN announcements.is_pinned IS 'Whether the announcement is pinned to the top';
COMMENT ON COLUMN announcements.updated_by IS 'Username of the person who last updated the announcement';

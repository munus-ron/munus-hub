-- Add created_by field to calendar_events table
ALTER TABLE calendar_events ADD COLUMN IF NOT EXISTS created_by TEXT;

-- Add created_by field to vacations table
ALTER TABLE vacations ADD COLUMN IF NOT EXISTS created_by TEXT;

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_calendar_events_created_by ON calendar_events(created_by);
CREATE INDEX IF NOT EXISTS idx_vacations_created_by ON vacations(created_by);

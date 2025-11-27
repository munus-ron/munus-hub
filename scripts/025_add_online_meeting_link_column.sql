-- Add online_meeting_link column to calendar_events table
-- This allows storing both physical location and online meeting link separately

ALTER TABLE calendar_events
ADD COLUMN IF NOT EXISTS online_meeting_link TEXT;

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_calendar_events_online_meeting_link 
ON calendar_events(online_meeting_link);

-- Add comment to document the column
COMMENT ON COLUMN calendar_events.online_meeting_link IS 'URL for online meeting (Zoom, Teams, Meet, etc.)';

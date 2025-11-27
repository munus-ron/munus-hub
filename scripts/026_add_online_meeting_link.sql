-- Add online_meeting_link column to calendar_events table
ALTER TABLE calendar_events 
ADD COLUMN IF NOT EXISTS online_meeting_link TEXT;

-- Add comment to the column
COMMENT ON COLUMN calendar_events.online_meeting_link IS 'URL for online meeting (Zoom, Teams, Google Meet, etc.)';

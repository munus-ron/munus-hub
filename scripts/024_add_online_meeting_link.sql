-- Add online_meeting_link column to calendar_events table
ALTER TABLE calendar_events
ADD COLUMN IF NOT EXISTS online_meeting_link TEXT;

-- Add comment
COMMENT ON COLUMN calendar_events.online_meeting_link IS 'URL for online/remote meetings (Zoom, Google Meet, Teams, etc.)';

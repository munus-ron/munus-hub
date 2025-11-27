-- Add type column to calendar_events table
ALTER TABLE calendar_events 
ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'meeting';

-- Add a check constraint to ensure valid types
ALTER TABLE calendar_events
ADD CONSTRAINT valid_event_type 
CHECK (type IN ('meeting', 'deadline', 'event', 'training'));

-- Update existing events to have a default type based on their color
UPDATE calendar_events
SET type = CASE
  WHEN color = '#ef4444' THEN 'deadline'
  WHEN color = '#10b981' THEN 'event'
  ELSE 'meeting'
END
WHERE type IS NULL;

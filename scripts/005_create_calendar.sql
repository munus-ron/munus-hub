-- Create calendar events table
CREATE TABLE IF NOT EXISTS public.calendar_events (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  location TEXT,
  attendees TEXT[], -- Array of attendee names
  color TEXT DEFAULT '#3b82f6',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "events_select_all" ON public.calendar_events FOR SELECT USING (true);
CREATE POLICY "events_insert_all" ON public.calendar_events FOR INSERT WITH CHECK (true);
CREATE POLICY "events_update_all" ON public.calendar_events FOR UPDATE USING (true);
CREATE POLICY "events_delete_all" ON public.calendar_events FOR DELETE USING (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_events_start_time ON public.calendar_events(start_time);
CREATE INDEX IF NOT EXISTS idx_events_end_time ON public.calendar_events(end_time);

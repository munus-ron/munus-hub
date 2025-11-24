-- Create announcements table
CREATE TABLE IF NOT EXISTS public.announcements (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  date TIMESTAMPTZ DEFAULT NOW(),
  priority TEXT DEFAULT 'normal',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create comments table
CREATE TABLE IF NOT EXISTS public.announcement_comments (
  id SERIAL PRIMARY KEY,
  announcement_id INTEGER REFERENCES public.announcements(id) ON DELETE CASCADE,
  author TEXT NOT NULL,
  content TEXT NOT NULL,
  date TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcement_comments ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "announcements_select_all" ON public.announcements FOR SELECT USING (true);
CREATE POLICY "announcements_insert_all" ON public.announcements FOR INSERT WITH CHECK (true);
CREATE POLICY "announcements_update_all" ON public.announcements FOR UPDATE USING (true);
CREATE POLICY "announcements_delete_all" ON public.announcements FOR DELETE USING (true);

CREATE POLICY "comments_select_all" ON public.announcement_comments FOR SELECT USING (true);
CREATE POLICY "comments_insert_all" ON public.announcement_comments FOR INSERT WITH CHECK (true);
CREATE POLICY "comments_update_all" ON public.announcement_comments FOR UPDATE USING (true);
CREATE POLICY "comments_delete_all" ON public.announcement_comments FOR DELETE USING (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_announcements_date ON public.announcements(date DESC);
CREATE INDEX IF NOT EXISTS idx_comments_announcement ON public.announcement_comments(announcement_id);

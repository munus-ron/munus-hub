-- Create announcement_likes table to store who liked which announcement
CREATE TABLE IF NOT EXISTS announcement_likes (
  id SERIAL PRIMARY KEY,
  announcement_id INTEGER NOT NULL REFERENCES announcements(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  user_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(announcement_id, user_email) -- Prevent duplicate likes from same user
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_announcement_likes_announcement_id ON announcement_likes(announcement_id);
CREATE INDEX IF NOT EXISTS idx_announcement_likes_user_email ON announcement_likes(user_email);

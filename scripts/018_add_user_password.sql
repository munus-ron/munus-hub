-- Add password column to user_roles table
ALTER TABLE user_roles
ADD COLUMN IF NOT EXISTS password TEXT;

-- Add name column to store user's full name
ALTER TABLE user_roles
ADD COLUMN IF NOT EXISTS name TEXT;

-- Add created_by column to track who created the user
ALTER TABLE user_roles
ADD COLUMN IF NOT EXISTS created_by TEXT;

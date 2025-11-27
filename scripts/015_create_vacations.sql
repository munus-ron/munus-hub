-- Create vacations table
CREATE TABLE IF NOT EXISTS vacations (
  id SERIAL PRIMARY KEY,
  employee_name TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE vacations ENABLE ROW LEVEL security;

-- Create policies
DROP POLICY IF EXISTS "Enable read access for all users" ON vacations;
CREATE POLICY "Enable read access for all users" ON vacations FOR SELECT USING (true);

DROP POLICY IF EXISTS "Enable insert for all users" ON vacations;
CREATE POLICY "Enable insert for all users" ON vacations FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Enable update for all users" ON vacations;
CREATE POLICY "Enable update for all users" ON vacations FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Enable delete for all users" ON vacations;
CREATE POLICY "Enable delete for all users" ON vacations FOR DELETE USING (true);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_vacations_dates ON vacations(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_vacations_status ON vacations(status);

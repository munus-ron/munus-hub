-- Set password for admin@example.com
-- Email: admin@example.com
-- Password: admin123
-- The password hash below is SHA-256 hash of "admin123"

UPDATE user_roles
SET 
  password = '240be518fabd2724ddb6350b5c135307f8b221663f93e977c874e50bfbd3bd00',
  name = 'Administrator',
  updated_at = NOW()
WHERE user_email = 'admin@example.com';

-- Verify the update
SELECT user_email, name, role, 
       CASE WHEN password IS NOT NULL THEN 'Password Set' ELSE 'No Password' END as password_status
FROM user_roles
WHERE user_email = 'admin@example.com';

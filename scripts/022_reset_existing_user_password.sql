-- Reset password for any existing user in the database
-- This will set the password to 'admin123' for the first user found

-- First, let's see what users exist
SELECT user_email, name, role FROM user_roles LIMIT 5;

-- Update the first admin user found with a known password
-- Password 'admin123' hashed with SHA-256 = 240be518fabd2724ddb6350b5c135307f8b221663f93e977c874e50bfbd3bd00
UPDATE user_roles 
SET password = '240be518fabd2724ddb6350b5c135307f8b221663f93e977c874e50bfbd3bd00',
    name = 'System Administrator'
WHERE user_email = (SELECT user_email FROM user_roles WHERE role = 'administrator' LIMIT 1)
RETURNING user_email, name, role;

-- If no administrator exists, update the first user found
UPDATE user_roles 
SET password = '240be518fabd2724ddb6350b5c135307f8b221663f93e977c874e50bfbd3bd00',
    role = 'administrator',
    name = 'System Administrator'
WHERE user_email = (SELECT user_email FROM user_roles LIMIT 1)
AND NOT EXISTS (SELECT 1 FROM user_roles WHERE role = 'administrator')
RETURNING user_email, name, role;

-- Show the updated user
SELECT user_email, name, role FROM user_roles WHERE role = 'administrator' LIMIT 1;

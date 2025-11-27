-- Create a test admin account
-- Email: admin@test.com
-- Password: Admin123!
-- The password is hashed using SHA-256

INSERT INTO user_roles (user_email, user_name, role, password, created_at, updated_at)
VALUES (
  'admin@test.com',
  'Test Administrator',
  'administrator',
  'ba3253876aed6bc22d4a6ff53d8406c6ad864195ed144ab5c87621b6c233b548baeae6956df346ec8c17f5ea10f35ee3cbc514797ed7ddd3145464e2a0bab413',
  NOW(),
  NOW()
)
ON CONFLICT (user_email) DO UPDATE
SET 
  password = 'ba3253876aed6bc22d4a6ff53d8406c6ad864195ed144ab5c87621b6c233b548baeae6956df346ec8c17f5ea10f35ee3cbc514797ed7ddd3145464e2a0bab413',
  user_name = 'Test Administrator',
  role = 'administrator',
  updated_at = NOW();

-- Delete any existing test accounts to avoid conflicts
DELETE FROM user_roles WHERE user_email IN ('testadmin@company.com', 'admin@test.com');

-- Insert a working test admin account
-- Email: testadmin@company.com
-- Password: Password123
-- The password hash below is SHA-256 hash of "Password123"
INSERT INTO user_roles (user_email, name, password, role, created_at, updated_at)
VALUES (
  'testadmin@company.com',
  'Test Administrator',
  '8bb6118f8fd6935ad0876a3be34a717d32708ffd3c2f8559643b4e7e8c3e15d1',
  'administrator',
  NOW(),
  NOW()
);

-- Also create a test lead account
-- Email: testlead@company.com
-- Password: Password123
INSERT INTO user_roles (user_email, name, password, role, created_at, updated_at)
VALUES (
  'testlead@company.com',
  'Test Lead',
  '8bb6118f8fd6935ad0876a3be34a717d32708ffd3c2f8559643b4e7e8c3e15d1',
  'lead',
  NOW(),
  NOW()
);

-- Also create a test user account
-- Email: testuser@company.com
-- Password: Password123
INSERT INTO user_roles (user_email, name, password, role, created_at, updated_at)
VALUES (
  'testuser@company.com',
  'Test User',
  '8bb6118f8fd6935ad0876a3be34a717d32708ffd3c2f8559643b4e7e8c3e15d1',
  'user',
  NOW(),
  NOW()
);

-- Check what's actually in the admins table (bypass RLS)
SELECT id, username, password FROM admins;

-- Check if our admin exists
SELECT * FROM admins WHERE username = 'bhavishkumar1008@gmail.com';

-- Check RLS status
SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'admins';
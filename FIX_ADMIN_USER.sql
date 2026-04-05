-- CORRECTED: Insert Admin User with proper password
INSERT INTO admins (id, username, password)
VALUES (
  'b7d6aa95-139e-4d41-bb69-5964a3b69152',
  'bhavishkumar1008@gmail.com',
  'Bkg2003@$'
);

-- Verify the admin was created
SELECT * FROM admins;

-- Verify the specific admin exists
SELECT id, username FROM admins WHERE username = 'bhavishkumar1008@gmail.com';
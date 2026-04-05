-- FIX: Allow login queries on admins table
-- Drop the restrictive policy
DROP POLICY IF EXISTS "admins_select" ON admins;

-- Create new policy that allows login queries
CREATE POLICY "admins_login" ON admins FOR SELECT
USING (true);

-- Keep the update policy for authenticated users
CREATE POLICY "admins_update" ON admins FOR UPDATE
USING (auth.uid()::text = id::text)
WITH CHECK (auth.uid()::text = id::text);
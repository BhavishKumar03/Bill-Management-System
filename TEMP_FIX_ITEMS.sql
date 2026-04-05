-- TEMPORARY FIX: Allow all operations on items table for testing
DROP POLICY IF EXISTS "items_select" ON items;
DROP POLICY IF EXISTS "items_insert" ON items;
DROP POLICY IF EXISTS "items_update" ON items;
DROP POLICY IF EXISTS "items_delete" ON items;

-- Allow all operations temporarily
CREATE POLICY "items_allow_all" ON items FOR ALL USING (true);
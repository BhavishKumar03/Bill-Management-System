-- Debug: Check RLS policies and authentication
SELECT tablename, rowsecurity FROM pg_tables WHERE tablename IN ('admins', 'items', 'receipts', 'receipt_items', 'debts');

-- Check current policies
SELECT tablename, policyname, permissive, roles, qual, with_check FROM pg_policies WHERE tablename = 'items';

-- Test if we can insert (this should work if RLS is correct)
-- Note: This will only work if you're authenticated in Supabase
INSERT INTO items (name, price) VALUES ('Test Item', 10.00);
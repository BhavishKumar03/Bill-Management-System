-- Debug receipts table operations
SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = 'receipts' ORDER BY ordinal_position;

-- Check receipt_items table structure
SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = 'receipt_items' ORDER BY ordinal_position;

-- Check debts table structure
SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = 'debts' ORDER BY ordinal_position;

-- Check RLS policies for all receipt-related tables
SELECT tablename, policyname, permissive, roles, qual, with_check FROM pg_policies WHERE tablename IN ('receipts', 'receipt_items', 'debts');
-- TEMPORARY FIX: Allow all operations on receipt tables for testing
DROP POLICY IF EXISTS "receipts_select" ON receipts;
DROP POLICY IF EXISTS "receipts_insert" ON receipts;
DROP POLICY IF EXISTS "receipts_update" ON receipts;
DROP POLICY IF EXISTS "receipts_delete" ON receipts;

DROP POLICY IF EXISTS "receipt_items_select" ON receipt_items;
DROP POLICY IF EXISTS "receipt_items_insert" ON receipt_items;
DROP POLICY IF EXISTS "receipt_items_update" ON receipt_items;
DROP POLICY IF EXISTS "receipt_items_delete" ON receipt_items;

DROP POLICY IF EXISTS "debts_select" ON debts;
DROP POLICY IF EXISTS "debts_insert" ON debts;
DROP POLICY IF EXISTS "debts_update" ON debts;
DROP POLICY IF EXISTS "debts_delete" ON debts;

-- Allow all operations temporarily
CREATE POLICY "receipts_allow_all" ON receipts FOR ALL USING (true);
CREATE POLICY "receipt_items_allow_all" ON receipt_items FOR ALL USING (true);
CREATE POLICY "debts_allow_all" ON debts FOR ALL USING (true);
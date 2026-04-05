-- ============================================
-- RLS POLICIES FOR ALL TABLES
-- ============================================

-- DROP EXISTING POLICIES
DROP POLICY IF EXISTS "admins_select" ON admins;

DROP POLICY IF EXISTS "items_select" ON items;
DROP POLICY IF EXISTS "items_insert" ON items;
DROP POLICY IF EXISTS "items_update" ON items;
DROP POLICY IF EXISTS "items_delete" ON items;

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

-- Enable RLS
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE receipt_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE debts ENABLE ROW LEVEL SECURITY;

-- ADMINS: Can read own record
CREATE POLICY "admins_select" ON admins FOR SELECT USING (auth.uid()::text = id::text);

-- ITEMS: Authenticated users can do all operations
CREATE POLICY "items_select" ON items FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "items_insert" ON items FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "items_update" ON items FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "items_delete" ON items FOR DELETE USING (auth.uid() IS NOT NULL);

-- RECEIPTS: Authenticated users can do all operations
CREATE POLICY "receipts_select" ON receipts FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "receipts_insert" ON receipts FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "receipts_update" ON receipts FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "receipts_delete" ON receipts FOR DELETE USING (auth.uid() IS NOT NULL);

-- RECEIPT_ITEMS: Authenticated users can do all operations
CREATE POLICY "receipt_items_select" ON receipt_items FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "receipt_items_insert" ON receipt_items FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "receipt_items_update" ON receipt_items FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "receipt_items_delete" ON receipt_items FOR DELETE USING (auth.uid() IS NOT NULL);

-- DEBTS: Authenticated users can do all operations
CREATE POLICY "debts_select" ON debts FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "debts_insert" ON debts FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "debts_update" ON debts FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "debts_delete" ON debts FOR DELETE USING (auth.uid() IS NOT NULL);

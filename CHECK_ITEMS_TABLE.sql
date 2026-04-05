-- Check items table structure
SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = 'items' ORDER BY ordinal_position;

-- Check if items table has data
SELECT COUNT(*) as item_count FROM items;

-- Test insert with explicit columns
INSERT INTO items (name, price) VALUES ('Debug Item', 5.99);
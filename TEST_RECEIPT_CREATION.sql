-- Test receipt creation manually
-- First, check if we have any items
SELECT id, name, price FROM items LIMIT 5;

-- If no items exist, create a test item
INSERT INTO items (name, price) VALUES ('Test Item', 10.00) ON CONFLICT DO NOTHING;

-- Get the item ID
SELECT id FROM items WHERE name = 'Test Item' LIMIT 1;

-- Now test receipt creation (replace 'item-id-here' with actual item ID)
-- INSERT INTO receipts (customer_name, total_amount, paid_amount, payment_mode)
-- VALUES ('Test Customer', 10.00, 10.00, 'cash');

-- INSERT INTO receipt_items (receipt_id, item_id, quantity, price)
-- VALUES ('receipt-id-here', 'item-id-here', 1, 10.00);
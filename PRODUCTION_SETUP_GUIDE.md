# Complete Supabase RLS & Authentication Setup Guide

## Your Admin Credentials
- **Email**: bhavishkumar1008@gmail.com
- **Password**: Bkg2003@$
- **User ID**: b7d6aa95-139e-4d41-bb69-5964a3b69152

---

## Step-by-Step Setup Instructions

### ✅ Step 1: Create Auth User in Supabase Dashboard

1. Open your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Authentication** → **Users** (left sidebar)
4. Click **Add User** button
5. Select **Create new user**
6. Fill in:
   - **Email**: `bhavishkumar1008@gmail.com`
   - **Password**: `Bkg2003@$`
   - ✓ **Auto Confirm User** (check this box)
7. Click **Create User**
8. Copy the **User ID** that appears (should be: `b7d6aa95-139e-4d41-bb69-5964a3b69152`)

---

### ✅ Step 2: Insert Admin User into Database

1. In Supabase Dashboard, go to **SQL Editor** (left sidebar)
2. Click **New Query**
3. Copy and paste this query:

```sql
INSERT INTO admins (id, username, password, created_at)
VALUES (
  'b7d6aa95-139e-4d41-bb69-5964a3b69152'::uuid,
  'bhavishkumar1008@gmail.com',
  'Bkg2003@$',
  NOW()
);
```

4. Click **Run** (or press Ctrl+Enter)
5. You should see: **Executed successfully with 1 row affected**

**Verify it worked**:
```sql
SELECT id, username, created_at FROM admins;
```

---

### ✅ Step 3: Enable RLS & Apply Security Policies

1. In **SQL Editor**, create a **New Query**
2. Copy and paste the **entire contents** from `SQL_RLS_POLICIES.sql` file
3. Click **Run** to execute all policies

**This will**:
- Enable RLS on all 5 tables (admins, items, receipts, receipt_items, debts)
- Create security policies so only authenticated admins can access data
- Prevent unauthorized access to your database

**Verify RLS is enabled**:
```sql
SELECT tablename, rowsecurity FROM pg_tables 
WHERE tablename IN ('admins', 'items', 'receipts', 'receipt_items', 'debts') 
AND schemaname = 'public';
```

All should show `rowsecurity = true`

---

### ✅ Step 4: Test the App

1. **Open browser** at: http://localhost:5173
2. **Login with**:
   - Email: `bhavishkumar1008@gmail.com`
   - Password: `Bkg2003@$`
3. **Test workflow**:
   - Go to **Items** → Add a new grocery item
   - Go to **Billing** → Create a receipt with that item
   - Go to **Receipts** → View and download PDF
   - Check Supabase dashboard to verify data was saved

---

## What the RLS Policies Do

| Table | Policy | Who Can Access |
|-------|--------|----------------|
| **admins** | View own record | Only yourself |
| **items** | Full CRUD | All authenticated admins |
| **receipts** | Full CRUD | All authenticated admins |
| **receipt_items** | Full CRUD | All authenticated admins |
| **debts** | Full CRUD | All authenticated admins |

**CRUD** = Create, Read, Update, Delete

---

## Troubleshooting

### ❌ "Invalid email or password" on login
- Make sure you completed **Step 2** (inserted admin user into database)
- Make sure email and password exactly match: `bhavishkumar1008@gmail.com` / `Bkg2003@$`

### ❌ "You do not have permission to..." error
- Make sure you completed **Step 3** (applied RLS policies)
- Refresh the page and try again

### ❌ Blank page or app won't load
- Check browser console (F12) for errors
- Make sure dev server is running: `npm run dev`
- Check `.env.local` has correct Supabase credentials

---

## Files Generated

1. **SQL_RLS_POLICIES.sql** - Complete RLS security policies
2. **SETUP_ADMIN_USER.sql** - Admin user creation queries
3. **PRODUCTION_SETUP_GUIDE.md** - This file

---

## Next Steps After Setup

1. ✅ Create more admin users (repeat Steps 1-2 for each user)
2. ✅ Deploy to Vercel
3. ✅ Set up automated backups
4. ✅ Monitor usage in Supabase dashboard

---

## Database Schema Reference

### admins table
```
id (UUID) - Primary key, links to Supabase Auth
username (TEXT) - Email address or username
password (TEXT) - Password (in production, use Supabase Auth)
created_at (TIMESTAMP) - Creation date
```

### items table
```
id (UUID) - Primary key
name (TEXT) - Item name
price (DECIMAL) - Item price
quantity_in_stock (INT) - Inventory count
created_at (TIMESTAMP)
```

### receipts table
```
id (UUID) - Primary key
customer_name (TEXT) - Customer name
total_amount (DECIMAL) - Receipt total
paid_amount (DECIMAL) - Amount paid by customer
payment_mode (TEXT) - 'cash', 'upi', or 'card'
created_at (TIMESTAMP)
```

### receipt_items table
```
id (UUID) - Primary key
receipt_id (UUID) - Foreign key to receipts
item_id (UUID) - Foreign key to items
quantity (INT) - Quantity purchased
price (DECIMAL) - Price at time of purchase
```

### debts table
```
id (UUID) - Primary key
receipt_id (UUID) - Foreign key to receipts
customer_name (TEXT) - Customer name
amount_due (DECIMAL) - Total amount owed
amount_paid (DECIMAL) - Amount already paid
status (TEXT) - 'pending' or 'cleared'
created_at (TIMESTAMP)
```

---

**Need help?** Check the browser console (F12) or Supabase logs for error details.

## DEPLOYMENT GUIDE

### Frontend Deployment to Vercel

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Login to Vercel
```bash
vercel login
```
This will open a browser window to authenticate with your Vercel account. If you don't have one, create it at https://vercel.com

### Step 3: Deploy to Vercel
```bash
cd d:\Billing_management
vercel
```

### Step 4: Follow the prompts
When you run `vercel`, you'll see prompts:
- **"Set up and deploy?" → Yes** (or just press Enter)
- **"Which scope?" → Select your personal account**
- **"Link to existing project?" → No** (first time)
- **"What's your project's name?" → billing-management** (or your choice)
- **"In which directory is your code?" → ./** (current directory)
- **"Want to modify these settings?" → No** (defaults are fine)

### Step 5: Add Environment Variables
After deployment, configure environment variables:

```bash
vercel env add VITE_SUPABASE_URL
# Paste: https://sfbxezveoibdpkxoeyaw.supabase.co

vercel env add VITE_SUPABASE_ANON_KEY
# Paste: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Step 6: Redeploy with Environment Variables
```bash
vercel --prod
```

---

## BACKEND - Already Deployed! ✅

Your Supabase backend is already live and deployed because:

✅ **Database** - PostgreSQL hosted on Supabase servers
✅ **Authentication** - Supabase Auth system is active
✅ **RLS Policies** - Security policies are configured
✅ **Admin User** - Created and configured
✅ **Tables** - All 5 tables created and populated

**No additional backend deployment needed!**

---

## After Deployment

### 1. Get Your Vercel URL
After deployment completes, Vercel shows your URL:
```
✓ Production: https://billing-management-xxx.vercel.app
```

### 2. Test the Production App
Visit: `https://billing-management-xxx.vercel.app`

Login with:
- Email: bhavishkumar1008@gmail.com
- Password: Bkg2003@$

### 3. Verify Everything Works
- ✅ Login page loads
- ✅ Can create items
- ✅ Can create receipts
- ✅ Can download PDFs
- ✅ Can view reports

---

## Quick Commands Summary

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Initial deployment
cd d:\Billing_management
vercel

# Add environment variables
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY

# Production deployment
vercel --prod

# View deployment logs
vercel logs

# List all deployments
vercel list
```

---

## Troubleshooting

### If deployment fails:
1. Make sure you're in the `d:\Billing_management` directory
2. Check that `.env.local` exists with Supabase credentials
3. Run `npm run build` locally first to verify no build errors
4. Check Vercel dashboard for detailed error logs

### If app doesn't work after deployment:
1. Check that environment variables are set correctly in Vercel dashboard
2. Verify Supabase RLS policies allow the deployed app
3. Check browser console (F12) for errors

---

## Dashboard Links

- Vercel Dashboard: https://vercel.com/dashboard
- Supabase Dashboard: https://app.supabase.com
- Your App: https://billing-management-xxx.vercel.app (after deployment)

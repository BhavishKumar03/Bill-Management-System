:: VERCEL DEPLOYMENT - QUICK COMMANDS

:: Step 1: Install Vercel CLI (run once)
npm install -g vercel

:: Step 2: Navigate to project
cd d:\Billing_management

:: Step 3: Login to Vercel
vercel login

:: Step 4: Deploy to production
vercel --prod

:: Step 5: Add environment variables (one by one)
vercel env add VITE_SUPABASE_URL
:: When prompted, paste: https://sfbxezveoibdpkxoeyaw.supabase.co

vercel env add VITE_SUPABASE_ANON_KEY
:: When prompted, paste your Anon Key from .env.local

:: Step 6: Redeploy with environment variables
vercel --prod

:: After deployment, test at your Vercel URL
:: Your app will be at: https://billing-management-xxx.vercel.app

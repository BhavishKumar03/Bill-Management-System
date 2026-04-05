# VERCEL DEPLOYMENT - QUICK COMMANDS (PowerShell)

# Step 1: Install Vercel CLI (run once)
npm install -g vercel

# Step 2: Navigate to project
cd d:\Billing_management

# Step 3: Login to Vercel (opens browser)
vercel login

# Step 4: Deploy to production (first deployment)
vercel --prod

# If first deployment prompts:
# - Link to existing project? Choose "No"
# - Project name? Enter: billing-management
# - Directory with code? Enter: ./

# Step 5: Add environment variables
vercel env add VITE_SUPABASE_URL
# When prompted, paste: https://sfbxezveoibdpkxoeyaw.supabase.co
# Select "Production"

vercel env add VITE_SUPABASE_ANON_KEY
# When prompted, paste your Anon Key from .env.local
# Select "Production"

# Step 6: Redeploy with environment variables
vercel --prod

# Step 7: View deployment URL
# After completion, you'll see: ✓ Production: https://billing-management-xxx.vercel.app
# Copy this URL and test it!

# Optional: View logs
vercel logs

# Optional: List all deployments
vercel list

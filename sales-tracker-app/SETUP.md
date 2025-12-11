# Sales Tracker - Setup Guide

## Overview
This is a complete sales KPI tracking app for P&C insurance producers. Features:
- Daily activity tracking (calls, quotes, pivots, appointments, referrals)
- Policy tracking by line (Auto, Home, Life, Health)
- Automatic closing ratio calculations
- Weekly and monthly progress views
- Team view for agency owners
- Invite system for adding producers

---

## Step 1: Set Up Supabase (5 minutes)

### 1.1 Get Your API Keys
1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Select your project (or create one if you haven't)
3. Click **Settings** (gear icon) in the left sidebar
4. Click **API** 
5. Copy these two values:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **anon public** key (under "Project API keys")

### 1.2 Create Database Tables
1. In Supabase, click **SQL Editor** in the left sidebar
2. Click **New query**
3. Copy the entire contents of `supabase-schema.sql` and paste it
4. Click **Run** (or press Cmd/Ctrl + Enter)
5. You should see "Success. No rows returned" - that's correct!

### 1.3 Enable Email Auth
1. Go to **Authentication** > **Providers**
2. Make sure **Email** is enabled
3. (Optional) Disable "Confirm email" for faster testing:
   - Go to **Authentication** > **Settings**
   - Turn off "Enable email confirmations"

---

## Step 2: Deploy to Vercel (5 minutes)

### 2.1 Create Vercel Account
1. Go to https://vercel.com
2. Sign up with GitHub (easiest)

### 2.2 Deploy the App

**Option A: Deploy from GitHub (Recommended)**
1. Push this folder to a GitHub repository
2. In Vercel, click **New Project**
3. Import your GitHub repo
4. Before deploying, add Environment Variables:
   - `VITE_SUPABASE_URL` = your Supabase Project URL
   - `VITE_SUPABASE_ANON_KEY` = your Supabase anon key
5. Click **Deploy**

**Option B: Deploy via CLI**
```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to project folder
cd sales-tracker-app

# Deploy
vercel

# Follow prompts, then add environment variables in Vercel dashboard
```

### 2.3 Add Environment Variables (if not done during deploy)
1. In Vercel, go to your project
2. Click **Settings** > **Environment Variables**
3. Add:
   - `VITE_SUPABASE_URL` = your Supabase Project URL
   - `VITE_SUPABASE_ANON_KEY` = your Supabase anon key
4. Redeploy for changes to take effect

---

## Step 3: Test the App

### 3.1 Create Agency Owner Account
1. Go to your deployed app URL
2. Click **Sign Up**
3. Select **Agency Owner**
4. Fill in:
   - Your Name
   - Agency Name
   - Email
   - Password
5. Click **Create Account**

### 3.2 Get Your Invite Code
1. After logging in, you'll see the tracker
2. If you're an owner, you can switch to **Team View**
3. Click **+ Invite Producer**
4. Copy your unique invite code (e.g., `ABC123`)

### 3.3 Add a Producer
1. Share the invite code with your producer
2. They go to the app URL
3. Click **Sign Up**
4. Select **Producer**
5. Enter the invite code + their details
6. They're now part of your agency!

---

## Step 4: Custom Domain (Optional)

### 4.1 Add Domain in Vercel
1. In Vercel project settings, go to **Domains**
2. Add your domain (e.g., `tracker.youragency.com`)
3. Follow DNS instructions

### 4.2 Update Supabase (Important!)
1. Go to Supabase **Authentication** > **URL Configuration**
2. Add your custom domain to **Site URL**
3. Add to **Redirect URLs**: `https://yourdomain.com/*`

---

## How It Works

### For Producers
1. Log in each day
2. Enter their numbers as they work
3. Data saves automatically
4. View weekly/monthly progress anytime

### For Agency Owners
1. Log in like normal
2. Toggle to **Team View** to see everyone's numbers
3. See who's hitting their 3-30
4. Leaderboard shows top performers

### The 3-30 System
The app tracks the "Triple 3-30":
- 30 outbound calls
- 3 households quoted  
- 3 pivots (life/health conversations)

When all three are hit, the indicator turns green.

---

## Troubleshooting

### "Invalid invite code"
- Make sure the producer is typing it correctly (it's case-insensitive)
- Check that the owner account was created successfully

### Data not saving
- Check browser console for errors
- Verify Supabase credentials are correct
- Make sure RLS policies were created (run the SQL again)

### Can't log in
- If using email confirmation, check spam folder
- Try disabling email confirmation in Supabase for testing

---

## Future Enhancements

Ready to add when you need them:
- [ ] Daily email reports to agency owners
- [ ] Push notifications for 3-30 reminders
- [ ] GHL sync for contacts/automations
- [ ] Premium goal tracking
- [ ] Historical analytics/trends
- [ ] Export to CSV/Excel

---

## Support

Questions? The code is well-commented and organized:
- `App.jsx` - All components in one file for simplicity
- `supabase-schema.sql` - Database structure
- Row Level Security ensures producers only see their own data
- Agency owners can see their entire team


# 🚀 Setting Up a New Google Places API Key

## Step-by-Step Guide

### Step 1: Go to Google Cloud Console
1. Visit: **https://console.cloud.google.com/**
2. Sign in with your Google account

### Step 2: Create or Select a Project
1. Click the **project dropdown** at the top (next to "Google Cloud")
2. If you have an existing project, select it
3. **OR** click **"New Project"**:
   - Project name: `Sales Tracker` (or any name you like)
   - Click **"Create"**
   - Wait a few seconds for it to be created
   - Select the new project from the dropdown

### Step 3: Enable the Places API
1. In the left sidebar, click **"APIs & Services"** → **"Library"**
2. In the search bar, type: **"Places API (New)"**
3. Click on **"Places API (New)"** (make sure it says "New" - this is the updated version)
4. Click the blue **"Enable"** button
5. Wait for it to enable (takes a few seconds)

### Step 4: Create an API Key
1. Go to **"APIs & Services"** → **"Credentials"** (in the left sidebar)
2. Click the **"+ CREATE CREDENTIALS"** button at the top
3. Select **"API key"**
4. A popup will show your new API key - **COPY IT NOW!** (It looks like: `AIzaSyC...`)
5. Click **"Close"** (don't restrict it yet - we'll do that later if needed)

### Step 5: (Optional but Recommended) Restrict the API Key
This helps keep your key secure:

1. Click on the API key you just created (in the Credentials list)
2. Under **"API restrictions"**, select **"Restrict key"**
3. Under **"Select APIs"**, check **"Places API (New)"**
4. Click **"Save"**

### Step 6: Set Up Billing (Required for API to Work)
Even though you get $200/month free, you need a billing account:

1. Go to **"Billing"** in the left sidebar
2. Click **"Link a billing account"**
3. Click **"Create billing account"**
4. Fill in:
   - Account name: `Sales Tracker` (or any name)
   - Country: Your country
   - Click **"Continue"**
5. Add a payment method (credit/debit card)
6. Click **"Submit and enable billing"**

**Don't worry!** You won't be charged unless you exceed $200/month in API usage.

### Step 7: (Optional) Set Up Budget Alerts
To get notified if you're using a lot of API calls:

1. Go to **"Billing"** → **"Budgets & alerts"**
2. Click **"Create Budget"**
3. Select **"Billing account"** → **"Next"**
4. Set amount: **$200**
5. Click **"Next"** → **"Next"** (skip filters)
6. Set alerts at: **50%**, **90%**, and **100%**
7. Add your email
8. Click **"Create budget"**

---

## ✅ You're Done!

You now have:
- ✅ A Google Cloud project
- ✅ Places API (New) enabled
- ✅ An API key
- ✅ Billing set up (for the free $200/month credit)

---

## 📝 Next: Add the Key to Your Project

Once you have your API key, I'll help you add it to `server/.env` and push it to GitHub!

**Your API key should look like:** `AIzaSyC1234567890abcdefghijklmnopqrstuvwxyz`

---

## 💡 Quick Tips

- **The API key is free** to use within $200/month
- **Each search costs ~$0.017** (1.7 cents)
- **$200 = ~11,700 searches per month**
- **You only pay if you exceed $200/month**

---

## 🆘 Troubleshooting

**"API not enabled" error:**
- Make sure you enabled **"Places API (New)"** (not the old "Places API")

**"Billing required" error:**
- You need to set up billing (Step 6 above)
- Don't worry - you won't be charged unless you exceed $200/month

**Can't find "Places API (New)":**
- Search for just "Places API" and look for the one that says "(New)" in the name
- Or try: "Places API New"

---

**Ready?** Follow the steps above and let me know when you have your API key! 🎉


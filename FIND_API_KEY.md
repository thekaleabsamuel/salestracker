# 🔑 How to Find Your Google Places API Key

## Step-by-Step Guide

### 1. Go to Google Cloud Console
Visit: https://console.cloud.google.com/

### 2. Select Your Project
- Click the project dropdown at the top (next to "Google Cloud")
- Select the project you used for this application
- If you don't see a project, you may need to create one

### 3. Navigate to Credentials
- In the left sidebar, click **"APIs & Services"**
- Then click **"Credentials"**

### 4. Find Your API Key
- Look in the **"API Keys"** section
- You should see a list of API keys
- Click on the key you want to use (or create a new one if needed)
- The key will look like: `AIzaSyC...` (long string)

### 5. Copy the Key
- Click on the API key to view it
- Click **"Show key"** if it's hidden
- Copy the entire key

---

## 💰 About Google Places API Pricing

### Good News:
- **$200/month free credit** - Google gives you $200 in free credits every month
- This covers **thousands of API requests** for most small applications
- You only pay if you exceed the $200 credit

### Important Notes:
1. **Billing Account Required**: Even to use the free credits, you need a billing account set up (but you won't be charged unless you exceed $200/month)

2. **Typical Usage**: 
   - Each search request costs about $0.017 (1.7 cents)
   - $200 credit = ~11,700 searches per month
   - For a small team, this is usually plenty

3. **If Your Free Trial Ended**:
   - You can still use the API with the $200/month credit
   - You just need to have a billing account attached
   - You won't be charged unless you go over $200/month

### Setting Up Billing (If Needed):
1. Go to **Billing** in Google Cloud Console
2. Click **"Link a billing account"**
3. Add a payment method (credit card)
4. **Set up budget alerts** to get notified if you approach the $200 limit

---

## 🚨 Budget Alerts (Recommended)

To avoid surprises, set up budget alerts:

1. Go to **Billing** > **Budgets & alerts**
2. Click **"Create Budget"**
3. Set budget to **$200**
4. Add email alerts at 50%, 90%, and 100%

This way you'll know if you're using a lot of API calls.

---

## ✅ Once You Have the Key

1. Open `server/.env` in this project
2. Replace `YOUR_API_KEY_HERE` with your actual key
3. Save the file
4. Commit and push to GitHub

---

## 🔍 Can't Find Your Key?

If you can't find an existing key:

1. In **Credentials** page, click **"+ CREATE CREDENTIALS"**
2. Select **"API key"**
3. Copy the new key
4. (Optional) Click "Restrict key" to limit it to Places API only

---

**Need help?** The API key is free to use within the $200/month credit limit!


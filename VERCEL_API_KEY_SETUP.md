# 🔧 Vercel Environment Variables Setup Guide

## Problem
The API key is not available in Vercel deployment because `.env.local` is not committed to GitHub.

## ✅ Solution

### Step 1: Verify Your API Key Works Locally
```bash
# Your .env.local should have:
REACT_APP_NEWS_API=5ce0035518c14397bfbb8fcde18da02f

# Test locally:
npm start
# Check if news loads correctly
```

### Step 2: Set Up Environment Variable in Vercel Dashboard

1. **Go to Your Vercel Project**
   - Visit: https://vercel.com/dashboard
   - Select your "Daily-News-App" project

2. **Navigate to Settings**
   - Click "Settings" in the top navigation
   - Select "Environment Variables" from the left sidebar

3. **Add the Environment Variable**
   ```
   Name:  REACT_APP_NEWS_API
   Value: 5ce0035518c14397bfbb8fcde18da02f
   ```

4. **Select Environments** (Check all three)
   - ✅ Production
   - ✅ Preview
   - ✅ Development

5. **Click "Save"**

### Step 3: Redeploy Your Application

**Option A: Automatic Redeploy**
```bash
cd your-project
git add .
git commit -m "fix: add debugging for API key"
git push origin main
# Vercel will automatically rebuild
```

**Option B: Manual Redeploy**
1. Go to Vercel Dashboard → Your Project
2. Click "Deployments" tab
3. Find the latest deployment
4. Click "Redeploy"

### Step 4: Verify the Fix

After deployment:
1. Open your app in browser
2. Open Developer Console (F12)
3. Look for logs:
   - ✅ `✅ API Key is configured` = Success
   - ❌ `⚠️ REACT_APP_NEWS_API is not set` = Still has issues

---

## 🐛 Debugging Checklist

### ✅ If Still Not Working:

1. **Verify Variable Name** (Must be exact)
   ```
   ❌ WRONG: NEWS_API_KEY
   ❌ WRONG: API_KEY
   ✅ CORRECT: REACT_APP_NEWS_API
   ```

2. **Check Variable Value**
   - Make sure it's your actual NewsAPI key from https://newsapi.org
   - Not empty or placeholder text

3. **Verify Environments Selected**
   - All three must be checked (Production, Preview, Development)

4. **Hard Refresh Browser** (Ctrl + Shift + R or Cmd + Shift + R)
   - Clear browser cache
   - Reload the deployed app

5. **Check Build Logs**
   - Vercel Dashboard → Deployments → Latest → View Logs
   - Look for any environment-related errors

### 🔍 What the Code Now Does:

1. **App.js** - Logs if API key is configured
2. **News.js** - Checks if API key is valid before making requests
3. **Error Messages** - Shows clear message if API key is missing

---

## 🚀 Final Verification Steps

After you push the latest code and redeploy:

1. ✅ Open Vercel deployment URL
2. ✅ Check browser console for "✅ API Key is configured"
3. ✅ Verify news articles load on the page
4. ✅ Try different categories
5. ✅ Test bookmarking functionality

---

## ⚠️ Security Best Practices

- ✅ **Never commit `.env.local` to GitHub**
- ✅ **Use Vercel dashboard for production secrets**
- ✅ **Rotate API keys periodically**
- ✅ **Consider creating a backend proxy for sensitive operations**

---

## 📞 Still Having Issues?

If news still doesn't load after these steps:

1. **Check Vercel logs:**
   ```
   Vercel Dashboard → Deployments → Select latest → View Logs
   ```

2. **Verify API Key is correct:**
   ```
   newsapi.org → Login → Copy API key again
   ```

3. **Test API manually:**
   ```
   https://newsapi.org/v2/top-headlines?category=general&apiKey=YOUR_KEY_HERE
   ```
   - Should return JSON data
   - If 401 error = Invalid key
   - If 429 error = Rate limit exceeded

4. **Check Rate Limits:**
   - Free tier: 100 requests/day
   - If exceeded, wait until next day

---

**Last Updated: 2026-02-22**

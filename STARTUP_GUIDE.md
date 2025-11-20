# 🚀 Business Search Dashboard - Startup Guide

## 🎯 **What You Now Have**

A **fully functional Business Search Dashboard** that finds real companies in Colorado for e-waste recycling outreach!

### **Real Data Examples Found:**
- **Exigent Technologies** - Denver Managed IT Services (5★ rating)
- **AppIt Ventures** - Software development (4.7★ rating)  
- **eCreek IT Solutions** - IT consulting (4.9★ rating)
- **CloudBig Technology** - Corporate tech office (4.5★ rating)
- **And 16 more IT companies!**

## 🚀 **How to Start Everything**

### **Option 1: Use the Startup Script (Recommended)**
```bash
# Make sure you're in the project root
cd /Users/new/Downloads/Projects/salestracker

# Run the startup script
./start.sh
```

This will:
- ✅ Start the backend server on port 3001
- ✅ Start the frontend server on port 5173
- ✅ Handle both servers automatically

### **Option 2: Manual Startup**

#### **Step 1: Start Backend Server**
```bash
cd server
npm start
```
**Keep this terminal open!** Backend runs on port 3001

#### **Step 2: Start Frontend Server (New Terminal)**
```bash
# Open a new terminal window
cd /Users/new/Downloads/Projects/salestracker
npm run dev
```
Frontend runs on port 5173

## 🌐 **Access Your Dashboard**

- **Frontend**: http://localhost:5173
- **Backend Health**: http://localhost:3001/health
- **Backend Test**: http://localhost:3001/api/test-places-api

## 🔍 **Test Your E-Waste Recycling Tool**

### **Perfect Search Examples:**
1. **"IT companies"** + **"Denver, CO"** + **25 miles**
2. **"Software companies"** + **"Colorado"** + **50 miles**
3. **"Tech offices"** + **"Boulder, CO"** + **25 miles**

### **What You'll Get:**
- ✅ **Real business listings** from Google Places
- ✅ **Contact information** (phone, website, address)
- ✅ **Ratings and reviews** for quality assessment
- ✅ **Export to CSV/Excel** for your outreach campaigns

## 🎯 **Perfect for Business Development**

This tool will help you:
- **Identify prospects** for e-waste recycling services
- **Build contact lists** with verified business information
- **Prioritize outreach** based on company size and ratings
- **Track your leads** with exportable data

## 🔧 **If Something Goes Wrong**

### **Backend Issues:**
```bash
# Check if backend is running
curl http://localhost:3001/health

# Restart backend
cd server
npm start
```

### **Frontend Issues:**
```bash
# Restart frontend
npm run dev
```

### **API Issues:**
- Check that Google Places API (New) is enabled in Google Cloud Console
- Verify your API key is in `server/.env`

## 🎉 **You're All Set!**

Your Business Search Dashboard is now a **powerful business development tool** that will help you find and contact companies that need e-waste recycling services in Colorado!

**Happy prospecting! 🚀✨**




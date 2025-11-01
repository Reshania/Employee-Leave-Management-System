# 🚀 Quick Admin Dashboard Access Guide

## ✅ **Server Status**
- ✅ Backend server is running on port 3000
- ✅ Admin dashboard files are available

## 🎯 **3 Easy Ways to Access Admin Dashboard**

### **Method 1: Direct Access (Recommended)**
1. **Open your browser**
2. **Go to**: `Frontend/html/admin-dashboard-direct.html`
3. **Login with**:
   - **Username**: `admin.user`
   - **Password**: `password123`
4. **Click "Quick Login"**

### **Method 2: Regular Login Flow**
1. **Open**: `Frontend/html/login.html`
2. **Enter credentials**:
   - **Username**: `admin.user`
   - **Password**: `password123`
3. **Click "Login"**
4. **You'll be redirected to admin dashboard automatically**

### **Method 3: Through Employee Dashboard**
1. **Open**: `Frontend/html/dashboard.html?username=admin.user`
2. **Look for "Admin Dashboard" link** in the sidebar
3. **Click on it**

## 🔑 **Admin Credentials**
- **Username**: `admin.user`
- **Password**: `password123`
- **Role**: Admin (can approve/reject leaves)

## 🎯 **What You Can Do in Admin Dashboard**
- ✅ View all leave applications
- ✅ Approve pending leave requests
- ✅ Reject leave requests
- ✅ Add remarks to decisions
- ✅ View statistics and reports

## 🔍 **If You Still Can't Access**

### **Check Browser Console (F12)**
Look for any JavaScript errors

### **Verify Server is Running**
- Open: `http://localhost:3000/api/leave/Reshania`
- You should see JSON data

### **Try Different Browser**
Sometimes browser cache can cause issues

### **Clear Browser Cache**
- Press Ctrl+Shift+Delete
- Clear cache and cookies

## 📞 **Quick Test**
1. **Open**: `Frontend/html/dashboard-test.html`
2. **Click "Test API"** button
3. **Should show**: ✅ API Working!

## 🎉 **Success!**
Once you can access the admin dashboard, you can:
- Approve/reject leave applications
- See real-time updates in employee dashboards
- Manage the entire leave system

**Need help?** Check the browser console (F12) for any error messages!

# 🧪 Testing Guide - Dashboard Auto-Update

## Quick Test Steps

### 1. **Start the Backend Server**
```bash
cd "miniproject2\ELMS mini project resh 1\backend"
node index.js
```
The server should start on port 3000.

### 2. **Test the API Directly**
Open: `http://localhost:3000/api/leave/Reshania`

You should see:
```json
{
  "username": "Reshania",
  "totalLeaves": 30,
  "usedLeaves": 8,
  "remainingLeaves": 22,
  "pendingRequests": 1,
  "leaveStatus": "Active"
}
```

### 3. **Test the Dashboard**
1. Open: `Frontend/html/dashboard.html?username=Reshania`
2. You should see:
   - Total Leaves: 30
   - Used Leaves: 8
   - Remaining Leaves: 22
   - Pending Requests: 1

### 4. **Test Auto-Update**
1. Open: `Frontend/html/admin-dashboard-direct.html`
2. Login with: `admin.user` / `password123`
3. Approve or reject a leave application
4. Return to the dashboard
5. The dashboard should automatically refresh and show updated values

### 5. **Test Manual Refresh**
1. On the dashboard, click the "🔄 Refresh" button
2. You should see a notification and the data should update

## 🔍 Troubleshooting

### Dashboard Not Showing Updated Data
1. **Check Browser Console** (F12) for JavaScript errors
2. **Verify Server is Running** on port 3000
3. **Check Network Tab** to see if API calls are successful
4. **Clear Browser Cache** and localStorage

### API Not Working
1. **Check Server Logs** in the terminal
2. **Verify Port 3000** is not blocked
3. **Test with curl**:
   ```bash
   curl http://localhost:3000/api/leave/Reshania
   ```

### Auto-Update Not Working
1. **Check localStorage** in browser dev tools
2. **Verify admin actions** are setting the flag
3. **Check timing** - flag expires after 30 seconds

## 📊 Expected Results

### For Reshania User:
- **Total Leaves**: 30 (constant)
- **Used Leaves**: 8 (from approved applications)
- **Remaining Leaves**: 22 (30 - 8)
- **Pending Requests**: 1 (applications with "Pending" status)

### When Admin Approves/Rejects:
- **Used Leaves** should increase/decrease accordingly
- **Remaining Leaves** should update automatically
- **Pending Requests** should decrease when approved/rejected

## 🎯 Test Scenarios

### Scenario 1: Approve a Pending Leave
1. Find a pending leave application
2. Admin approves it
3. Dashboard should show increased used leaves
4. Dashboard should show decreased remaining leaves

### Scenario 2: Reject a Pending Leave
1. Find a pending leave application
2. Admin rejects it
3. Dashboard should show decreased pending requests
4. Used/remaining leaves should remain the same

### Scenario 3: Change Approved to Rejected
1. Find an approved leave application
2. Admin changes status to rejected
3. Dashboard should show decreased used leaves
4. Dashboard should show increased remaining leaves

## ✅ Success Indicators

- ✅ Dashboard shows correct leave balance
- ✅ Auto-refresh works when returning from admin actions
- ✅ Manual refresh button works
- ✅ Notifications appear for updates
- ✅ Data stays synchronized between admin and user views

## 🚨 Common Issues

### Issue: Dashboard shows old data
**Solution**: Check if the API is returning updated data, then check if the frontend is using the correct values.

### Issue: Auto-refresh not working
**Solution**: Check if localStorage flag is being set by admin actions and if the dashboard is checking for it.

### Issue: Manual refresh not working
**Solution**: Check if the refresh button is calling the correct function and if there are JavaScript errors.

## 📝 Test Results Template

```
Test Date: ___________
Tester: ___________

✅ Backend API Working: Yes/No
✅ Dashboard Loading: Yes/No
✅ Leave Balance Correct: Yes/No
✅ Auto-Refresh Working: Yes/No
✅ Manual Refresh Working: Yes/No
✅ Notifications Working: Yes/No

Notes:
_________________________
_________________________
_________________________
```

## 🎉 Success!

If all tests pass, the dashboard auto-update feature is working correctly! Users will now see real-time updates to their leave balance when administrators approve or reject their leave applications.

# Troubleshooting Guide for ELMS Login Issues

## Common Login Problems and Solutions

### 1. **"Cannot connect to backend" Error**

**Problem**: Frontend can't reach the backend server
**Solution**: 
- Make sure the backend server is running
- Check if port 3000 is available
- Run: `cd backend && npm start`

**Check**: Open `http://localhost:3000` in browser

### 2. **"User not found" Error**

**Problem**: Username doesn't exist in the system
**Available Test Users**:
- **Username**: `demo`, **Password**: `password123`
- **Username**: `Reshania`, **Password**: (your actual password)
- **Username**: `Suruthi`, **Password**: (your actual password)

**Solution**: Use one of the test users above

### 3. **"Incorrect password" Error**

**Problem**: Username exists but password is wrong
**Solution**: 
- Use the exact password for the user
- For demo user: `password123`
- Check if caps lock is on

### 4. **"Network error" or CORS Issues**

**Problem**: Browser blocking requests to localhost
**Solution**:
- Make sure backend is running on `http://localhost:3000`
- Check browser console for CORS errors
- Try using the test page: `test-login.html`

### 5. **Server Not Starting**

**Problem**: Backend server won't start
**Solution**:
```bash
cd "ELMS mini project resh 1/backend"
npm install
npm start
```

**Check for errors**:
- Port 3000 already in use
- Missing dependencies
- Node.js version (need v14+)

### 6. **Dashboard "Error Loading Database" Error**

**Problem**: Dashboard shows error loading leave data
**Causes**:
- Missing or corrupted leave data files
- Backend route conflicts
- File system permission issues

**Solutions**:
1. **Check if leave data files exist**:
   ```bash
   cd "ELMS mini project resh 1/backend"
   ls -la *.json
   ```

2. **Verify leave data structure**:
   - `leaveData.json` should contain user leave information
   - `leaveApplications.json` should contain leave applications

3. **Restart backend server**:
   ```bash
   cd "ELMS mini project resh 1/backend"
   npm start
   ```

4. **Check browser console** for specific error messages

5. **Use test page** to verify backend functionality

### 7. **Dashboard Username Not Displaying (Shows "null")**

**Problem**: Dashboard shows "null" instead of username
**Causes**:
- Username parameter not passed in URL
- Navigation links not preserving username
- JavaScript not reading URL parameters correctly

**Solutions**:
1. **Check URL format**: Should be `dashboard.html?username=demo`
2. **Use navigation from dashboard**: Click links in sidebar to preserve username
3. **Check browser console** for JavaScript errors
4. **Verify login redirect**: Login should redirect to `dashboard.html?username=USERNAME`

### 8. **Leave Application Submission Failing**

**Problem**: Cannot submit leave applications
**Causes**:
- Backend leave application endpoint not working
- Form validation errors
- Network connectivity issues
- Missing required fields

**Solutions**:
1. **Use test page**: `test-leave-application.html` to debug
2. **Check browser console** for JavaScript errors
3. **Verify backend is running** and accessible
4. **Check form validation**: Dates must be at least 3 days in advance
5. **Ensure all fields are filled**: Username, email, leave type, dates, reason

## Step-by-Step Debugging

### Step 1: Check Backend Status
1. Open `test-login.html` in your browser
2. Click "Check Backend" button
3. Should show "✅ Backend server is running"

### Step 2: Test with Demo User
1. Username: `demo`
2. Password: `password123`
3. Click "Test Login"

### Step 3: Check Console Logs
1. Open browser Developer Tools (F12)
2. Go to Console tab
3. Look for error messages
4. Check Network tab for failed requests

### Step 4: Check Backend Logs
1. Look at the terminal where backend is running
2. Should see login attempts logged
3. Look for any error messages

### Step 5: Test Backend Endpoints
1. Run the backend test script:
   ```bash
   cd "ELMS mini project resh 1/backend"
   node test-backend.js
   ```
2. This will test all major endpoints

### Step 6: Test Leave Application
1. Open `test-leave-application.html` in your browser
2. Click "Test Leave Application" button
3. Check browser console and backend terminal for errors

## Quick Fix Commands

### Restart Backend Server
```bash
# Stop current server (Ctrl+C)
cd "ELMS mini project resh 1/backend"
npm start
```

### Check if Port is Available
```bash
# Windows
netstat -ano | findstr :3000

# Mac/Linux
lsof -i :3000
```

### Kill Process Using Port 3000
```bash
# Windows (replace XXXX with PID from netstat)
taskkill /PID XXXX /F

# Mac/Linux (replace XXXX with PID from lsof)
kill -9 XXXX
```

### Test Backend Functionality
```bash
cd "ELMS mini project resh 1/backend"
node test-backend.js
```

## Test Users for Development

### Demo User (Recommended for Testing)
- **Username**: `demo`
- **Password**: `password123`
- **Department**: Testing
- **Email**: demo@company.com

### Your Existing Users
- **Username**: `Reshania`
- **Password**: (your actual password)
- **Department**: IT

- **Username**: `Suruthi`
- **Password**: (your actual password)
- **Department**: HR

## Still Having Issues?

1. **Check the test page**: `test-login.html`
2. **Verify backend is running**: `http://localhost:3000`
3. **Check browser console** for JavaScript errors
4. **Check backend terminal** for server errors
5. **Try a different browser** to rule out browser issues
6. **Run backend tests**: `node test-backend.js`
7. **Test leave application**: `test-leave-application.html`

## Common Error Messages

| Error Message | Likely Cause | Solution |
|---------------|--------------|----------|
| "Cannot connect to backend" | Server not running | Start backend with `npm start` |
| "User not found" | Wrong username | Use `demo` username |
| "Incorrect password" | Wrong password | Use `password123` for demo user |
| "CORS error" | Backend not accessible | Check server URL and port |
| "Network error" | Connection issue | Verify backend is running |
| "Error loading database" | Missing data files | Check leaveData.json and leaveApplications.json |
| "Dashboard loading error" | Backend route issue | Restart server and check routes |
| "Username shows null" | URL parameter missing | Check login redirect and navigation |
| "Leave application failed" | Form validation or backend issue | Use test page and check console |

## Need More Help?

If you're still experiencing issues:
1. Check the browser console for specific error messages
2. Look at the backend terminal output
3. Try the test page first
4. Make sure you're using the correct test credentials
5. Run the backend test script to identify specific endpoint issues
6. Use the leave application test page to debug form submission

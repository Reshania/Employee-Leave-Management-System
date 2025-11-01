# Admin Usage Guide - Leave Management System

## Overview
Your Leave Management System now has full admin functionality to accept/reject leave applications. This guide shows you how to use these features.

## Admin Users Created
- **Username**: `admin.user` | **Password**: `password123` | **Role**: Admin
- **Username**: `manager.user` | **Password**: `password123` | **Role**: Manager

## How to Access Admin Features

### 1. Login as Admin/Manager
1. Open `Frontend/html/login.html` in your browser
2. Login with admin credentials:
   - Username: `admin.user`
   - Password: `password123`
3. You'll be automatically redirected to the admin dashboard

### 2. Admin Dashboard Features

#### Pending Applications Tab
- View all leave applications that need approval
- See employee details, leave type, dates, and reason
- Click "Approve" or "Reject" buttons for each application
- Add remarks when approving/rejecting

#### All Applications Tab
- View all leave applications (pending, approved, rejected)
- See approval history and admin remarks
- Monitor overall leave application status

#### Statistics Tab
- View total applications count
- See pending, approved, and rejected counts
- Real-time statistics updates

### 3. How to Approve/Reject Leave Applications

#### Step-by-Step Process:
1. **Login** as admin/manager user
2. **Navigate** to "Pending Applications" tab
3. **Review** the leave application details:
   - Employee name and email
   - Leave type and duration
   - Reason for leave
   - Application date
4. **Click** either "Approve" or "Reject" button
5. **Fill** the action modal:
   - Select action (Approve/Reject)
   - Add optional remarks
6. **Submit** the decision

#### Example Approval Process:
```
Application: #1756772179592
Employee: Reshania
Leave Type: Sick Leave
Duration: Sep 6-8, 2025
Reason: fever

Action: Approve
Remarks: "Approved - Get well soon!"

Result: Status changed to "Approved"
```

## Backend API Endpoints

### Get Pending Applications
```
GET /api/leave/admin/pending?username={admin_username}
```
- Returns all pending leave applications
- Requires admin/manager role

### Get All Applications
```
GET /api/leave/admin/all?username={admin_username}
```
- Returns all leave applications
- Requires admin/manager role

### Update Application Status
```
POST /api/leave/admin/update-status
Body: {
  "username": "admin_username",
  "applicationId": "application_id",
  "status": "Approved|Rejected|Pending",
  "remarks": "Optional remarks"
}
```
- Updates leave application status
- Records admin decision with timestamp

## Testing the System

### 1. Start Backend Server
```bash
cd backend
npm start
```

### 2. Test Admin API
```bash
node simple-test.js
```

### 3. Test Frontend
- Open `Frontend/html/admin-dashboard.html` in browser
- Login with admin credentials
- Test approve/reject functionality

## Current System Status

✅ **Backend API**: Fully functional
✅ **Admin Authentication**: Working
✅ **Role-based Access**: Implemented
✅ **Leave Status Updates**: Working
✅ **Admin Dashboard**: Ready to use
✅ **Database Updates**: Working

## Sample Data Available

The system currently has:
- **5 total leave applications**
- **2 pending applications** (ready for approval)
- **3 approved applications** (with admin remarks)

## Security Features

- **Role Verification**: Only admin/manager users can access admin features
- **Input Validation**: All inputs are validated before processing
- **Audit Trail**: All admin actions are logged with timestamps
- **Session Management**: Secure user authentication

## Troubleshooting

### Common Issues:

1. **"Access Denied" Error**
   - Ensure you're logged in as admin/manager
   - Check user role in users.json

2. **Applications Not Loading**
   - Verify backend server is running on port 3000
   - Check browser console for errors

3. **Status Not Updating**
   - Verify application ID exists
   - Check admin user permissions

### Debug Mode:
- Open browser developer tools (F12)
- Check Console tab for error messages
- Check Network tab for API responses

## Future Enhancements

1. **Email Notifications**: Send emails when leave status changes
2. **Bulk Operations**: Approve/reject multiple applications at once
3. **Advanced Filtering**: Filter applications by date, employee, leave type
4. **Mobile Interface**: Responsive design for mobile devices
5. **Approval Workflow**: Multi-level approval for different leave types

## Support

If you encounter any issues:
1. Check the browser console for error messages
2. Verify backend server is running
3. Check user permissions and roles
4. Review the API endpoints and responses

---

**Your admin system is fully functional and ready to use!** 🎉

# Admin/Manager Features for Leave Management System

## Overview
This document describes the new admin and manager functionality added to the Employee Leave Management System (ELMS). Admins and managers can now review, approve, and reject leave applications submitted by employees.

## User Roles

### Admin User
- **Username**: `admin.user`
- **Password**: (same as other demo users)
- **Role**: `admin`
- **Access**: Full administrative access to all leave applications

### Manager User
- **Username**: `manager.user` or `jane.smith`
- **Password**: (same as other demo users)
- **Role**: `manager`
- **Access**: Manager access to review and manage leave applications

### Regular Employee
- **Username**: `john.doe`
- **Password**: (same as other demo users)
- **Role**: `employee`
- **Access**: Can only view their own leave applications

## New Features

### 1. Admin Dashboard
- **Location**: `Frontend/html/admin-dashboard.html`
- **Purpose**: Centralized interface for admins/managers to manage leave applications
- **Features**:
  - View pending leave applications
  - View all leave applications
  - Approve/reject leave applications
  - Add remarks to decisions
  - View leave statistics

### 2. Backend API Endpoints

#### Get All Leave Applications
```
GET /api/leave/admin/all?username={admin_username}
```
- **Access**: Admin/Manager only
- **Purpose**: Retrieve all leave applications in the system
- **Response**: Array of all leave applications

#### Get Pending Applications
```
GET /api/leave/admin/pending?username={admin_username}
```
- **Access**: Admin/Manager only
- **Purpose**: Retrieve only pending leave applications
- **Response**: Array of pending leave applications

#### Update Leave Application Status
```
POST /api/leave/admin/update-status
```
- **Access**: Admin/Manager only
- **Body**:
  ```json
  {
    "username": "admin_username",
    "applicationId": "application_id",
    "status": "Approved|Rejected|Pending",
    "remarks": "Optional remarks"
  }
  ```
- **Purpose**: Approve, reject, or update leave application status

### 3. Enhanced Leave Application Model
- **New Fields**:
  - `approvedBy`: Username of the admin/manager who made the decision
  - `approvedDate`: Timestamp when the decision was made
  - `remarks`: Comments from the admin/manager

### 4. Role-Based Access Control
- **Authentication**: Users must be logged in to access admin features
- **Authorization**: Only users with `admin` or `manager` role can access admin endpoints
- **Frontend Routing**: Automatic redirection based on user role after login

## How to Use

### For Admins/Managers

1. **Login**: Use admin or manager credentials
2. **Access Admin Dashboard**: Automatically redirected to admin dashboard
3. **Review Applications**: Navigate between pending and all applications
4. **Make Decisions**: Click Approve/Reject buttons on pending applications
5. **Add Remarks**: Provide feedback or reasons for decisions
6. **Monitor Statistics**: View overall leave application statistics

### For Employees

1. **Submit Leave**: Apply for leave through the existing interface
2. **Check Status**: View updated status in leave status page
3. **View Remarks**: See any comments from admins/managers

## Security Features

### Backend Security
- **Role Verification**: All admin endpoints verify user role before processing
- **Input Validation**: Proper validation of all input parameters
- **Error Handling**: Comprehensive error handling and logging

### Frontend Security
- **Role-Based UI**: Admin options only visible to authorized users
- **Session Management**: User role stored in localStorage for session persistence
- **Access Control**: Automatic redirection for unauthorized access attempts

## File Structure

```
backend/
├── controller/
│   └── leaveController.js          # Updated with admin functions
├── model/
│   ├── leaveModel.js               # Updated with status update functions
│   └── userModel.js                # Updated with role management
├── routes/
│   └── leaveRoutes.js              # Updated with admin routes
└── demo-data.json                  # Updated with admin users

Frontend/
├── html/
│   ├── admin-dashboard.html        # New admin interface
│   └── dashboard.html              # Updated with admin navigation
├── css/
│   └── admin-dashboard.css         # New admin styling
└── javascript/
    ├── admin-dashboard.js          # New admin functionality
    ├── dashboard.js                # Updated with role checking
    └── login.js                    # Updated with role handling
```

## Testing

### Manual Testing
1. Start the backend server
2. Login as admin user (`admin.user`)
3. Access admin dashboard
4. Test approve/reject functionality
5. Verify status updates in employee view

### Automated Testing
Run the test file:
```bash
node test-admin-functionality.js
```

## Demo Credentials

### Admin Access
- **Username**: `admin.user`
- **Email**: `admin@company.com`
- **Role**: `admin`

### Manager Access
- **Username**: `manager.user` or `jane.smith`
- **Email**: `manager@company.com` or `jane.smith@company.com`
- **Role**: `manager`

### Employee Access
- **Username**: `john.doe`
- **Email**: `john.doe@company.com`
- **Role**: `employee`

## Future Enhancements

1. **Email Notifications**: Send emails when leave status changes
2. **Approval Workflow**: Multi-level approval for different leave types
3. **Leave Balance Updates**: Automatic leave balance updates after approval
4. **Audit Trail**: Detailed logging of all admin actions
5. **Bulk Operations**: Approve/reject multiple applications at once
6. **Mobile Responsiveness**: Enhanced mobile interface for admin functions

## Troubleshooting

### Common Issues

1. **Access Denied Error**: Ensure user has admin/manager role
2. **Applications Not Loading**: Check backend server is running
3. **Status Not Updating**: Verify application ID exists
4. **Role Not Recognized**: Clear localStorage and re-login

### Debug Mode
Enable console logging in browser developer tools to see detailed error messages and API responses.

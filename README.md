# Employee Leave Management System (ELMS)

A comprehensive web-based application for managing employee leave requests, profiles, and leave balances with **admin/manager approval workflow**.

## Features

### 🏠 Dashboard
- Welcome message with user information
- Leave balance overview (Total, Used, Remaining, Pending)
- Leave policies display
- Navigation to all system modules
- **Admin/Manager options for users with appropriate roles**

### 👤 User Management
- User registration and login
- Profile management (update personal information)
- Secure password handling with bcrypt
- **Role-based access control (Admin, Manager, Employee)**

### 📝 Leave Management
- Apply for different types of leave (Sick, Casual, Annual, Maternity/Paternity)
- Form validation (dates, advance notice requirements)
- Leave status tracking
- Leave history and balance overview
- **Admin/Manager approval workflow**
- **Status updates with remarks and approval tracking**

### 🔔 Notifications
- Real-time notifications for leave status updates
- Company announcements
- Policy updates

### 📊 Reports & Analytics
- Leave status overview
- Leave history tracking
- Balance calculations
- **Admin dashboard with comprehensive statistics**

### 🎯 **NEW: Admin/Manager Features**
- **Admin Dashboard**: Centralized interface for managing all leave applications
- **Application Review**: View pending and all leave applications
- **Approval System**: Approve or reject leave applications with remarks
- **Role-Based Access**: Secure access control for administrative functions
- **Real-time Updates**: Instant status updates visible to employees
- **Audit Trail**: Track who approved/rejected applications and when

## Technology Stack

### Frontend
- HTML5
- CSS3
- Vanilla JavaScript (ES6+)
- Responsive design
- **Modern admin interface with modal dialogs**

### Backend
- Node.js
- Express.js
- RESTful API architecture
- File-based data storage (JSON)
- **Enhanced security with role verification**

### Security
- bcrypt for password hashing
- CORS enabled
- Input validation
- **Role-based authorization**
- **Session management with localStorage**

## Project Structure

```
ELMS mini project resh 1/
├── backend/
│   ├── controller/
│   │   ├── leaveController.js          # Updated with admin functions
│   │   └── userController.js           # Updated with role handling
│   ├── model/
│   │   ├── leaveModel.js               # Updated with status management
│   │   └── userModel.js                # Updated with role management
│   ├── routes/
│   │   ├── leaveRoutes.js              # Updated with admin routes
│   │   └── userRoutes.js
│   ├── index.js
│   ├── package.json
│   ├── users.json                      # Updated with admin users
│   ├── leaveData.json                  # Updated with admin data
│   └── demo-data.json                  # Updated with role-based users
├── Frontend/
│   ├── css/
│   │   ├── applyleave.css
│   │   ├── dashboard.css
│   │   ├── index.css
│   │   ├── leave-overview.css
│   │   ├── leavestatus.css
│   │   ├── login.css
│   │   ├── myprofile.css
│   │   ├── notifications.css
│   │   ├── register.css
│   │   └── admin-dashboard.css         # NEW: Admin interface styling
│   ├── html/
│   │   ├── applyleave.html
│   │   ├── dashboard.html              # Updated with admin navigation
│   │   ├── index.html
│   │   ├── leave-overview.html
│   │   ├── leavestatus.html
│   │   ├── login.html
│   │   ├── myprofile.html
│   │   ├── notifications.html
│   │   ├── register.html
│   │   └── admin-dashboard.html        # NEW: Admin dashboard
│   └── javascript/
│       ├── applyleave.js
│       ├── dashboard.js                # Updated with role checking
│       ├── leave-overview.js
│       ├── leavestatus.js
│       ├── login.js                    # Updated with role handling
│       ├── myprofile.js
│       ├── notifications.js
│       ├── register.js
│       └── admin-dashboard.js          # NEW: Admin functionality
├── README.md
├── ADMIN_FEATURES.md                   # NEW: Detailed admin documentation
└── test-admin-functionality.js         # NEW: Admin feature testing
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd "ELMS mini project resh 1/backend"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```
   
   For development with auto-reload:
   ```bash
   npm run dev
   ```

4. The server will run on `http://localhost:3000`

### Frontend Setup
1. Open the Frontend/html/index.html file in your web browser
2. Or serve the frontend files using a local server

## API Endpoints

### User Management
- `POST /register` - User registration
- `POST /login` - User authentication (returns user role)
- `GET /profile/:username` - Get user profile
- `PUT /update-profile` - Update user profile

### Leave Management
- `GET /api/leave/:username` - Get user leave data
- `POST /api/leave/apply` - Submit leave application
- `GET /api/leave/status/:username` - Get leave status
- `POST /api/leave/update` - Update leave data

### **NEW: Admin/Manager Endpoints**
- `GET /api/leave/admin/all?username={admin_username}` - Get all leave applications
- `GET /api/leave/admin/pending?username={admin_username}` - Get pending applications
- `POST /api/leave/admin/update-status` - Approve/reject leave applications

### Notifications
- `GET /api/notifications/:username` - Get user notifications

## Usage

### 1. Registration & Login
- Start with the registration page to create a new account
- Use your credentials to log in
- **System automatically detects user role and redirects accordingly**

### 2. Dashboard
- View your leave balance and policies
- Navigate to different modules using the sidebar
- **Admin/Manager users see additional admin dashboard option**

### 3. Apply for Leave
- Fill out the leave application form
- Select leave type, dates, and provide reason
- Submit the application
- **Applications are now visible to admins/managers for approval**

### 4. Check Leave Status
- View all your leave applications
- Track approval status and remarks
- **See who approved/rejected your application and when**

### 5. Profile Management
- Update your personal information
- View your current profile details

### 6. Leave Overview
- Check your leave balance
- View leave history

### 7. Notifications
- Stay updated with system notifications
- View company announcements

### **8. NEW: Admin/Manager Functions**
- **Access Admin Dashboard**: Centralized leave management interface
- **Review Applications**: View pending and all leave applications
- **Make Decisions**: Approve or reject applications with remarks
- **Monitor Statistics**: View comprehensive leave application statistics
- **Track Approvals**: See approval history and decision details

## Demo Users

### Admin Access
- **Username**: `admin.user`
- **Role**: `admin`
- **Access**: Full administrative access

### Manager Access
- **Username**: `manager.user` or `jane.smith`
- **Role**: `manager`
- **Access**: Manager access to leave applications

### Employee Access
- **Username**: `john.doe`
- **Role**: `employee`
- **Access**: Standard employee functions

## Features in Detail

### Leave Application Validation
- Minimum 3-day advance notice required
- Date validation (no past dates)
- Maximum 30-day leave limit
- Required field validation

### **NEW: Admin Approval Workflow**
- **Role Verification**: Only admins/managers can access approval functions
- **Status Management**: Applications can be approved, rejected, or kept pending
- **Remarks System**: Admins can provide feedback on decisions
- **Audit Trail**: Track all approval actions with timestamps
- **Real-time Updates**: Status changes immediately visible to employees

### Security Features
- Password hashing with bcrypt
- Input sanitization
- CORS protection
- Error handling
- **Role-based access control**
- **Session management with role persistence**

### Responsive Design
- Mobile-friendly interface
- Modern UI/UX
- Consistent styling across pages
- **Enhanced admin interface with modal dialogs**

## Data Storage

The system uses JSON files for data storage:
- `users.json` - User account information with roles
- `leaveData.json` - Leave balance and policy data
- `leaveApplications.json` - Leave application records with approval tracking
- `demo-data.json` - Sample data with admin/manager users

## Testing

### Manual Testing
1. Start the backend server
2. Login as different user types to test role-based access
3. Test the complete leave application workflow
4. Verify admin approval functionality

### Automated Testing
Run the admin functionality test:
```bash
cd backend
node test-admin-functionality.js
```

## Future Enhancements

- Database integration (MongoDB/MySQL)
- Email notifications for status changes
- **Multi-level approval workflow**
- **Leave balance automatic updates after approval**
- Leave calendar view
- Advanced reporting and analytics
- Mobile app development
- Multi-language support
- **Bulk approval operations**
- **Advanced audit logging**

## Troubleshooting

### Common Issues

1. **Server not starting**
   - Check if port 3000 is available
   - Ensure all dependencies are installed
   - Check Node.js version

2. **CORS errors**
   - Verify backend server is running
   - Check browser console for errors

3. **Data not loading**
   - Ensure JSON files exist and are readable
   - Check file permissions

4. **Admin access denied**
   - Verify user has admin/manager role
   - Check localStorage for user session
   - Clear browser cache and re-login

5. **Leave status not updating**
   - Check if application ID exists
   - Verify admin user has proper permissions
   - Check backend logs for errors

### Error Logs
- Backend errors are logged to console
- Frontend errors appear in browser console
- Check both for debugging
- **Admin actions are logged with user and timestamp**

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Author

**Reshania** - Initial development

## Support

For support and questions, please contact the development team or create an issue in the repository.

---

**Note**: This is a mini-project demonstration with **enhanced admin/manager functionality**. For production use, additional security measures, database integration, and comprehensive testing are recommended.

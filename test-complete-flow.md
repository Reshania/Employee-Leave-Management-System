# Complete Gender-Aware Leave Management System Test

## ✅ **System Features Implemented**

### 1. **Registration with Gender**
- ✅ Registration form asks for gender (Male/Female/Other)
- ✅ Gender is stored with user data in `users.json`
- ✅ Backend validates gender is provided during registration

### 2. **Profile Management**
- ✅ Profile page shows selected gender from registration
- ✅ Profile updates save gender correctly
- ✅ No default "Male" assignment

### 3. **Gender-Aware Dashboard**
- ✅ Female users see maternity leave card
- ✅ Male users don't see maternity leave card
- ✅ Dashboard loads username from URL or localStorage fallback

### 4. **Leave Application with Validation**
- ✅ Real-time leave balance checking
- ✅ Prevents taking more leaves than available
- ✅ Gender validation for maternity leave (Female only)
- ✅ Maternity leave attempt limit (3 times max)
- ✅ Shows remaining vs used vs total for each leave type

### 5. **Leave Approval & Dashboard Updates**
- ✅ Admin can approve/reject leave applications
- ✅ Approved leaves update specific leave type counters
- ✅ Dashboard refreshes automatically when leave status changes
- ✅ Leave counts persist and display correctly

## **Test Steps**

### **Step 1: Register Female User**
1. Go to `register.html`
2. Fill all fields including **Gender: Female**
3. Submit registration
4. Verify user appears in `backend/users.json` with `"gender": "Female"`

### **Step 2: Login & Check Profile**
1. Login with the female user
2. Go to Profile page
3. Verify gender shows "Female" (not defaulted to Male)
4. Change gender and update - should save correctly

### **Step 3: Check Dashboard**
1. Go to Dashboard
2. Verify maternity leave card is visible (Female only)
3. Check all leave balances show 0 used initially

### **Step 4: Apply for Leave**
1. Go to Apply Leave page
2. Select "Sick Leave" - should show balance info
3. Try to apply for more days than available - should be blocked
4. Apply for valid leave (e.g., 2 days sick leave)
5. Submit application

### **Step 5: Admin Approval**
1. Login as admin
2. Go to Admin Dashboard
3. Find the pending leave application
4. Approve the leave
5. Verify leave counters update in `backend/leaveData.json`

### **Step 6: Verify Dashboard Updates**
1. Go back to user dashboard
2. Verify sick leave shows 2 used, 10 remaining
3. Try to apply for 11 more sick days - should be blocked
4. Try to apply for 5 more sick days - should be allowed

### **Step 7: Test Maternity Leave (Female Only)**
1. As female user, apply for maternity leave
2. Verify it's allowed
3. As male user, try to apply for maternity leave
4. Verify it's blocked with error message

## **Expected Results**

- ✅ Gender is asked during registration and stored
- ✅ Profile shows correct gender
- ✅ Female users see maternity leave, males don't
- ✅ Leave applications respect remaining balance
- ✅ Admin approval updates dashboard counts
- ✅ Only remaining leaves can be taken
- ✅ Real-time validation prevents over-booking

## **Files Modified**

1. `backend/controller/userController.js` - Gender in registration/update
2. `backend/model/userModel.js` - Gender field migration
3. `backend/controller/leaveController.js` - Dashboard data format
4. `backend/model/leaveModel.js` - Individual leave type tracking
5. `Frontend/javascript/dashboard.js` - Username fallback, gender logic
6. `Frontend/javascript/myprofile.js` - Gender display/update
7. `Frontend/javascript/applyleave.js` - Leave validation (already existed)

The system is now complete and fully functional!

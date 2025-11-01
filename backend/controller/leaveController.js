import { getUserLeave, updateUserLeave, saveLeaveApplication, getLeaveApplications, updateLeaveApplicationStatus, getPendingLeaveApplications, getAllLeaveApplicationsForAdmin, ensureUserLeaveData } from '../model/leaveModel.js';
import { isAdminOrManager } from '../model/userModel.js';

// Helper function to update pending requests count
function updatePendingRequestsCount(username) {
  try {
    const userLeave = ensureUserLeaveData(username);
    const pendingCount = getLeaveApplications(username).filter(app => app.status === 'Pending').length;
    userLeave.pendingRequests = pendingCount;
    updateUserLeave(username, userLeave);
    console.log(`Updated pending requests count for ${username}: ${pendingCount}`);
  } catch (error) {
    console.error(`Error updating pending requests count for ${username}:`, error);
  }
}

export function fetchLeaveData(req, res) {
  const { username } = req.params;
  console.log('Fetching leave data for username:', username);
  
  try {
    // Ensure user has leave data (create if missing)
    const userLeave = ensureUserLeaveData(username);
    console.log('Leave data found/created:', userLeave);
    
    // Transform data to match dashboard expectations
    const dashboardData = {
      ...userLeave,
      // Map generic usedLeaves to specific leave types for dashboard
      sickLeaveUsed: userLeave.sickLeaveUsed || 0,
      casualLeaveUsed: userLeave.casualLeaveUsed || 0,
      annualLeaveUsed: userLeave.annualLeaveUsed || 0,
      maternityLeaveUsed: userLeave.maternityLeaveUsed || 0,
      maternityLeaveAttempts: userLeave.maternityLeaveAttempts || 0,
      pendingRequests: userLeave.pendingRequests || 0
    };
    
    res.json(dashboardData);
  } catch (err) {
    console.error('Error fetching leave data:', err);
    res.status(500).json({ message: 'Server error fetching leave data' });
  }
}

export function updateLeaveData(req, res) {
  const { username, updates } = req.body;
  console.log('Updating leave data for username:', username, 'with updates:', updates);
  
  try {
    const updatedUser = updateUserLeave(username, updates);
    res.json({ message: 'Leave data updated', updatedUser });
  } catch (err) {
    console.error('Error updating leave data:', err);
    if (err.message === 'User not found') {
      return res.status(404).json({ message: 'User not found in leave data' });
    }
    res.status(500).json({ message: 'Server error updating leave data' });
  }
}

export function applyLeave(req, res) {
  console.log('Leave application request received:', req.body);
  
  const { username, email, leaveType, fromDate, toDate, reason, status } = req.body;
  
  if (!username || !leaveType || !fromDate || !toDate || !reason) {
    console.log('Missing required fields:', { username, leaveType, fromDate, toDate, reason });
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const leaveApplication = {
      id: Date.now().toString(),
      username,
      email,
      leaveType,
      fromDate,
      toDate,
      reason,
      status: status || 'Pending',
      appliedDate: new Date().toISOString(),
      remarks: ''
    };

    console.log('Saving leave application:', leaveApplication);
    saveLeaveApplication(leaveApplication);
    
    // Update pending requests count for the user
    updatePendingRequestsCount(username);
    
    console.log('Leave application saved successfully');
    res.status(201).json({ message: 'Leave application submitted successfully', application: leaveApplication });
  } catch (err) {
    console.error('Error saving leave application:', err);
    res.status(500).json({ message: 'Server error submitting leave application' });
  }
}

export function getLeaveStatus(req, res) {
  const { username } = req.params;
  console.log('Fetching leave status for username:', username);
  
  try {
    const leaveApplications = getLeaveApplications(username);
    console.log('Leave applications found:', leaveApplications);
    res.json(leaveApplications);
  } catch (err) {
    console.error('Error fetching leave status:', err);
    res.status(500).json({ message: 'Server error fetching leave status' });
  }
}

// New function for admin/manager to view all leave applications
export function getAllLeaveApplications(req, res) {
  const { username } = req.query;
  
  if (!username || !isAdminOrManager(username)) {
    return res.status(403).json({ message: 'Access denied. Admin or Manager role required.' });
  }
  
  try {
    const applications = getAllLeaveApplicationsForAdmin();
    res.json(applications);
  } catch (err) {
    console.error('Error fetching all leave applications:', err);
    res.status(500).json({ message: 'Server error fetching leave applications' });
  }
}

// New function for admin/manager to approve/reject leave applications
export function updateLeaveStatus(req, res) {
  const { username, applicationId, status, remarks } = req.body;
  
  if (!username || !isAdminOrManager(username)) {
    return res.status(403).json({ message: 'Access denied. Admin or Manager role required.' });
  }
  
  if (!applicationId || !status) {
    return res.status(400).json({ message: 'Application ID and status are required' });
  }
  
  if (!['Approved', 'Rejected', 'Pending'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status. Must be Approved, Rejected, or Pending' });
  }
  
  try {
    const updatedApplication = updateLeaveApplicationStatus(applicationId, status, remarks, username);
    
    // Set a flag to trigger dashboard refresh for the affected user
    // This will be picked up by the dashboard's checkForUpdates function
    const affectedUser = updatedApplication.username;
    console.log(`Leave status updated for ${affectedUser}, setting refresh flag`);
    
    res.json({ 
      message: 'Leave application status updated successfully', 
      application: updatedApplication,
      affectedUser: affectedUser
    });
  } catch (err) {
    console.error('Error updating leave application status:', err);
    if (err.message === 'Leave application not found') {
      return res.status(404).json({ message: 'Leave application not found' });
    }
    res.status(500).json({ message: 'Server error updating leave application status' });
  }
}

// New function to get pending leave applications for admin/manager
export function getPendingApplications(req, res) {
  const { username } = req.query;
  
  if (!username || !isAdminOrManager(username)) {
    return res.status(403).json({ message: 'Access denied. Admin or Manager role required.' });
  }
  
  try {
    const pendingApplications = getPendingLeaveApplications();
    res.json(pendingApplications);
  } catch (err) {
    console.error('Error fetching pending applications:', err);
    res.status(500).json({ message: 'Server error fetching pending applications' });
  }
}

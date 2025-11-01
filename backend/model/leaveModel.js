import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_FILE = path.join(__dirname, '..', 'leaveData.json');
const APPLICATIONS_FILE = path.join(__dirname, '..', 'leaveApplications.json');

function ensureDataFile() {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, '[]');
  }
}

function ensureApplicationsFile() {
  if (!fs.existsSync(APPLICATIONS_FILE)) {
    fs.writeFileSync(APPLICATIONS_FILE, '[]');
  }
}

export function getLeaveData() {
  ensureDataFile();
  const data = fs.readFileSync(DATA_FILE, 'utf8');
  return JSON.parse(data);
}

export function getUserLeave(username) {
  const leaveData = getLeaveData();
  return leaveData.find(user => user.username === username);
}

export function updateUserLeave(username, updates) {
  const leaveData = getLeaveData();
  const index = leaveData.findIndex(user => user.username === username);
  if (index === -1) {
    throw new Error('User not found');
  }
  leaveData[index] = { ...leaveData[index], ...updates };
  fs.writeFileSync(DATA_FILE, JSON.stringify(leaveData, null, 2));
  return leaveData[index];
}

export function saveLeaveApplication(application) {
  ensureApplicationsFile();
  const applications = getLeaveApplications();
  applications.push(application);
  fs.writeFileSync(APPLICATIONS_FILE, JSON.stringify(applications, null, 2));
  return application;
}

export function getLeaveApplications(username = null) {
  ensureApplicationsFile();
  const applications = fs.readFileSync(APPLICATIONS_FILE, 'utf8');
  const parsedApplications = JSON.parse(applications);
  
  if (username) {
    return parsedApplications.filter(app => app.username === username);
  }
  return parsedApplications;
}

export function updateLeaveApplicationStatus(applicationId, status, remarks = '', approvedBy = '') {
  ensureApplicationsFile();
  const applications = getLeaveApplications();
  const index = applications.findIndex(app => app.id === applicationId);
  
  if (index === -1) {
    throw new Error('Leave application not found');
  }
  
  const application = applications[index];
  const previousStatus = application.status;
  
  // Update application status
  applications[index].status = status;
  applications[index].remarks = remarks;
  applications[index].approvedBy = approvedBy;
  applications[index].approvedDate = new Date().toISOString();
  
  // Calculate leave days
  const fromDate = new Date(application.fromDate);
  const toDate = new Date(application.toDate);
  const leaveDays = Math.ceil((toDate - fromDate) / (1000 * 60 * 60 * 24)) + 1;
  
  // Update user's leave balance if status changed to/from approved
  if (status === 'Approved' && previousStatus !== 'Approved') {
    // Leave was just approved - deduct from user's balance
    updateUserLeaveBalance(application.username, leaveDays, 'approve', application.leaveType);
  } else if (status !== 'Approved' && previousStatus === 'Approved') {
    // Leave was previously approved but now rejected/cancelled - add back to user's balance
    updateUserLeaveBalance(application.username, leaveDays, 'reject', application.leaveType);
  }
  
  fs.writeFileSync(APPLICATIONS_FILE, JSON.stringify(applications, null, 2));
  return applications[index];
}

// Helper function to update user's leave balance
function updateUserLeaveBalance(username, leaveDays, action, leaveType) {
  try {
    const userLeave = ensureUserLeaveData(username);
    
    // Initialize specific leave type counters if they don't exist
    if (!userLeave.sickLeaveUsed) userLeave.sickLeaveUsed = 0;
    if (!userLeave.casualLeaveUsed) userLeave.casualLeaveUsed = 0;
    if (!userLeave.annualLeaveUsed) userLeave.annualLeaveUsed = 0;
    if (!userLeave.maternityLeaveUsed) userLeave.maternityLeaveUsed = 0;
    if (!userLeave.maternityLeaveAttempts) userLeave.maternityLeaveAttempts = 0;
    
    if (action === 'approve') {
      // Deduct leave days from user's balance
      userLeave.usedLeaves = (userLeave.usedLeaves || 0) + leaveDays;
      userLeave.remainingLeaves = userLeave.totalLeaves - userLeave.usedLeaves;
      
      // Update specific leave type counter
      switch(leaveType) {
        case 'Sick Leave':
          userLeave.sickLeaveUsed += leaveDays;
          break;
        case 'Casual Leave':
          userLeave.casualLeaveUsed += leaveDays;
          break;
        case 'Annual Leave':
          userLeave.annualLeaveUsed += leaveDays;
          break;
        case 'Maternity/Paternity Leave':
        case 'Maternity Leave':
          userLeave.maternityLeaveUsed += leaveDays;
          userLeave.maternityLeaveAttempts += 1;
          break;
      }
    } else if (action === 'reject') {
      // Add leave days back to user's balance
      userLeave.usedLeaves = Math.max(0, (userLeave.usedLeaves || 0) - leaveDays);
      userLeave.remainingLeaves = userLeave.totalLeaves - userLeave.usedLeaves;
      
      // Update specific leave type counter
      switch(leaveType) {
        case 'Sick Leave':
          userLeave.sickLeaveUsed = Math.max(0, userLeave.sickLeaveUsed - leaveDays);
          break;
        case 'Casual Leave':
          userLeave.casualLeaveUsed = Math.max(0, userLeave.casualLeaveUsed - leaveDays);
          break;
        case 'Annual Leave':
          userLeave.annualLeaveUsed = Math.max(0, userLeave.annualLeaveUsed - leaveDays);
          break;
        case 'Maternity/Paternity Leave':
        case 'Maternity Leave':
          userLeave.maternityLeaveUsed = Math.max(0, userLeave.maternityLeaveUsed - leaveDays);
          userLeave.maternityLeaveAttempts = Math.max(0, userLeave.maternityLeaveAttempts - 1);
          break;
      }
    }
    
    // Update pending requests count
    const pendingCount = getLeaveApplications(username).filter(app => app.status === 'Pending').length;
    userLeave.pendingRequests = pendingCount;
    
    updateUserLeave(username, userLeave);
    console.log(`Updated leave balance for ${username}: ${action} ${leaveDays} days of ${leaveType}`);
  } catch (error) {
    console.error(`Error updating leave balance for ${username}:`, error);
  }
}

export function getPendingLeaveApplications() {
  const applications = getLeaveApplications();
  return applications.filter(app => app.status === 'Pending');
}

export function getAllLeaveApplicationsForAdmin() {
  return getLeaveApplications();
}

// Create initial leave data for new users
export function createUserLeaveData(username) {
  ensureDataFile();
  const leaveData = getLeaveData();
  
  // Check if user already has leave data
  const existingUser = leaveData.find(user => user.username === username);
  if (existingUser) {
    return existingUser; // Return existing data if found
  }
  
  // Create new leave data for the user
  const newUserLeaveData = {
    username: username,
    totalLeaves: 30,
    usedLeaves: 0,
    remainingLeaves: 30,
    pendingRequests: 0,
    leaveStatus: "Active",
    sickLeaveUsed: 0,
    casualLeaveUsed: 0,
    annualLeaveUsed: 0,
    maternityLeaveUsed: 0,
    maternityLeaveAttempts: 0
  };
  
  leaveData.push(newUserLeaveData);
  fs.writeFileSync(DATA_FILE, JSON.stringify(leaveData, null, 2));
  
  return newUserLeaveData;
}

// Ensure user has leave data (create if missing)
export function ensureUserLeaveData(username) {
  const userLeave = getUserLeave(username);
  if (!userLeave) {
    return createUserLeaveData(username);
  }
  
  // Migrate existing users to have specific leave type fields
  let needsUpdate = false;
  if (userLeave.sickLeaveUsed === undefined) {
    userLeave.sickLeaveUsed = 0;
    needsUpdate = true;
  }
  if (userLeave.casualLeaveUsed === undefined) {
    userLeave.casualLeaveUsed = 0;
    needsUpdate = true;
  }
  if (userLeave.annualLeaveUsed === undefined) {
    userLeave.annualLeaveUsed = 0;
    needsUpdate = true;
  }
  if (userLeave.maternityLeaveUsed === undefined) {
    userLeave.maternityLeaveUsed = 0;
    needsUpdate = true;
  }
  if (userLeave.maternityLeaveAttempts === undefined) {
    userLeave.maternityLeaveAttempts = 0;
    needsUpdate = true;
  }
  
  if (needsUpdate) {
    updateUserLeave(username, userLeave);
    console.log(`Migrated leave data for ${username} with specific leave type fields`);
  }
  
  return userLeave;
}

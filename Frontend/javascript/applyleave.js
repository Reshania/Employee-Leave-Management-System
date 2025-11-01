document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const username = params.get('username');

  console.log('Apply leave page loaded for username:', username);

  // Add navigation back to dashboard
  const backButton = document.createElement('button');
  backButton.textContent = 'Back to Dashboard';
  backButton.style.cssText = 'margin: 20px; padding: 10px 20px; background: #007BFF; color: white; border: none; border-radius: 5px; cursor: pointer;';
  backButton.onclick = () => {
    window.location.href = `dashboard.html?username=${username}`;
  };
  document.body.insertBefore(backButton, document.querySelector('h2'));

  // Auto-fill name and email if username is available
  if (username) {
    document.getElementById('name').value = username;
    console.log('Auto-filled name with username:', username);
    
    // Try to fetch user details to auto-fill email
    fetch(`http://localhost:3000/profile/${username}`)
      .then(response => response.json())
      .then(user => {
        if (user.email) {
          document.getElementById('email').value = user.email;
          console.log('Auto-filled email:', user.email);
        }
      })
      .catch(error => {
        console.log('Could not fetch user details for email auto-fill:', error);
      });
  }

  // Form validation and submission
  const form = document.querySelector('#leaveForm');
  console.log('Form element found:', form);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log('Form submission started');

    const formData = new FormData(form);
    const leaveData = {
      username: formData.get('name'),
      email: formData.get('email'),
      leaveType: formData.get('leave_type'),
      fromDate: formData.get('from_date'),
      toDate: formData.get('to_date'),
      reason: formData.get('reason'),
      status: 'Pending'
    };

    console.log('Leave data to submit:', leaveData);

    // Validate dates
    const fromDate = new Date(leaveData.fromDate);
    const toDate = new Date(leaveData.toDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (fromDate < today) {
      showError('From date cannot be in the past', 'Date Validation Error');
      return;
    }

    if (toDate < fromDate) {
      showError('To date cannot be before from date', 'Date Validation Error');
      return;
    }

    // Calculate number of days
    const timeDiff = toDate.getTime() - fromDate.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;

    // Validate leave balance based on leave type
    const leaveType = leaveData.leaveType;
    const maxDays = getMaxDaysForLeaveType(leaveType);
    
    if (daysDiff > maxDays) {
      showError(`Leave cannot exceed ${maxDays} days for ${leaveType}`, 'Leave Duration Error');
      return;
    }

    // Check remaining leave balance
    const leaveBalanceInfo = await checkLeaveBalance(username, leaveType, daysDiff);
    if (!leaveBalanceInfo.hasEnoughLeave) {
      showError(`Insufficient ${leaveType} balance. You have ${leaveBalanceInfo.remainingDays} days remaining, but requested ${daysDiff} days.`, 'Insufficient Leave Balance');
      return;
    }

    // Gender validation for maternity leave
    if (leaveType === 'Maternity/Paternity Leave') {
      const userGender = await getUserGender(username);
      if (userGender !== 'Female') {
        showError('Maternity leave is only available for female employees', 'Leave Type Restriction');
        return;
      }
      
      // Check maternity leave attempts limit
      const maternityAttempts = await getMaternityLeaveAttempts(username);
      if (maternityAttempts >= 3) {
        showError('You have already used all 3 maternity leave attempts', 'Maternity Leave Limit Reached');
        return;
      }
    }

    console.log('Validation passed, submitting to backend...');

    try {
      // Submit leave application
      const response = await fetch('http://localhost:3000/api/leave/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(leaveData),
      });

      console.log('Backend response status:', response.status);
      console.log('Backend response headers:', response.headers);

      if (response.ok) {
        const result = await response.json();
        console.log('Success response:', result);
        showSuccess('Leave application submitted successfully!', 'Application Submitted');
        form.reset();
        // Redirect to leave status page after a short delay
        setTimeout(() => {
          window.location.href = `leavestatus.html?username=${username}`;
        }, 1500);
      } else {
        const error = await response.json();
        console.error('Backend error response:', error);
        showError(`Failed to submit leave application: ${error.message || 'Unknown error'}`, 'Submission Failed');
      }
    } catch (error) {
      console.error('Network error during submission:', error);
      showError(`Network error: ${error.message}. Please check if the backend server is running.`, 'Connection Error');
    }
  });

  // Add date validation for minimum advance notice
  const fromDateInput = document.getElementById('from-date');
  fromDateInput.addEventListener('change', () => {
    const selectedDate = new Date(fromDateInput.value);
    const today = new Date();
    const minDate = new Date(today);
    minDate.setDate(today.getDate() + 3); // 3 days advance notice

    if (selectedDate < minDate) {
      showWarning('Leave applications must be submitted at least 3 days in advance', 'Advance Notice Required');
      fromDateInput.value = '';
    }
  });

  // Set minimum date for from-date (today + 3 days)
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 3);
  fromDateInput.min = minDate.toISOString().split('T')[0];
  
  // Set minimum date for to-date (same as from-date)
  const toDateInput = document.getElementById('to-date');
  fromDateInput.addEventListener('change', () => {
    toDateInput.min = fromDateInput.value;
  });

  // Add real-time leave balance display
  const leaveTypeSelect = document.getElementById('leave-type');
  const leaveBalanceDiv = document.createElement('div');
  leaveBalanceDiv.id = 'leave-balance-display';
  leaveBalanceDiv.style.cssText = `
    margin: 10px 0;
    padding: 10px;
    background: #f8f9fa;
    border-radius: 5px;
    border-left: 4px solid #007bff;
    display: none;
  `;
  leaveTypeSelect.parentNode.insertBefore(leaveBalanceDiv, leaveTypeSelect.nextSibling);

  // Show leave balance when leave type is selected
  leaveTypeSelect.addEventListener('change', async () => {
    await updateLeaveBalanceDisplay();
  });

  // Function to update leave balance display
  async function updateLeaveBalanceDisplay() {
    const selectedLeaveType = leaveTypeSelect.value;
    if (selectedLeaveType && username) {
      const balanceInfo = await checkLeaveBalance(username, selectedLeaveType, 0);
      if (balanceInfo) {
        leaveBalanceDiv.innerHTML = `
          <strong>Leave Balance for ${selectedLeaveType}:</strong><br>
          <span style="color: #28a745;">Remaining: ${balanceInfo.remainingDays} days</span> | 
          <span style="color: #6c757d;">Used: ${balanceInfo.usedDays} days</span> | 
          <span style="color: #007bff;">Total: ${balanceInfo.totalDays} days</span>
        `;
        leaveBalanceDiv.style.display = 'block';
      }
    } else {
      leaveBalanceDiv.style.display = 'none';
    }
  }

  // Add real-time validation for date changes
  function addDateValidation() {
    const fromDateInput = document.getElementById('from-date');
    const toDateInput = document.getElementById('to-date');
    
    function validateDateRange() {
      const selectedLeaveType = leaveTypeSelect.value;
      if (selectedLeaveType && fromDateInput.value && toDateInput.value) {
        const fromDate = new Date(fromDateInput.value);
        const toDate = new Date(toDateInput.value);
        const timeDiff = toDate.getTime() - fromDate.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
        
        checkLeaveBalance(username, selectedLeaveType, daysDiff).then(balanceInfo => {
          if (balanceInfo) {
            if (daysDiff > balanceInfo.remainingDays) {
              leaveBalanceDiv.innerHTML = `
                <strong>Leave Balance for ${selectedLeaveType}:</strong><br>
                <span style="color: #dc3545;">⚠️ Insufficient Balance!</span><br>
                <span style="color: #28a745;">Remaining: ${balanceInfo.remainingDays} days</span> | 
                <span style="color: #dc3545;">Requested: ${daysDiff} days</span> | 
                <span style="color: #6c757d;">Used: ${balanceInfo.usedDays} days</span> | 
                <span style="color: #007bff;">Total: ${balanceInfo.totalDays} days</span>
              `;
              leaveBalanceDiv.style.borderLeftColor = '#dc3545';
            } else {
              leaveBalanceDiv.innerHTML = `
                <strong>Leave Balance for ${selectedLeaveType}:</strong><br>
                <span style="color: #28a745;">✅ Sufficient Balance</span><br>
                <span style="color: #28a745;">Remaining: ${balanceInfo.remainingDays} days</span> | 
                <span style="color: #28a745;">Requested: ${daysDiff} days</span> | 
                <span style="color: #6c757d;">Used: ${balanceInfo.usedDays} days</span> | 
                <span style="color: #007bff;">Total: ${balanceInfo.totalDays} days</span>
              `;
              leaveBalanceDiv.style.borderLeftColor = '#28a745';
            }
            leaveBalanceDiv.style.display = 'block';
          }
        });
      }
    }
    
    fromDateInput.addEventListener('change', validateDateRange);
    toDateInput.addEventListener('change', validateDateRange);
  }
  
  addDateValidation();
});

// Helper function to get maximum days for each leave type
function getMaxDaysForLeaveType(leaveType) {
  switch (leaveType) {
    case 'Sick Leave':
      return 12;
    case 'Casual Leave':
      return 12;
    case 'Annual Leave':
      return 6;
    case 'Maternity/Paternity Leave':
      return 365;
    default:
      return 12;
  }
}

// Helper function to get user gender
async function getUserGender(username) {
  try {
    const response = await fetch(`http://localhost:3000/profile/${username}`);
    if (response.ok) {
      const profile = await response.json();
      return profile.gender || 'Male';
    }
  } catch (error) {
    console.error('Error fetching user gender:', error);
  }
  return 'Male'; // Default gender
}

// Helper function to check leave balance
async function checkLeaveBalance(username, leaveType, requestedDays) {
  try {
    const response = await fetch(`http://localhost:3000/api/leave/${username}`);
    if (response.ok) {
      const user = await response.json();
      
      let remainingDays = 0;
      let totalDays = 0;
      
      switch (leaveType) {
        case 'Sick Leave':
          totalDays = 12;
          remainingDays = totalDays - (user.sickLeaveUsed || 0);
          break;
        case 'Casual Leave':
          totalDays = 12;
          remainingDays = totalDays - (user.casualLeaveUsed || 0);
          break;
        case 'Annual Leave':
          totalDays = 6;
          remainingDays = totalDays - (user.annualLeaveUsed || 0);
          break;
        case 'Maternity/Paternity Leave':
          totalDays = 365;
          remainingDays = totalDays - (user.maternityLeaveUsed || 0);
          break;
        default:
          totalDays = 12;
          remainingDays = totalDays;
      }
      
      return {
        hasEnoughLeave: requestedDays <= remainingDays,
        remainingDays: Math.max(0, remainingDays),
        totalDays: totalDays,
        usedDays: totalDays - remainingDays
      };
    }
  } catch (error) {
    console.error('Error checking leave balance:', error);
  }
  
  // If we can't check balance, allow the request (backend will handle it)
  return {
    hasEnoughLeave: true,
    remainingDays: 999,
    totalDays: 999,
    usedDays: 0
  };
}

// Helper function to get maternity leave attempts
async function getMaternityLeaveAttempts(username) {
  try {
    const response = await fetch(`http://localhost:3000/api/leave/${username}`);
    if (response.ok) {
      const user = await response.json();
      return user.maternityLeaveAttempts || 0;
    }
  } catch (error) {
    console.error('Error checking maternity leave attempts:', error);
  }
  
  return 0; // Default to 0 attempts if we can't check
}

const params = new URLSearchParams(window.location.search);
let username = params.get('username');
if (!username) {
  try {
    const stored = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (stored && stored.username) {
      username = stored.username;
    }
  } catch (_) {}
}

async function loadDashboard() {
  if (!username) {
    document.getElementById('welcome-message').textContent = 'Welcome';
    console.log('No username found in URL');
    return;
  }

  console.log('Loading dashboard for username:', username);

  // Display user info in header
  const userInfoDiv = document.getElementById('user-info');
  if (userInfoDiv) {
    userInfoDiv.innerHTML = `Welcome, <strong>${username}</strong>`;
  }

  // Check if user is admin/manager and show admin option
  checkUserRole();

  try {
    // Load user profile to get gender
    let userGender = '';
    const profileResponse = username ? await fetch(`http://localhost:3000/profile/${username}`) : { ok: false };
    
    if (profileResponse.ok) {
      const profile = await profileResponse.json();
      userGender = profile.gender || '';
      console.log('Profile loaded:', profile);
    } else {
      console.log('Profile not found, checking localStorage');
      // Fallback to localStorage if profile not found
      try {
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        if (currentUser && currentUser.gender) {
          userGender = currentUser.gender;
          console.log('Gender from localStorage:', userGender);
        }
      } catch (_) {}
    }

    // Show/hide maternity leave card based on gender
    const maternityCard = document.getElementById('maternity-card');
    console.log('User gender:', userGender);
    if (userGender === 'Female') {
      maternityCard.style.display = 'block';
      console.log('Maternity leave card shown for female user');
    } else {
      maternityCard.style.display = 'none';
      console.log('Maternity leave card hidden for non-female user');
    }

    // Load leave data
    if (!username) {
      console.log('No username context; loading defaults');
      loadDefaultLeaveBalances();
      const maternityCard = document.getElementById('maternity-card');
      if (maternityCard) maternityCard.style.display = (userGender === 'Female') ? 'block' : 'none';
      return;
    }
    const response = await fetch(`http://localhost:3000/api/leave/${username}?t=${Date.now()}`);
    console.log('Leave API response status:', response.status);

    if (!response.ok) {
      if (response.status === 404) {
        console.log('User not found in leave data, using default values');
        // Use default values if user not found
        loadDefaultLeaveBalances();
        // Ensure maternity card visibility is set correctly
        const maternityCard = document.getElementById('maternity-card');
        if (userGender === 'Female') {
          maternityCard.style.display = 'block';
        } else {
          maternityCard.style.display = 'none';
        }
        return;
      }
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const user = await response.json();
    console.log('Leave data received:', user);
    console.log('Specific leave counts:', {
      sickLeaveUsed: user.sickLeaveUsed,
      casualLeaveUsed: user.casualLeaveUsed,
      annualLeaveUsed: user.annualLeaveUsed,
      maternityLeaveUsed: user.maternityLeaveUsed
    });

    document.getElementById('welcome-message').textContent = `Welcome, ${username}`;
    
    // Load leave balances based on the new system
    loadLeaveBalances(user, userGender);

    // Leave status
    const statusSection = document.createElement('p');
    statusSection.textContent = `Latest Leave Status: ${user.leaveStatus || 'Active'}`;
    statusSection.style.cssText = 'margin-top: 20px; padding: 10px; background: #f8f9fa; border-radius: 5px;';
    document.querySelector('.main-content').appendChild(statusSection);

  } catch (err) {
    console.error('Error loading dashboard data:', err);
    
    // Show error message to user
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = 'margin: 20px; padding: 15px; background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; border-radius: 5px;';
    errorDiv.innerHTML = `
      <strong>Error loading dashboard data:</strong><br>
      ${err.message}<br>
      <small>This might be due to the backend server not running or network issues.</small>
    `;
    document.querySelector('.main-content').appendChild(errorDiv);
    
    // Use default values
    loadDefaultLeaveBalances();
    
    // Ensure maternity card visibility is set correctly even on error
    const maternityCard = document.getElementById('maternity-card');
    if (userGender === 'Female') {
      maternityCard.style.display = 'block';
    } else {
      maternityCard.style.display = 'none';
    }
  }
}

// Check user role and show admin options if applicable
function checkUserRole() {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (currentUser && (currentUser.role === 'admin' || currentUser.role === 'manager')) {
    const adminOption = document.getElementById('admin-option');
    if (adminOption) {
      adminOption.style.display = 'block';
    }
  }
}

// Function to refresh dashboard data
async function refreshDashboard() {
  console.log('Refreshing dashboard data...');
  
  // Show loading indicator
  const refreshBtn = document.querySelector('button[onclick="refreshDashboard()"]');
  if (refreshBtn) {
    const originalText = refreshBtn.innerHTML;
    refreshBtn.innerHTML = '⏳ Refreshing...';
    refreshBtn.disabled = true;
    
    try {
      await loadDashboard();
      console.log('Dashboard refresh completed successfully');
      
      // Show success notification
      showNotification('Dashboard updated successfully!', 'success');
      
      // Reset button
      refreshBtn.innerHTML = originalText;
      refreshBtn.disabled = false;
    } catch (error) {
      console.error('Error refreshing dashboard:', error);
      showNotification('Failed to refresh dashboard', 'error');
      
      // Reset button
      refreshBtn.innerHTML = originalText;
      refreshBtn.disabled = false;
    }
  } else {
    console.log('No refresh button found, calling loadDashboard directly');
    await loadDashboard();
  }
}

// Function to show notifications
function showNotification(message, type = 'info') {
  // Remove existing notifications
  const existingNotifications = document.querySelectorAll('.dashboard-notification');
  existingNotifications.forEach(notification => notification.remove());
  
  // Create notification element
  const notification = document.createElement('div');
  notification.className = 'dashboard-notification';
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 1rem 1.5rem;
    border-radius: 0.5rem;
    color: white;
    font-weight: 600;
    z-index: 1000;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transform: translateX(100%);
    transition: transform 0.3s ease;
    max-width: 300px;
  `;
  
  // Set background color based on type
  switch (type) {
    case 'success':
      notification.style.background = '#059669';
      break;
    case 'error':
      notification.style.background = '#dc2626';
      break;
    default:
      notification.style.background = '#2563eb';
  }
  
  notification.textContent = message;
  document.body.appendChild(notification);
  
  // Animate in
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 100);
  
  // Auto remove after 3 seconds
  setTimeout(() => {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

// Check if we're returning from admin dashboard and refresh data
function checkForUpdates() {
  const lastUpdate = localStorage.getItem('lastAdminUpdate');
  const currentTime = Date.now();
  
  console.log('Checking for updates...', { lastUpdate, currentTime });
  
  // If there was an admin update in the last 30 seconds, refresh the dashboard
  if (lastUpdate && (currentTime - parseInt(lastUpdate)) < 30000) {
    console.log('Detected recent admin update, refreshing dashboard...');
    showNotification('Leave status updated! Refreshing dashboard...', 'info');
    refreshDashboard();
    localStorage.removeItem('lastAdminUpdate'); // Clear the flag
  } else {
    console.log('No recent admin updates detected');
  }
}

// Add event listener for page visibility change (when user returns from admin dashboard)
document.addEventListener('visibilitychange', function() {
  if (!document.hidden) {
    checkForUpdates();
  }
});

// Add event listener for focus (when user returns to this tab)
window.addEventListener('focus', function() {
  checkForUpdates();
});

// Function to load default leave balances
function loadDefaultLeaveBalances() {
  // Set default values for all leave types
  document.getElementById('sick-used').textContent = '0';
  document.getElementById('sick-total').textContent = '12';
  document.getElementById('sick-remaining').textContent = '12';
  
  document.getElementById('casual-used').textContent = '0';
  document.getElementById('casual-total').textContent = '12';
  document.getElementById('casual-remaining').textContent = '12';
  
  document.getElementById('annual-used').textContent = '0';
  document.getElementById('annual-total').textContent = '6';
  document.getElementById('annual-remaining').textContent = '6';
  
  document.getElementById('maternity-used').textContent = '0';
  document.getElementById('maternity-total').textContent = '365';
  document.getElementById('maternity-remaining').textContent = '365';
  document.getElementById('maternity-attempts').textContent = '0';
  
  document.getElementById('pending-requests').textContent = '0';
}

// Function to load leave balances from backend data
function loadLeaveBalances(user, userGender) {
  console.log('Loading leave balances with data:', user);
  console.log('User gender:', userGender);
  
  // Extract leave data by type from user object
  const sickUsed = user.sickLeaveUsed || 0;
  const casualUsed = user.casualLeaveUsed || 0;
  const annualUsed = user.annualLeaveUsed || 0;
  const maternityUsed = user.maternityLeaveUsed || 0;
  
  console.log('Extracted leave counts:', { sickUsed, casualUsed, annualUsed, maternityUsed });
  
  // Set sick leave
  const sickUsedElement = document.getElementById('sick-used');
  const sickRemainingElement = document.getElementById('sick-remaining');
  
  if (sickUsedElement) {
    sickUsedElement.textContent = sickUsed;
    console.log('✅ Updated sick-used element:', sickUsedElement.textContent);
  } else {
    console.error('❌ sick-used element not found!');
  }
  
  if (sickRemainingElement) {
    sickRemainingElement.textContent = Math.max(0, 12 - sickUsed);
    console.log('✅ Updated sick-remaining element:', sickRemainingElement.textContent);
  } else {
    console.error('❌ sick-remaining element not found!');
  }
  
  document.getElementById('sick-total').textContent = '12';
  
  // Set casual leave
  document.getElementById('casual-used').textContent = casualUsed;
  document.getElementById('casual-total').textContent = '12';
  document.getElementById('casual-remaining').textContent = Math.max(0, 12 - casualUsed);
  
  // Set annual leave
  document.getElementById('annual-used').textContent = annualUsed;
  document.getElementById('annual-total').textContent = '6';
  document.getElementById('annual-remaining').textContent = Math.max(0, 6 - annualUsed);
  
  // Set maternity leave (only for females)
  if (userGender === 'Female') {
    const maternityAttempts = user.maternityLeaveAttempts || 0;
    document.getElementById('maternity-used').textContent = maternityUsed;
    document.getElementById('maternity-total').textContent = '365';
    document.getElementById('maternity-remaining').textContent = Math.max(0, 365 - maternityUsed);
    document.getElementById('maternity-attempts').textContent = maternityAttempts;
  }
  
  // Set pending requests
  document.getElementById('pending-requests').textContent = user.pendingRequests || 0;
}

// Test function to manually set gender (for testing purposes)
function setTestGender(gender) {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (currentUser) {
    currentUser.gender = gender;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    console.log('Test gender set to:', gender);
    loadDashboard(); // Reload dashboard
  }
}

// Make test function available globally for console testing
window.setTestGender = setTestGender;

// Add manual refresh function for testing
window.forceRefresh = async function() {
  console.log('Force refreshing dashboard...');
  await loadDashboard();
};

// Add manual update function for testing
window.manualUpdate = function() {
  console.log('Manually updating dashboard elements...');
  
  // Test if elements exist
  const elements = ['sick-used', 'sick-remaining', 'casual-used', 'annual-used'];
  elements.forEach(id => {
    const element = document.getElementById(id);
    if (element) {
      console.log(`✅ Found element ${id}:`, element.textContent);
    } else {
      console.error(`❌ Element ${id} not found!`);
    }
  });
  
  // Force update with test data
  const sickUsed = document.getElementById('sick-used');
  if (sickUsed) {
    sickUsed.textContent = '3';
    console.log('✅ Manually set sick-used to 3');
  }
};

// Load dashboard when page loads
loadDashboard();

// Also check for updates when page loads
checkForUpdates();

// Add a simple fallback to force update after page loads
setTimeout(() => {
  console.log('Running fallback dashboard update...');
  loadDashboard();
}, 2000);

// DIRECT FIX - Force update dashboard elements
function forceUpdateDashboard() {
  console.log('🔧 FORCE UPDATING DASHBOARD...');
  
  // Get username
  const params = new URLSearchParams(window.location.search);
  let username = params.get('username');
  if (!username) {
    try {
      const stored = JSON.parse(localStorage.getItem('currentUser') || '{}');
      username = stored.username;
    } catch (_) {}
  }
  
  if (!username) {
    console.log('❌ No username found');
    return;
  }
  
  console.log('📡 Fetching data for:', username);
  
  // Fetch data and update elements directly
  fetch(`http://localhost:3000/api/leave/${username}?t=${Date.now()}`)
    .then(response => response.json())
    .then(data => {
      console.log('📊 Data received:', data);
      
      // Update each element directly
      const updates = [
        { id: 'sick-used', value: data.sickLeaveUsed || 0 },
        { id: 'sick-remaining', value: Math.max(0, 12 - (data.sickLeaveUsed || 0)) },
        { id: 'casual-used', value: data.casualLeaveUsed || 0 },
        { id: 'casual-remaining', value: Math.max(0, 12 - (data.casualLeaveUsed || 0)) },
        { id: 'annual-used', value: data.annualLeaveUsed || 0 },
        { id: 'annual-remaining', value: Math.max(0, 6 - (data.annualLeaveUsed || 0)) },
        { id: 'pending-requests', value: data.pendingRequests || 0 }
      ];
      
      updates.forEach(update => {
        const element = document.getElementById(update.id);
        if (element) {
          element.textContent = update.value;
          console.log(`✅ Updated ${update.id} to: ${update.value}`);
        } else {
          console.error(`❌ Element ${update.id} not found!`);
        }
      });
      
      console.log('🎉 Dashboard force update completed!');
    })
    .catch(error => {
      console.error('❌ Force update error:', error);
    });
}

// Make it available globally
window.forceUpdateDashboard = forceUpdateDashboard;

// Run the force update after a delay
setTimeout(() => {
  console.log('🚀 Running force update...');
  forceUpdateDashboard();
}, 3000);

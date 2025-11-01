document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const username = params.get('username');

  // Add navigation back to dashboard
  const backButton = document.createElement('button');
  backButton.textContent = 'Back to Dashboard';
  backButton.style.cssText = 'margin: 20px; padding: 10px 20px; background: #007BFF; color: white; border: none; border-radius: 5px; cursor: pointer;';
  backButton.onclick = () => {
    window.location.href = `dashboard.html?username=${username}`;
  };
  document.body.insertBefore(backButton, document.querySelector('header'));

  // Add refresh button
  const refreshButton = document.createElement('button');
  refreshButton.textContent = 'Refresh Notifications';
  refreshButton.style.cssText = 'margin: 20px; padding: 10px 20px; background: #28a745; color: white; border: none; border-radius: 5px; cursor: pointer; margin-left: 10px;';
  refreshButton.onclick = () => {
    loadNotifications();
  };
  document.body.insertBefore(refreshButton, document.querySelector('header'));

  async function loadNotifications() {
    if (!username) {
      console.log('No username found, using sample data');
      loadSampleNotifications();
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/notifications/${username}`);
      
      if (response.ok) {
        const notifications = await response.json();
        updateNotificationsList(notifications);
      } else {
        console.log('No notifications found, using sample data');
        loadSampleNotifications();
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
      loadSampleNotifications();
    }
  }

  function loadSampleNotifications() {
    const sampleNotifications = [
      'Your leave request from July 5–7 is pending approval.',
      'Company holiday on July 15 (Founder\'s Day).',
      'Update your profile with emergency contact info.',
      'New leave policy updates effective from next month.',
      'Your annual leave balance will reset on January 1st.'
    ];
    updateNotificationsList(sampleNotifications);
  }

  function updateNotificationsList(notifications) {
    const ul = document.querySelector('ul');
    if (ul) {
      ul.innerHTML = '';
      
      if (notifications.length === 0) {
        const li = document.createElement('li');
        li.textContent = 'No new notifications';
        li.style.fontStyle = 'italic';
        li.style.color = '#666';
        ul.appendChild(li);
        return;
      }

      notifications.forEach(notification => {
        const li = document.createElement('li');
        li.textContent = notification;
        
        // Add timestamp
        const timestamp = document.createElement('small');
        timestamp.textContent = new Date().toLocaleString();
        timestamp.style.cssText = 'color: #666; font-size: 12px; display: block; margin-top: 5px;';
        li.appendChild(timestamp);
        
        ul.appendChild(li);
      });
    }
  }

  // Load notifications when page loads
  loadNotifications();
});

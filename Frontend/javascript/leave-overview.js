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

  async function loadLeaveOverview() {
    if (!username) {
      console.log('No username found, using sample data');
      loadSampleData();
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/leave/${username}`);
      
      if (response.ok) {
        const leaveData = await response.json();
        updateLeaveOverview(leaveData);
      } else {
        console.log('No leave data found, using sample data');
        loadSampleData();
      }
    } catch (error) {
      console.error('Error loading leave overview:', error);
      loadSampleData();
    }
  }

  function loadSampleData() {
    const sampleData = {
      totalLeaves: 30,
      usedLeaves: 12,
      remainingLeaves: 18,
      leaveHistory: [
        {
          leaveType: 'Annual Leave',
          startDate: '2025-07-01',
          endDate: '2025-07-05',
          reason: 'Family Trip',
          status: 'Approved'
        },
        {
          leaveType: 'Sick Leave',
          startDate: '2025-06-15',
          endDate: '2025-06-17',
          reason: 'Flu',
          status: 'Approved'
        },
        {
          leaveType: 'Casual Leave',
          startDate: '2025-05-10',
          endDate: '2025-05-11',
          reason: 'Personal Work',
          status: 'Rejected'
        }
      ]
    };
    updateLeaveOverview(sampleData);
  }

  function updateLeaveOverview(data) {
    // Update balance section
    const totalLeaves = document.querySelector('.card:nth-child(1) p');
    const usedLeaves = document.querySelector('.card:nth-child(2) p');
    const remainingLeaves = document.querySelector('.card:nth-child(3) p');

    if (totalLeaves) totalLeaves.textContent = data.totalLeaves || 30;
    if (usedLeaves) usedLeaves.textContent = data.usedLeaves || 0;
    if (remainingLeaves) remainingLeaves.textContent = data.remainingLeaves || 30;

    // Update history table
    const tbody = document.querySelector('tbody');
    if (tbody && data.leaveHistory) {
      tbody.innerHTML = '';
      
      data.leaveHistory.forEach(leave => {
        const row = tbody.insertRow();
        
        row.insertCell(0).textContent = leave.leaveType;
        row.insertCell(1).textContent = leave.startDate;
        row.insertCell(2).textContent = leave.endDate;
        row.insertCell(3).textContent = leave.reason;
        
        const statusCell = row.insertCell(4);
        statusCell.textContent = leave.status;
        
        // Color code the status
        switch(leave.status.toLowerCase()) {
          case 'approved':
            statusCell.style.color = 'green';
            statusCell.style.fontWeight = 'bold';
            break;
          case 'rejected':
            statusCell.style.color = 'red';
            statusCell.style.fontWeight = 'bold';
            break;
          case 'pending':
            statusCell.style.color = 'orange';
            statusCell.style.fontWeight = 'bold';
            break;
        }
      });
    }
  }

  // Load leave overview when page loads
  loadLeaveOverview();
});

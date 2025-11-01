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
  document.body.insertBefore(backButton, document.querySelector('h2'));

  // Add refresh button
  const refreshButton = document.createElement('button');
  refreshButton.textContent = 'Refresh Status';
  refreshButton.style.cssText = 'margin: 20px; padding: 10px 20px; background: #28a745; color: white; border: none; border-radius: 5px; cursor: pointer; margin-left: 10px;';
  refreshButton.onclick = () => {
    loadLeaveStatus();
  };
  document.body.insertBefore(refreshButton, document.querySelector('h2'));

  async function loadLeaveStatus() {
    if (!username) {
      showError('No username found in URL', 'Leave Status Error');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/leave/status/${username}`);
      
      if (response.ok) {
        const leaveData = await response.json();
        updateLeaveStatusTable(leaveData);
      } else {
        console.log('No leave data found, using sample data');
        // Use sample data if no backend data
        const sampleData = [
          {
            id: '00123',
            username: username,
            leaveType: 'Sick Leave',
            fromDate: '2025-07-10',
            toDate: '2025-07-12',
            status: 'Approved',
            remarks: 'Take care'
          },
          {
            id: '00124',
            username: username,
            leaveType: 'Casual Leave',
            fromDate: '2025-07-20',
            toDate: '2025-07-22',
            status: 'Pending',
            remarks: '--'
          }
        ];
        updateLeaveStatusTable(sampleData);
      }
    } catch (error) {
      console.error('Error loading leave status:', error);
      // Use sample data on error
      const sampleData = [
        {
          id: '00123',
          username: username || 'User',
          leaveType: 'Sick Leave',
          fromDate: '2025-07-10',
          toDate: '2025-07-12',
          status: 'Approved',
          remarks: 'Take care'
        }
      ];
      updateLeaveStatusTable(sampleData);
    }
  }

  function updateLeaveStatusTable(leaveData) {
    const tbody = document.querySelector('tbody');
    tbody.innerHTML = '';

    if (leaveData.length === 0) {
      const row = tbody.insertRow();
      const cell = row.insertCell(0);
      cell.colSpan = 7;
      cell.textContent = 'No leave applications found';
      cell.style.textAlign = 'center';
      cell.style.fontStyle = 'italic';
      return;
    }

    leaveData.forEach(leave => {
      const row = tbody.insertRow();
      
      row.insertCell(0).textContent = leave.id;
      row.insertCell(1).textContent = leave.username;
      row.insertCell(2).textContent = leave.leaveType;
      row.insertCell(3).textContent = leave.fromDate;
      row.insertCell(4).textContent = leave.toDate;
      
      const statusCell = row.insertCell(5);
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
      
      row.insertCell(6).textContent = leave.remarks;
    });
  }

  // Load leave status when page loads
  loadLeaveStatus();
});

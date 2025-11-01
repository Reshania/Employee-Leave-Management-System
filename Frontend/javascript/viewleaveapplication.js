// Global variables
let currentUser = null;
let allApplications = [];
let filteredApplications = [];

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    setupEventListeners();
    loadApplications();
});

// Check if user is authenticated
function checkAuth() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user) {
        window.location.href = 'login.html';
        return;
    }
    
    currentUser = user;
    document.getElementById('currentUser').textContent = `${user.username} (${user.role})`;
}

// Setup event listeners
function setupEventListeners() {
    // Modal close button
    document.querySelector('.close').addEventListener('click', closeModal);
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === document.getElementById('action-modal')) {
            closeModal();
        }
    });
    
    // Form submission
    document.getElementById('action-form').addEventListener('submit', handleStatusUpdate);
}

// Load all leave applications
async function loadApplications() {
    try {
        let response;
        
        // Check if user is admin/manager to get all applications
        if (currentUser.role === 'admin' || currentUser.role === 'manager') {
            response = await fetch(`/api/leave/admin/all?username=${currentUser.username}`);
        } else {
            // Regular users can only see their own applications
            response = await fetch(`/api/leave/status/${currentUser.username}`);
        }
        
        if (!response.ok) {
            throw new Error('Failed to fetch applications');
        }
        
        allApplications = await response.json();
        filteredApplications = [...allApplications];
        displayApplications();
        updateStatistics();
        
    } catch (error) {
        console.error('Error loading applications:', error);
        showError('Failed to load applications');
        
        // Show sample data for demo purposes
        allApplications = getSampleData();
        filteredApplications = [...allApplications];
        displayApplications();
        updateStatistics();
    }
}

// Get sample data for demo purposes
function getSampleData() {
    return [
        {
            id: '00123',
            username: 'john.doe',
            email: 'john.doe@company.com',
            leaveType: 'Sick Leave',
            fromDate: '2025-07-10',
            toDate: '2025-07-12',
            reason: 'Flu',
            status: 'Approved',
            appliedDate: '2025-07-05T10:00:00.000Z',
            remarks: 'Take care',
            approvedBy: 'jane.smith',
            approvedDate: '2025-07-06T09:00:00.000Z'
        },
        {
            id: '00124',
            username: 'john.doe',
            email: 'john.doe@company.com',
            leaveType: 'Casual Leave',
            fromDate: '2025-07-20',
            toDate: '2025-07-22',
            reason: 'Personal Work',
            status: 'Pending',
            appliedDate: '2025-07-15T14:30:00.000Z',
            remarks: ''
        },
        {
            id: '00125',
            username: 'jane.smith',
            email: 'jane.smith@company.com',
            leaveType: 'Annual Leave',
            fromDate: '2025-08-01',
            toDate: '2025-08-05',
            reason: 'Family vacation',
            status: 'Pending',
            appliedDate: '2025-07-20T11:00:00.000Z',
            remarks: ''
        }
    ];
}

// Display applications
function displayApplications() {
    const container = document.getElementById('applications-list');
    
    if (filteredApplications.length === 0) {
        container.innerHTML = '<p class="no-applications">No applications found</p>';
        return;
    }
    
    container.innerHTML = filteredApplications.map(app => createApplicationCard(app)).join('');
}

// Create application card HTML
function createApplicationCard(application) {
    const statusClass = `status-${application.status.toLowerCase()}`;
    const statusText = application.status;
    
    let actionsHTML = '';
    if (currentUser.role === 'admin' || currentUser.role === 'manager') {
        if (application.status === 'Pending') {
            actionsHTML = `
                <div class="application-actions">
                    <button class="btn btn-success" onclick="openActionModal('${application.id}', 'approve')">
                        Approve
                    </button>
                    <button class="btn btn-danger" onclick="openActionModal('${application.id}', 'reject')">
                        Reject
                    </button>
                </div>
            `;
        } else {
            actionsHTML = `
                <div class="application-actions">
                    <span class="detail-label">Approved by: ${application.approvedBy || 'N/A'}</span>
                    <span class="detail-label">Date: ${application.approvedDate ? new Date(application.approvedDate).toLocaleDateString() : 'N/A'}</span>
                </div>
            `;
        }
    } else {
        // Regular users can only view their applications
        if (application.username !== currentUser.username) {
            return ''; // Don't show other users' applications
        }
    }
    
    return `
        <div class="application-card">
            <div class="application-header">
                <span class="application-id">#${application.id}</span>
                <span class="status-badge ${statusClass}">${statusText}</span>
            </div>
            <div class="application-details">
                <div class="detail-item">
                    <span class="detail-label">Employee</span>
                    <span class="detail-value">${application.username}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Leave Type</span>
                    <span class="detail-value">${application.leaveType}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">From Date</span>
                    <span class="detail-value">${new Date(application.fromDate).toLocaleDateString()}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">To Date</span>
                    <span class="detail-value">${new Date(application.toDate).toLocaleDateString()}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Reason</span>
                    <span class="detail-value">${application.reason}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Applied Date</span>
                    <span class="detail-value">${new Date(application.appliedDate).toLocaleDateString()}</span>
                </div>
                ${application.remarks ? `
                    <div class="detail-item">
                        <span class="detail-label">Remarks</span>
                        <span class="detail-value">${application.remarks}</span>
                    </div>
                ` : ''}
            </div>
            ${actionsHTML}
        </div>
    `;
}

// Filter applications by status
function filterApplications() {
    const statusFilter = document.getElementById('status-filter').value;
    
    if (statusFilter === 'all') {
        filteredApplications = [...allApplications];
    } else {
        filteredApplications = allApplications.filter(app => app.status === statusFilter);
    }
    
    displayApplications();
}

// Refresh applications
function refreshApplications() {
    loadApplications();
}

// Open action modal for approve/reject
function openActionModal(applicationId, action) {
    const modal = document.getElementById('action-modal');
    const statusSelect = document.getElementById('action-status');
    const applicationIdInput = document.getElementById('application-id');
    
    applicationIdInput.value = applicationId;
    
    if (action === 'approve') {
        statusSelect.value = 'Approved';
    } else if (action === 'reject') {
        statusSelect.value = 'Rejected';
    }
    
    modal.style.display = 'block';
}

// Close modal
function closeModal() {
    document.getElementById('action-modal').style.display = 'none';
    document.getElementById('action-form').reset();
}

// Handle status update form submission
async function handleStatusUpdate(event) {
    event.preventDefault();
    
    const applicationId = document.getElementById('application-id').value;
    const status = document.getElementById('action-status').value;
    const remarks = document.getElementById('action-remarks').value;
    
    if (!status) {
        showError('Please select an action');
        return;
    }
    
    try {
        const response = await fetch('/api/leave/admin/update-status', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: currentUser.username,
                applicationId: applicationId,
                status: status,
                remarks: remarks
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to update application status');
        }
        
        const result = await response.json();
        showSuccess('Leave application status updated successfully');
        
        // Set flag to notify dashboard of update
        localStorage.setItem('lastAdminUpdate', Date.now().toString());
        
        // Close modal and refresh data
        closeModal();
        await loadApplications();
        
    } catch (error) {
        console.error('Error updating application status:', error);
        showError('Failed to update application status');
    }
}

// Update statistics
function updateStatistics() {
    const total = allApplications.length;
    const pending = allApplications.filter(app => app.status === 'Pending').length;
    const approved = allApplications.filter(app => app.status === 'Approved').length;
    const rejected = allApplications.filter(app => app.status === 'Rejected').length;
    
    document.getElementById('total-count').textContent = total;
    document.getElementById('pending-count').textContent = pending;
    document.getElementById('approved-count').textContent = approved;
    document.getElementById('rejected-count').textContent = rejected;
}

// Show success message
function showSuccess(message) {
    // Use the popup system
    PopupMessage.success(message, 'Success');
}

// Show error message
function showError(message) {
    // Use the popup system
    PopupMessage.error(message, 'Error');
}

// Navigation functions
function goToDashboard() {
    window.location.href = 'dashboard.html';
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// Refresh data periodically (every 30 seconds)
setInterval(() => {
    if (currentUser) {
        loadApplications();
    }
}, 30000);

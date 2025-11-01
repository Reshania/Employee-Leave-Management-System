// Global variables
let currentUser = null;
let allApplications = [];
let pendingApplications = [];

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    setupEventListeners();
});

// Check if user is authenticated and has admin/manager role
function checkAuth() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user) {
        window.location.href = 'login.html';
        return;
    }
    
    // Check if user has admin or manager role
    if (user.role !== 'admin' && user.role !== 'manager') {
        showError('Access denied. Admin or Manager role required.', 'Access Denied');
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 2000);
        return;
    }
    
    currentUser = user;
    document.getElementById('currentUser').textContent = `${user.username} (${user.role})`;
    
    // Load initial data
    loadPendingApplications();
    loadAllApplications();
    updateStatistics();
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

// Navigation between sections
function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active class from all nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(`${sectionName}-section`).classList.add('active');
    
    // Add active class to clicked button
    event.target.classList.add('active');
}

// Load pending applications
async function loadPendingApplications() {
    try {
        const response = await fetch(`/api/leave/admin/pending?username=${currentUser.username}`);
        if (!response.ok) {
            throw new Error('Failed to fetch pending applications');
        }
        
        pendingApplications = await response.json();
        displayPendingApplications();
    } catch (error) {
        console.error('Error loading pending applications:', error);
        showError('Failed to load pending applications');
    }
}

// Load all applications
async function loadAllApplications() {
    try {
        const response = await fetch(`/api/leave/admin/all?username=${currentUser.username}`);
        if (!response.ok) {
            throw new Error('Failed to fetch all applications');
        }
        
        allApplications = await response.json();
        displayAllApplications();
        updateStatistics();
    } catch (error) {
        console.error('Error loading all applications:', error);
        showError('Failed to load all applications');
    }
}

// Display pending applications
function displayPendingApplications() {
    const container = document.getElementById('pending-applications');
    
    if (pendingApplications.length === 0) {
        container.innerHTML = '<p class="no-applications">No pending applications</p>';
        return;
    }
    
    container.innerHTML = pendingApplications.map(app => createApplicationCard(app, true)).join('');
}

// Display all applications
function displayAllApplications() {
    const container = document.getElementById('all-applications');
    
    if (allApplications.length === 0) {
        container.innerHTML = '<p class="no-applications">No applications found</p>';
        return;
    }
    
    container.innerHTML = allApplications.map(app => createApplicationCard(app, false)).join('');
}

// Create application card HTML
function createApplicationCard(application, showActions = true) {
    const statusClass = `status-${application.status.toLowerCase()}`;
    const statusText = application.status;
    
    let actionsHTML = '';
    if (showActions && application.status === 'Pending') {
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
    } else if (application.status !== 'Pending') {
        actionsHTML = `
            <div class="application-actions">
                <span class="detail-label">Approved by: ${application.approvedBy || 'N/A'}</span>
                <span class="detail-label">Date: ${application.approvedDate ? new Date(application.approvedDate).toLocaleDateString() : 'N/A'}</span>
            </div>
        `;
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
        await loadPendingApplications();
        await loadAllApplications();
        
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
    
    document.getElementById('total-applications').textContent = total;
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

// Logout function
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

// Refresh data periodically (every 30 seconds)
setInterval(() => {
    if (currentUser) {
        loadPendingApplications();
        loadAllApplications();
    }
}, 30000);

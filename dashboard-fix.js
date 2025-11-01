// Direct dashboard fix - run this in browser console
console.log('🔧 Dashboard Fix Starting...');

// Function to directly update dashboard with current data
async function fixDashboard() {
    try {
        console.log('📡 Fetching leave data...');
        const response = await fetch('http://localhost:3000/api/leave/Reshania?t=' + Date.now());
        const data = await response.json();
        
        console.log('📊 Received data:', data);
        
        // Update sick leave
        const sickUsed = document.getElementById('sick-used');
        const sickRemaining = document.getElementById('sick-remaining');
        if (sickUsed) {
            sickUsed.textContent = data.sickLeaveUsed || 0;
            console.log('✅ Updated sick-used to:', data.sickLeaveUsed);
        }
        if (sickRemaining) {
            sickRemaining.textContent = Math.max(0, 12 - (data.sickLeaveUsed || 0));
            console.log('✅ Updated sick-remaining to:', Math.max(0, 12 - (data.sickLeaveUsed || 0)));
        }
        
        // Update casual leave
        const casualUsed = document.getElementById('casual-used');
        const casualRemaining = document.getElementById('casual-remaining');
        if (casualUsed) {
            casualUsed.textContent = data.casualLeaveUsed || 0;
            console.log('✅ Updated casual-used to:', data.casualLeaveUsed);
        }
        if (casualRemaining) {
            casualRemaining.textContent = Math.max(0, 12 - (data.casualLeaveUsed || 0));
            console.log('✅ Updated casual-remaining to:', Math.max(0, 12 - (data.casualLeaveUsed || 0)));
        }
        
        // Update annual leave
        const annualUsed = document.getElementById('annual-used');
        const annualRemaining = document.getElementById('annual-remaining');
        if (annualUsed) {
            annualUsed.textContent = data.annualLeaveUsed || 0;
            console.log('✅ Updated annual-used to:', data.annualLeaveUsed);
        }
        if (annualRemaining) {
            annualRemaining.textContent = Math.max(0, 6 - (data.annualLeaveUsed || 0));
            console.log('✅ Updated annual-remaining to:', Math.max(0, 6 - (data.annualLeaveUsed || 0)));
        }
        
        // Update maternity leave
        const maternityUsed = document.getElementById('maternity-used');
        const maternityRemaining = document.getElementById('maternity-remaining');
        if (maternityUsed) {
            maternityUsed.textContent = data.maternityLeaveUsed || 0;
            console.log('✅ Updated maternity-used to:', data.maternityLeaveUsed);
        }
        if (maternityRemaining) {
            maternityRemaining.textContent = Math.max(0, 365 - (data.maternityLeaveUsed || 0));
            console.log('✅ Updated maternity-remaining to:', Math.max(0, 365 - (data.maternityLeaveUsed || 0)));
        }
        
        // Update pending requests
        const pendingRequests = document.getElementById('pending-requests');
        if (pendingRequests) {
            pendingRequests.textContent = data.pendingRequests || 0;
            console.log('✅ Updated pending-requests to:', data.pendingRequests);
        }
        
        console.log('🎉 Dashboard fix completed successfully!');
        
    } catch (error) {
        console.error('❌ Error fixing dashboard:', error);
    }
}

// Run the fix
fixDashboard();

// Also make it available globally
window.fixDashboard = fixDashboard;

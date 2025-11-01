// DIRECT DASHBOARD FIX - Run this in your main dashboard console

console.log('🔧 Starting direct dashboard fix...');

// Function to find and update elements
function updateDashboard() {
    console.log('📡 Fetching leave data...');
    
    fetch('http://localhost:3000/api/leave/Reshania?t=' + Date.now())
        .then(response => response.json())
        .then(data => {
            console.log('📊 Data received:', data);
            
            // Try different possible element IDs
            const possibleIds = [
                'sick-used', 'sick-remaining',
                'casual-used', 'casual-remaining', 
                'annual-used', 'annual-remaining',
                'pending-requests'
            ];
            
            // Check which elements exist
            possibleIds.forEach(id => {
                const element = document.getElementById(id);
                if (element) {
                    console.log(`✅ Found element: ${id} = "${element.textContent}"`);
                } else {
                    console.log(`❌ Missing element: ${id}`);
                }
            });
            
            // Update sick leave
            const sickUsed = document.getElementById('sick-used');
            const sickRemaining = document.getElementById('sick-remaining');
            
            if (sickUsed) {
                sickUsed.textContent = data.sickLeaveUsed || 0;
                console.log(`✅ Updated sick-used to: ${data.sickLeaveUsed}`);
            } else {
                console.log('❌ sick-used element not found');
            }
            
            if (sickRemaining) {
                sickRemaining.textContent = Math.max(0, 12 - (data.sickLeaveUsed || 0));
                console.log(`✅ Updated sick-remaining to: ${Math.max(0, 12 - (data.sickLeaveUsed || 0))}`);
            } else {
                console.log('❌ sick-remaining element not found');
            }
            
            // Update casual leave
            const casualUsed = document.getElementById('casual-used');
            const casualRemaining = document.getElementById('casual-remaining');
            
            if (casualUsed) {
                casualUsed.textContent = data.casualLeaveUsed || 0;
                console.log(`✅ Updated casual-used to: ${data.casualLeaveUsed}`);
            }
            
            if (casualRemaining) {
                casualRemaining.textContent = Math.max(0, 12 - (data.casualLeaveUsed || 0));
                console.log(`✅ Updated casual-remaining to: ${Math.max(0, 12 - (data.casualLeaveUsed || 0))}`);
            }
            
            // Update annual leave
            const annualUsed = document.getElementById('annual-used');
            const annualRemaining = document.getElementById('annual-remaining');
            
            if (annualUsed) {
                annualUsed.textContent = data.annualLeaveUsed || 0;
                console.log(`✅ Updated annual-used to: ${data.annualLeaveUsed}`);
            }
            
            if (annualRemaining) {
                annualRemaining.textContent = Math.max(0, 6 - (data.annualLeaveUsed || 0));
                console.log(`✅ Updated annual-remaining to: ${Math.max(0, 6 - (data.annualLeaveUsed || 0))}`);
            }
            
            // Update pending requests
            const pendingRequests = document.getElementById('pending-requests');
            if (pendingRequests) {
                pendingRequests.textContent = data.pendingRequests || 0;
                console.log(`✅ Updated pending-requests to: ${data.pendingRequests}`);
            }
            
            console.log('🎉 Dashboard update completed!');
            
        })
        .catch(error => {
            console.error('❌ Error:', error);
        });
}

// Run the update
updateDashboard();

// Make it available globally
window.updateDashboard = updateDashboard;

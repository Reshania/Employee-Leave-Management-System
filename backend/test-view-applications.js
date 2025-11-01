// Test script to verify view leave applications functionality
import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000';

async function testViewApplications() {
  console.log('Testing View Leave Applications Functionality...\n');

  try {
    // Test 1: Get all leave applications (admin access)
    console.log('Test 1: Getting all leave applications as admin...');
    const response1 = await fetch(`${BASE_URL}/api/leave/admin/all?username=admin.user`);
    const data1 = await response1.json();
    console.log('Response:', response1.status, data1);
    console.log('');

    // Test 2: Get pending applications (admin access)
    console.log('Test 2: Getting pending applications as admin...');
    const response2 = await fetch(`${BASE_URL}/api/leave/admin/pending?username=admin.user`);
    const data2 = await response2.json();
    console.log('Response:', response2.status, data2);
    console.log('');

    // Test 3: Get user's own leave applications (regular user)
    console.log('Test 3: Getting user\'s own leave applications...');
    const response3 = await fetch(`${BASE_URL}/api/leave/status/john.doe`);
    const data3 = await response3.json();
    console.log('Response:', response3.status, data3);
    console.log('');

    // Test 4: Test unauthorized access to admin endpoints
    console.log('Test 4: Testing unauthorized access to admin endpoints...');
    const response4 = await fetch(`${BASE_URL}/api/leave/admin/all?username=john.doe`);
    const data4 = await response4.json();
    console.log('Response:', response4.status, data4);
    console.log('');

    // Test 5: Update leave application status (admin action)
    console.log('Test 5: Updating leave application status...');
    const response5 = await fetch(`${BASE_URL}/api/leave/admin/update-status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'admin.user',
        applicationId: '00125',
        status: 'Approved',
        remarks: 'Approved by admin from view applications page'
      })
    });
    const data5 = await response5.json();
    console.log('Response:', response5.status, data5);
    console.log('');

    // Test 6: Verify the update was applied
    console.log('Test 6: Verifying the update was applied...');
    const response6 = await fetch(`${BASE_URL}/api/leave/admin/all?username=admin.user`);
    const data6 = await response6.json();
    const updatedApp = data6.find(app => app.id === '00125');
    console.log('Updated application:', updatedApp);
    console.log('');

  } catch (error) {
    console.error('Error during testing:', error);
  }
}

// Run the tests
testViewApplications();

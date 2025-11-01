// Test file to verify admin functionality
import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000';

async function testAdminFunctionality() {
  console.log('Testing Admin Functionality...\n');

  try {
    // Test 1: Get all leave applications (admin access)
    console.log('Test 1: Getting all leave applications...');
    const response1 = await fetch(`${BASE_URL}/api/leave/admin/all?username=admin.user`);
    const data1 = await response1.json();
    console.log('Response:', response1.status, data1);
    console.log('');

    // Test 2: Get pending applications (admin access)
    console.log('Test 2: Getting pending applications...');
    const response2 = await fetch(`${BASE_URL}/api/leave/admin/pending?username=admin.user`);
    const data2 = await response2.json();
    console.log('Response:', response2.status, data2);
    console.log('');

    // Test 3: Update leave application status (approve)
    console.log('Test 3: Approving a leave application...');
    const response3 = await fetch(`${BASE_URL}/api/leave/admin/update-status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'admin.user',
        applicationId: '00124',
        status: 'Approved',
        remarks: 'Approved by admin'
      })
    });
    const data3 = await response3.json();
    console.log('Response:', response3.status, data3);
    console.log('');

    // Test 4: Get all applications again to see the update
    console.log('Test 4: Getting all applications after update...');
    const response4 = await fetch(`${BASE_URL}/api/leave/admin/all?username=admin.user`);
    const data4 = await response4.json();
    console.log('Response:', response4.status, data4);
    console.log('');

    // Test 5: Test unauthorized access (regular employee)
    console.log('Test 5: Testing unauthorized access...');
    const response5 = await fetch(`${BASE_URL}/api/leave/admin/all?username=john.doe`);
    const data5 = await response5.json();
    console.log('Response:', response5.status, data5);
    console.log('');

  } catch (error) {
    console.error('Error during testing:', error);
  }
}

// Run the tests
testAdminFunctionality();

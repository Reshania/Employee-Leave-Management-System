// Test script to verify new user registration creates leave data
import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000';

async function testNewUserRegistration() {
  console.log('Testing New User Registration and Leave Data Creation...\n');

  try {
    // Test 1: Register a new user
    console.log('Test 1: Registering a new user...');
    const newUser = {
      username: 'test.user',
      email: 'test.user@company.com',
      password: 'testpassword123',
      department: 'Testing',
      designation: 'Test Engineer',
      contact: '+1-555-9999'
    };

    const response1 = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newUser)
    });

    const result1 = await response1.json();
    console.log('Registration Response:', response1.status, result1);
    console.log('');

    if (response1.ok) {
      // Test 2: Check if leave data was created
      console.log('Test 2: Checking if leave data was created...');
      const response2 = await fetch(`${BASE_URL}/api/leave/${newUser.username}`);
      const leaveData = await response2.json();
      console.log('Leave Data Response:', response2.status, leaveData);
      console.log('');

      // Test 3: Verify the leave data structure
      console.log('Test 3: Verifying leave data structure...');
      if (leaveData.username === newUser.username &&
          leaveData.totalLeaves === 30 &&
          leaveData.usedLeaves === 0 &&
          leaveData.remainingLeaves === 30 &&
          leaveData.pendingRequests === 0 &&
          leaveData.leaveStatus === 'Active') {
        console.log('✅ SUCCESS: Leave data created correctly for new user!');
      } else {
        console.log('❌ FAILED: Leave data structure is incorrect');
        console.log('Expected: username, totalLeaves: 30, usedLeaves: 0, remainingLeaves: 30, pendingRequests: 0, leaveStatus: Active');
        console.log('Actual:', leaveData);
      }
    } else {
      console.log('❌ FAILED: User registration failed');
    }

  } catch (error) {
    console.error('Error during testing:', error);
  }
}

// Run the tests
testNewUserRegistration();

import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000';

async function testBackend() {
  console.log('Testing ELMS Backend...\n');

  try {
    // Test 1: Check if server is running
    console.log('1. Testing server connection...');
    const response = await fetch(`${BASE_URL}/`);
    console.log(`   Server status: ${response.status} ${response.statusText}`);
    
    // Test 2: Test login endpoint
    console.log('\n2. Testing login endpoint...');
    const loginResponse = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'demo', password: 'password123' })
    });
    const loginResult = await loginResponse.json();
    console.log(`   Login response: ${loginResponse.status} - ${loginResult.message}`);
    
    // Test 3: Test leave data endpoint
    console.log('\n3. Testing leave data endpoint...');
    const leaveResponse = await fetch(`${BASE_URL}/api/leave/demo`);
    if (leaveResponse.ok) {
      const leaveData = await leaveResponse.json();
      console.log(`   Leave data for demo user:`, leaveData);
    } else {
      console.log(`   Leave data error: ${leaveResponse.status} ${leaveResponse.statusText}`);
    }
    
    // Test 4: Test profile endpoint
    console.log('\n4. Testing profile endpoint...');
    const profileResponse = await fetch(`${BASE_URL}/profile/demo`);
    if (profileResponse.ok) {
      const profileData = await profileResponse.json();
      console.log(`   Profile data for demo user:`, profileData);
    } else {
      console.log(`   Profile error: ${profileResponse.status} ${profileResponse.statusText}`);
    }
    
    // Test 5: Test notifications endpoint
    console.log('\n5. Testing notifications endpoint...');
    const notifResponse = await fetch(`${BASE_URL}/api/notifications/demo`);
    if (notifResponse.ok) {
      const notifData = await notifResponse.json();
      console.log(`   Notifications for demo user:`, notifData);
    } else {
      console.log(`   Notifications error: ${notifResponse.status} ${notifResponse.statusText}`);
    }

    console.log('\n✅ Backend testing completed!');
    
  } catch (error) {
    console.error('\n❌ Backend testing failed:', error.message);
    console.log('\nMake sure the backend server is running with: npm start');
  }
}

testBackend();

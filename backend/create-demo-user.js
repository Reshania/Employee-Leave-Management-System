import bcrypt from 'bcrypt';
import fs from 'fs';

async function createDemoUser() {
  const password = 'password123';
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const demoUser = {
    "designation": "Demo User",
    "contact": "+1-555-0000",
    "username": "demo",
    "email": "demo@company.com",
    "password": hashedPassword,
    "department": "Testing"
  };
  
  console.log('Demo user created:');
  console.log('Username: demo');
  console.log('Password: password123');
  console.log('Hashed password:', hashedPassword);
  
  // Read existing users
  let users = [];
  try {
    const data = fs.readFileSync('users.json', 'utf8');
    users = JSON.parse(data);
  } catch (error) {
    console.log('No existing users.json found, creating new file');
  }
  
  // Check if demo user already exists
  const existingUserIndex = users.findIndex(u => u.username === 'demo');
  if (existingUserIndex !== -1) {
    users[existingUserIndex] = demoUser;
    console.log('Updated existing demo user');
  } else {
    users.push(demoUser);
    console.log('Added new demo user');
  }
  
  // Save users
  fs.writeFileSync('users.json', JSON.stringify(users, null, 2));
  console.log('Users saved to users.json');
}

createDemoUser().catch(console.error);

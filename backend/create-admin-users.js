import bcrypt from 'bcrypt';
import fs from 'fs';

async function createAdminUsers() {
  const password = 'password123';
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const adminUsers = [
    {
      "designation": "System Administrator",
      "contact": "+1-555-0001",
      "role": "admin",
      "username": "admin.user",
      "email": "admin@company.com",
      "password": hashedPassword,
      "department": "Administration"
    },
    {
      "designation": "Department Manager",
      "contact": "+1-555-0002",
      "role": "manager",
      "username": "manager.user",
      "email": "manager@company.com",
      "password": hashedPassword,
      "department": "Management"
    }
  ];
  
  console.log('Admin users created:');
  console.log('Username: admin.user, Role: admin, Password: password123');
  console.log('Username: manager.user, Role: manager, Password: password123');
  
  // Read existing users
  let users = [];
  try {
    const data = fs.readFileSync('users.json', 'utf8');
    users = JSON.parse(data);
  } catch (error) {
    console.log('No existing users.json found, creating new file');
  }
  
  // Add admin users
  adminUsers.forEach(adminUser => {
    const existingUserIndex = users.findIndex(u => u.username === adminUser.username);
    if (existingUserIndex !== -1) {
      users[existingUserIndex] = adminUser;
      console.log(`Updated existing ${adminUser.role} user: ${adminUser.username}`);
    } else {
      users.push(adminUser);
      console.log(`Added new ${adminUser.role} user: ${adminUser.username}`);
    }
  });
  
  // Save users
  fs.writeFileSync('users.json', JSON.stringify(users, null, 2));
  console.log('Users saved to users.json');
}

createAdminUsers().catch(console.error);

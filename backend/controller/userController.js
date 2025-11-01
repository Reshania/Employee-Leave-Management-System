import bcrypt from 'bcrypt';
import { readUsers, saveUsers } from '../model/userModel.js';
import { createUserLeaveData } from '../model/leaveModel.js';

export async function registerUser(req, res) {
  const { username, email, password, department, designation, contact, gender } = req.body;

  if (!username || !email || !password || !department || !designation || !contact || !gender) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const users = readUsers();
  const userExists = users.find(
    (u) => u.email === email || u.username === username
  );

  if (userExists) {
    return res.status(409).json({ message: 'User already exists.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { 
      username, 
      email, 
      password: hashedPassword, 
      department, 
      designation, 
      contact,
      gender,
      role: 'employee' // Default role for new registrations
    };

    users.push(newUser);
    saveUsers(users);

    // Automatically create leave data for the new user
    createUserLeaveData(username);

    console.log(`New user registered: ${username} with leave data created`);
    return res.status(201).json({ 
      message: 'User registered successfully.',
      user: {
        username: newUser.username,
        email: newUser.email,
        department: newUser.department,
        designation: newUser.designation,
        gender: newUser.gender,
        role: newUser.role
      }
    });
  } catch (error) {
    console.error('Error during user registration:', error);
    return res.status(500).json({ message: 'Server error during registration.' });
  }
}
export async function loginUser(req, res) {
  const { username, password } = req.body;

  console.log('Login attempt for username:', username);

  if (!username || !password) {
    console.log('Missing username or password');
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  const users = readUsers();
  console.log('Total users in system:', users.length);
  
  const user = users.find((u) => u.username === username);

  if (!user) {
    console.log('User not found:', username);
    return res.status(404).json({ message: 'User not found.' });
  }

  console.log('User found, checking password...');

  try {
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      console.log('Password match successful for user:', username);
      // Return user information including role for frontend routing
      return res.status(200).json({ 
        message: 'Login successful.',
        role: user.role || 'employee',
        department: user.department,
        designation: user.designation,
        email: user.email,
        contact: user.contact,
        gender: user.gender || ''
      });
    } else {
      console.log('Password mismatch for user:', username);
      return res.status(401).json({ message: 'Incorrect password.' });
    }
  } catch (error) {
    console.error('Error comparing passwords:', error);
    return res.status(500).json({ message: 'Server error during login.' });
  }
}
export function getProfile(req, res) {
  const { username } = req.params;
  const users = readUsers();
  const user = users.find(u => u.username === username);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.json(user);
}


// Update profile
export function updateProfile(req, res) {
  const { username, email, department, designation, contact, gender } = req.body;
  console.log('Update profile request for:', username, 'gender:', gender);
  let users = readUsers();

  if (users.length === 0) {
    return res.status(404).json({ message: 'No users found' });
  }

  // Find the specific user by username
  const userIndex = users.findIndex(u => u.username === username);
  
  if (userIndex === -1) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Update the specific user
  users[userIndex] = {
    ...users[userIndex],
    username,
    email,
    department,
    designation,
    contact,
    ...(gender ? { gender } : {})
  };

  saveUsers(users);
  console.log('Updated user saved:', users[userIndex]);

  res.json({ message: 'Profile updated successfully', user: users[userIndex] });
}

// Get notifications
export function getNotifications(req, res) {
  const { username } = req.params;
  
  // Sample notifications - in a real app, these would come from a database
  const notifications = [
    'Your leave request from July 5–7 is pending approval.',
    'Company holiday on July 15 (Founder\'s Day).',
    'Update your profile with emergency contact info.',
    'New leave policy updates effective from next month.',
    'Your annual leave balance will reset on January 1st.'
  ];

  res.json(notifications);
}
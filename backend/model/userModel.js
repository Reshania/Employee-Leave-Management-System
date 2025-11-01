import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const USERS_FILE = path.join(__dirname, '..', 'users.json');

export function readUsers() {
  if (!fs.existsSync(USERS_FILE)) return [];
  const data = fs.readFileSync(USERS_FILE, 'utf8');
  let users = JSON.parse(data || '[]');

  // Ensure designation, contact, role, and gender exist
  let updated = false;
  users = users.map(u => {
    const needsUpdate = !u.hasOwnProperty('designation') || !u.hasOwnProperty('contact') || !u.hasOwnProperty('role') || !u.hasOwnProperty('gender');
    if (needsUpdate) {
      updated = true;
    }
    return {
      ...u,
      designation: u.designation || "",
      contact: u.contact || "",
      role: u.role || "employee", // Default role is employee
      gender: u.gender !== undefined ? u.gender : ""
    };
  });

  // Auto-save if we added missing fields
  if (updated) {
    saveUsers(users);
  }

  return users;
}

export function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

export function getUserByUsername(username) {
  const users = readUsers();
  return users.find(user => user.username === username);
}

export function isAdminOrManager(username) {
  const user = getUserByUsername(username);
  return user && (user.role === 'admin' || user.role === 'manager');
}

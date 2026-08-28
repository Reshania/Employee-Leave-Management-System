import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import Routes from './routes/userRoutes.js';
import leaveRoutes from './routes/leaveRoutes.js';
import { getNotifications } from './controller/userController.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendPath = path.join(__dirname, '..', 'Frontend');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.use('/api/leave', leaveRoutes);
app.get('/api/notifications/:username', getNotifications);

app.use('/api', Routes);

app.use(express.static(frontendPath));
app.use(express.static('public'));

app.get('/', (req, res) => {
   res.sendFile(path.join(frontendPath, 'html', 'index.html'));
});
app.get('/login', (req, res) => {
  res.sendFile(path.join(frontendPath, 'html', 'login.html'));
});
app.get('/register', (req, res) => {
  res.sendFile(path.join(frontendPath, 'html', 'register.html'));
});
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(frontendPath, 'html', 'dashboard.html'));
});


app.get('/applyleave', (req, res) => {
  res.sendFile(path.join(frontendPath, 'html', 'applyleave.html'));
});

app.get('/leave-overview', (req, res) => {
  res.sendFile(path.join(frontendPath, 'html', 'leave-overview.html'));
});

app.get('/leavestatus', (req, res) => {
  res.sendFile(path.join(frontendPath, 'html', 'leavestatus.html'));
});

app.get('/myprofile', (req, res) => {
  res.sendFile(path.join(frontendPath, 'html', 'myprofile.html'));
});

app.get('/notifications', (req, res) => {
  res.sendFile(path.join(frontendPath, 'html', 'notifications.html'));
});
app.get('/viewleaveapplication', (req, res) => {
  res.sendFile(path.join(frontendPath, 'html', 'viewleaveapplication.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

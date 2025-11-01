import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import Routes from './routes/userRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';
import leaveRoutes from './routes/leaveRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// API routes - specific paths first
app.use('/api/leave', leaveRoutes);
app.use('/api/notifications', Routes);

// User routes (including login and register) - general paths last
app.use('/', Routes);

// Serve static files
app.use(express.static('public'));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Login endpoint: http://localhost:${PORT}/login`);
  console.log(`Register endpoint: http://localhost:${PORT}/register`);
  console.log(`Leave API endpoint: http://localhost:${PORT}/api/leave`);
  console.log(`Notifications endpoint: http://localhost:${PORT}/api/notifications`);
});

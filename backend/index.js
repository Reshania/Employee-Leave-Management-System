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

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

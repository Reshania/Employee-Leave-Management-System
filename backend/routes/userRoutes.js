import express from 'express';
import { registerUser,loginUser, getProfile, updateProfile, getNotifications } from '../controller/userController.js';


const router = express.Router();

router.get('/profile/:username', getProfile);
router.put('/update-profile', updateProfile);
router.get('/notifications/:username', getNotifications);

router.post('/register', registerUser);
router.post('/login', loginUser);

export default router;

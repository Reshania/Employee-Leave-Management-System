import express from 'express';
import { fetchLeaveData, updateLeaveData, applyLeave, getLeaveStatus, getAllLeaveApplications, updateLeaveStatus, getPendingApplications } from '../controller/leaveController.js';

const router = express.Router();

router.get('/:username', fetchLeaveData);
router.post('/update', updateLeaveData);
router.post('/apply', applyLeave);
router.get('/status/:username', getLeaveStatus);

// Admin/Manager routes
router.get('/admin/all', getAllLeaveApplications);
router.get('/admin/pending', getPendingApplications);
router.post('/admin/update-status', updateLeaveStatus);

export default router;

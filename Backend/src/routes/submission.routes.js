import { Router } from 'express';
import { saveSubmission, getUserStats } from '../controllers/submission.controller.js';
import authUser from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/', authUser, saveSubmission);
router.get('/stats', authUser, getUserStats);

export default router;

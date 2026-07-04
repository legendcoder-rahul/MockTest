import { Router } from 'express';
import { sendMessage, getChats, getChatMessages } from '../controllers/chat.controller.js';
import authUser from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/message', authUser, sendMessage);
router.get('/', authUser, getChats);
router.get('/:chatId/messages', authUser, getChatMessages);

export default router;

import express from 'express';
import { getConversationHistory, saveMessage } from '../services/chatService.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const history = await getConversationHistory(req.user.id);
  res.render('chat', { title: 'Chat', history });
});

router.post('/message', async (req, res) => {
  const { message } = req.body;
  const response = await saveMessage(req.user.id, message);
  res.json(response);
});

export default router;

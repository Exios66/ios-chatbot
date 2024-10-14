import express from 'express';
import { getModels } from '../services/modelService.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const models = await getModels();
  res.render('index', { title: 'AI Chatbot Interface', models });
});

export default router;

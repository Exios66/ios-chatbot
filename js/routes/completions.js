import express from 'express';
import { generateCompletion } from '../services/completionService.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { prompt } = req.body;
  const completion = await generateCompletion(req.user.id, prompt);
  res.json(completion);
});

export default router;

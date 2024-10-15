import express from 'express';
import { generateResponse } from '../services/modelService.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { userId, message, provider, modelId } = req.body;

    // Validate required fields
    if (!userId || !message || !provider || !modelId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate userId (assuming it should be a non-empty string)
    if (typeof userId !== 'string' || userId.trim() === '') {
      return res.status(400).json({ error: 'Invalid userId' });
    }

    // Validate message (assuming it should be a non-empty string)
    if (typeof message !== 'string' || message.trim() === '') {
      return res.status(400).json({ error: 'Invalid message' });
    }

    // Validate provider (assuming it should be a non-empty string)
    if (typeof provider !== 'string' || provider.trim() === '') {
      return res.status(400).json({ error: 'Invalid provider' });
    }

    // Validate modelId (assuming it should be a non-empty string)
    if (typeof modelId !== 'string' || modelId.trim() === '') {
      return res.status(400).json({ error: 'Invalid modelId' });
    }

    const response = await generateResponse(message, provider, modelId);
    res.json({ response });
  } catch (error) {
    console.error('Error generating response:', error);
    if (error.message.includes('Network error')) {
      res.status(503).json({ error: 'Service temporarily unavailable. Please try again later.' });
    } else if (error.message.includes('HTTP error')) {
      res.status(502).json({ error: 'Unexpected response from the AI service. Please try again.' });
    } else {
      res.status(500).json({ error: 'An unexpected error occurred while generating the response' });
    }
  }
});

export default router;

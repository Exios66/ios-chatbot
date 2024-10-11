import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

import debug from 'debug';

const app = express();
const port = process.env.PORT || 3000;

const debugApp = debug('chatbot-interface:app');
debugApp(`Express app initialized on port ${port}`);

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

app.get('/api/models', async (req: Request, res: Response) => {
  try {
    // Debugging: Log the incoming request for the models endpoint
    console.debug('Received request for AI models', { method: req.method, url: req.url });

    // This is a mock response. In a real application, you'd fetch this data from your AI service.
    const models = {
      llama: ['Llama 7B', 'Llama 13B', 'Llama 30B'],
      openai: ['GPT-3.5 Turbo', 'GPT-4', 'Davinci'],
      openrouter: ['Openrouter Model A', 'Openrouter Model B', 'Openrouter Model C']
    };

    // Debugging: Log the response being sent
    console.debug('Sending response for AI models', { models });

    res.json(models);
  } catch (error) {
    // Error handling: Log the error and send a 500 response
    console.error('Error fetching AI models', { error: (error as Error).message });
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
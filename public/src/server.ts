import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

app.get('/api/models', (req, res) => {
  // This is a mock response. In a real application, you'd fetch this data from your AI service.
  res.json({
    llama: ['Llama 7B', 'Llama 13B', 'Llama 30B'],
    openai: ['GPT-3.5 Turbo', 'GPT-4', 'Davinci'],
    openrouter: ['Openrouter Model A', 'Openrouter Model B', 'Openrouter Model C']
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
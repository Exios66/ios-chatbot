import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import http from 'http';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/models', (req, res) => {
    // This is a mock response. In a real application, you'd fetch this data from your AI service.
    res.json({
        llama: ['Llama 7B', 'Llama 13B', 'Llama 30B'],
        openai: ['GPT-3.5 Turbo', 'GPT-4', 'Davinci'],
        openrouter: ['Openrouter Model A', 'Openrouter Model B', 'Openrouter Model C']
    });
});

app.get('/', (req, res) => {
    res.send('Welcome to the AI Chatbot Interface');
});

export function createServer() {
    return http.createServer(app);
}

// Export the Express app
export { app };

// Export the port number
export { port };

// Export other modules if needed
export { cors, path, dotenv };

// Start the server if this file is run directly
if (import.meta.url === `file://${__filename}`) {
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
}

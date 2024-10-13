import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Mock database for chat messages
const chatMessages = {};

app.get('/api/models', (req, res) => {
    // This is a mock response. In a real application, you'd fetch this data from your AI service.
    res.json({
        llama: ['Llama 7B', 'Llama 13B', 'Llama 30B'],
        openai: ['GPT-3.5 Turbo', 'GPT-4', 'Davinci'],
        openrouter: ['Openrouter Model A', 'Openrouter Model B', 'Openrouter Model C']
    });
});

app.get('/api/chat/history/:userId', (req, res) => {
    const userId = req.params.userId;
    res.json(chatMessages[userId] || []);
});

app.post('/api/chat/message', (req, res) => {
    const { userId, message } = req.body;
    if (!chatMessages[userId]) {
        chatMessages[userId] = [];
    }
    chatMessages[userId].push({ content: message, sender: 'user' });
    res.json({ success: true, message: 'Message saved successfully' });
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('chat message', (msg) => {
        console.log('Message received:', msg);
        io.emit('chat message', msg);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

export function createServer() {
    return server;
}

// Export the Express app
export { app };

// Export the port number
export { port };

// Export other modules if needed
export { cors, path, dotenv };

// Start the server if this file is run directly
if (import.meta.url === `file://${__filename}`) {
    server.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
}

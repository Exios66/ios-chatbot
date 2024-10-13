import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import axios from 'axios';

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

// In-memory storage
const users = [];
const chatMessages = {};
const userModels = {};
const userSettings = {};

// Model references
const modelReferences = {
    llama: ['Llama 7B', 'Llama 13B', 'Llama 30B'],
    openai: ['GPT-3.5 Turbo', 'GPT-4', 'Davinci'],
    anthropic: ['Claude-v1', 'Claude-instant-v1'],
    openrouter: ['OpenRouter Model A', 'OpenRouter Model B', 'OpenRouter Model C']
};

app.get('/api/models', (req, res) => {
    res.json(modelReferences);
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

app.post('/api/models/select', (req, res) => {
    const { userId, provider, modelId } = req.body;
    userModels[userId] = { provider, modelId };
    res.json({ success: true, message: 'Model selected successfully', model: modelId, provider });
});

app.post('/api/generate', async (req, res) => {
    const { userId, message, provider, modelId } = req.body;
    let response;

    try {
        switch (provider) {
            case 'llama':
                response = await generateLlamaResponse(message, modelId);
                break;
            case 'openai':
                response = await generateOpenAIResponse(message, modelId);
                break;
            case 'anthropic':
                response = await generateAnthropicResponse(message, modelId);
                break;
            case 'openrouter':
                response = await generateOpenRouterResponse(message, modelId);
                break;
            default:
                throw new Error('Invalid provider');
        }

        if (!chatMessages[userId]) {
            chatMessages[userId] = [];
        }
        chatMessages[userId].push({ content: response, sender: 'bot' });

        res.json({ success: true, message: response });
    } catch (error) {
        console.error('Error generating response:', error);
        res.status(500).json({ success: false, message: 'Error generating response' });
    }
});

async function generateLlamaResponse(message, model) {
    // Implement Llama API call here
    // This is a placeholder implementation
    return `Llama ${model} response: ${message}`;
}

async function generateOpenAIResponse(message, model) {
    const openaiApi = axios.create({
        baseURL: 'https://api.openai.com/v1',
        headers: { 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` }
    });

    const response = await openaiApi.post('/chat/completions', {
        model: model,
        messages: [{ role: 'user', content: message }]
    });

    return response.data.choices[0].message.content;
}

async function generateAnthropicResponse(message, model) {
    const anthropicApi = axios.create({
        baseURL: 'https://api.anthropic.com/v1',
        headers: { 'Authorization': `Bearer ${process.env.ANTHROPIC_API_KEY}` }
    });

    const response = await anthropicApi.post('/complete', {
        model: model,
        prompt: message,
        max_tokens_to_sample: 300
    });

    return response.data.completion;
}

async function generateOpenRouterResponse(message, model) {
    const openrouterApi = axios.create({
        baseURL: 'https://openrouter.ai/api/v1',
        headers: { 'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}` }
    });

    const response = await openrouterApi.post('/chat/completions', {
        model: model,
        messages: [{ role: 'user', content: message }]
    });

    return response.data.choices[0].message.content;
}

// User management endpoints
app.get('/api/users', (req, res) => {
    res.json(users);
});

app.post('/api/users', (req, res) => {
    const { username, email } = req.body;
    const newUser = { id: users.length + 1, username, email };
    users.push(newUser);
    res.json({ success: true, message: 'User added successfully', user: newUser });
});

app.put('/api/users/:id', (req, res) => {
    const { id } = req.params;
    const { username, email } = req.body;
    const userIndex = users.findIndex(user => user.id === parseInt(id));
    if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], username, email };
        res.json({ success: true, message: 'User updated successfully', user: users[userIndex] });
    } else {
        res.status(404).json({ success: false, message: 'User not found' });
    }
});

app.delete('/api/users/:id', (req, res) => {
    const { id } = req.params;
    const userIndex = users.findIndex(user => user.id === parseInt(id));
    if (userIndex !== -1) {
        users.splice(userIndex, 1);
        res.json({ success: true, message: 'User deleted successfully' });
    } else {
        res.status(404).json({ success: false, message: 'User not found' });
    }
});

// Settings endpoints
app.get('/api/settings/:userId', (req, res) => {
    const userId = req.params.userId;
    res.json(userSettings[userId] || {});
});

app.post('/api/settings/:userId', (req, res) => {
    const userId = req.params.userId;
    userSettings[userId] = req.body;
    res.json({ success: true, message: 'Settings saved successfully' });
});

// Admin endpoints
app.get('/api/admin/stats', (req, res) => {
    res.json({
        totalUsers: users.length,
        activeChats: Object.keys(chatMessages).length,
        serverUptime: process.uptime().toFixed(2) + ' seconds'
    });
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

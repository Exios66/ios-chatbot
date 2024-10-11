import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';
import chatbot from './src/chatbot';
import logger from './src/utils/logger';
import errorHandler from './src/middleware/errorHandler';

import debug from 'debug';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

const debugApp = debug('chatbot-interface:app');
debugApp(`Server is starting on port ${PORT}`);

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve index.html for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use(errorHandler);

io.on('connection', (socket) => {
    logger.info('New client connected', { socketId: socket.id });

    socket.on('chat message', async (message, callback) => {
        if (!message) {
            logger.warn('Received empty message', { socketId: socket.id });
            return callback({ error: 'Message cannot be empty.' });
        }

        try {
            logger.info('Message received:', { message, socketId: socket.id });

            // Simulate bot typing
            socket.emit('bot typing');

            // Get response from chatbot
            const response = await chatbot.getResponse(message);

            // Simulate delay before sending response
            setTimeout(() => {
                socket.emit('bot stop typing');
                callback({ response });
                io.emit('chat message', response);
            }, 1000 + Math.random() * 2000);
        } catch (error) {
            logger.error('Error processing chat message', { error: error.message, socketId: socket.id });
            callback({ error: 'An error occurred while processing your message.' });
        }
    });

    socket.on('typing', () => {
        socket.broadcast.emit('user typing');
    });

    socket.on('disconnect', () => {
        logger.info('Client disconnected', { socketId: socket.id });
    });

    socket.on('error', (error) => {
        logger.error('Socket error', { error: error.message, socketId: socket.id });
    });
});

server.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
});

// Handle uncaught exceptions with a more graceful shutdown
process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception', { error: error.message, stack: error.stack });
    // Optionally, perform cleanup tasks here before exiting
    process.exit(1);
});

// Handle unhandled promise rejections with improved logging
process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection', { reason: reason instanceof Error ? reason.message : reason, stack: reason instanceof Error ? reason.stack : null });
    // Optionally, consider whether to exit the process or not
});

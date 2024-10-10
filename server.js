const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const chatbot = require('./src/chatbot');
const logger = require('./src/utils/logger');
const errorHandler = require('./src/middleware/errorHandler');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

// Error handling middleware
app.use(errorHandler);

io.on('connection', (socket) => {
    logger.info('New client connected', { socketId: socket.id });

    socket.on('chat message', async (message) => {
        try {
            logger.info('Message received:', { message, socketId: socket.id });

            // Simulate bot typing
            socket.emit('bot typing');

            // Get response from chatbot
            const response = await chatbot.getResponse(message);

            // Simulate delay before sending response
            setTimeout(() => {
                socket.emit('bot stop typing');
                io.emit('chat message', response);
            }, 1000 + Math.random() * 2000);
        } catch (error) {
            logger.error('Error processing chat message', { error: error.message, socketId: socket.id });
            socket.emit('error', 'An error occurred while processing your message.');
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

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception', { error: error.message, stack: error.stack });
    process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection', { reason: reason.message, stack: reason.stack });
});

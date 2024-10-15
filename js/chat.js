import { saveMessage, getConversationHistory } from './services/chatService.js';
import { generateResponse } from './services/modelService.js';
import { getUserId, showErrorMessage } from './utils.js';

let socket, messageInput, chatContainer, sendButton;

export function initializeChat() {
    messageInput = document.getElementById('message-input');
    chatContainer = document.getElementById('chat-container');
    sendButton = document.getElementById('send-button');

    if (sendButton) {
        sendButton.addEventListener('click', handleSend);
    }

    if (messageInput) {
        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleSend();
            }
        });
    }

    // Initialize socket.io
    socket = io();

    socket.on('connect', () => {
        console.log('Connected to server');
    });

    socket.on('connect_error', (error) => {
        console.error('Connection error:', error);
        showErrorMessage('Unable to connect to the server. Please try again later.');
    });

    socket.on('chat message', (message) => {
        displayMessage(message, 'bot');
    });

    loadConversationHistory();
}

async function handleSend() {
    const message = messageInput.value.trim();
    if (message) {
        try {
            await sendMessage(message);
            messageInput.value = '';
        } catch (error) {
            console.error('Error sending message:', error);
            showErrorMessage('Failed to send message. Please try again.');
        }
    }
}

function displayMessage(message, sender) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender);
    messageElement.textContent = message;
    chatContainer.appendChild(messageElement);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

async function loadConversationHistory() {
    try {
        const history = await getConversationHistory(getUserId());
        history.forEach(message => {
            displayMessage(message.content, message.sender);
        });
    } catch (error) {
        console.error('Error loading conversation history:', error);
        showErrorMessage('Failed to load conversation history. Please refresh the page.');
    }
}

async function sendMessage(message) {
    try {
        const response = await saveMessage(getUserId(), message);
        displayMessage(message, 'user');
        
        if (socket && socket.connected) {
            socket.emit('chat message', message);
        } else {
            console.warn('Socket not connected. Message not sent to server.');
        }

        // Get the current model and provider
        const currentModel = localStorage.getItem('currentModel');
        const currentProvider = localStorage.getItem('currentProvider');

        if (currentModel && currentProvider) {
            const aiResponse = await generateResponse(message, currentProvider, currentModel);
            displayMessage(aiResponse, 'bot');
        } else {
            showErrorMessage('Please select a model before sending a message.');
        }
    } catch (error) {
        console.error('Error sending message:', error);
        showErrorMessage('Failed to send message. Please try again.');
    }
}

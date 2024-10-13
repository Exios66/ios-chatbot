import { saveMessage, getConversationHistory } from './services/chatService.js';
import { generateResponse } from './services/modelService.js';
import { getUserId, showErrorMessage } from './utils.js';

const socket = io();
let messageInput, chatContainer, sendButton;

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
    }
}

async function sendMessage(message) {
    try {
        const response = await saveMessage(getUserId(), message);
        displayMessage(message, 'user');
        socket.emit('chat message', message);

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

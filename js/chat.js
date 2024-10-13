import { saveMessage, getConversationHistory } from './services/chatService.js';

const socket = io();
let chatForm, messageInput, chatContainer;

export function initializeChat() {
    chatForm = document.getElementById('chat-form');
    messageInput = document.getElementById('message-input');
    chatContainer = document.getElementById('chat-container');

    if (chatForm) {
        chatForm.addEventListener('submit', handleSubmit);
    }

    socket.on('chat message', (message) => {
        displayMessage(message, 'bot');
    });

    loadConversationHistory();
}

async function handleSubmit(e) {
    e.preventDefault();
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

function getUserId() {
    // Implement this function to get the current user's ID
    // This could be stored in localStorage or retrieved from a global state
    return 'dummy-user-id';
}

async function sendMessage(message) {
    try {
        const response = await saveMessage(getUserId(), message);
        displayMessage(message, 'user');
        socket.emit('chat message', message);
    } catch (error) {
        console.error('Error sending message:', error);
        showErrorMessage('Failed to send message. Please try again.');
    }
}

function showErrorMessage(message) {
    // Implement this function to show error messages to the user
    alert(message);
}

const socket = io();
const chatBody = document.getElementById('chat-container'); // Updated to match advancedindex.html
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const typingIndicator = document.getElementById('typing-indicator');

function sendMessage() {
    const message = messageInput.value.trim();
    if (message) {
        addMessage(message, 'sent');
        socket.emit('chat message', message);
        messageInput.value = '';
        sendButton.disabled = true;
    }
}

function addMessage(message, type) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', type);
    messageElement.textContent = message;
    chatBody.appendChild(messageElement);
    chatBody.scrollTop = chatBody.scrollHeight;
}

messageInput.addEventListener('input', () => {
    sendButton.disabled = !messageInput.value.trim();
    socket.emit('typing');
});

sendButton.addEventListener('click', sendMessage);

messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !sendButton.disabled) {
        sendMessage();
    }
});

socket.on('chat message', (message) => {
    addMessage(message, 'received');
});

socket.on('bot typing', () => {
    typingIndicator.style.display = 'block';
});

socket.on('bot stop typing', () => {
    typingIndicator.style.display = 'none';
});

// Reconnection logic
socket.on('disconnect', () => {
    console.log('Disconnected from server');
});

socket.on('reconnect', () => {
    console.log('Reconnected to server');
});

socket.on('reconnect_error', () => {
    console.log('Reconnection failed');
});

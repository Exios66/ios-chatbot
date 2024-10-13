const socket = io();
const chatBody = document.getElementById('chat-container'); // Updated to match advancedindex.html
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const typingIndicator = document.getElementById('typing-indicator');

// Function to send a message
function sendMessage() {
    const message = messageInput.value.trim();
    if (message) {
        addMessage(message, 'sent');
        socket.emit('chat message', message);
        messageInput.value = '';
        sendButton.disabled = true; // Disable the send button after sending
    }
}

// Function to add a message to the chat
function addMessage(message, type) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', type);
    messageElement.textContent = message;
    chatBody.appendChild(messageElement);
    chatBody.scrollTop = chatBody.scrollHeight; // Scroll to the bottom of the chat
}

// Event listener for input changes in the message input
messageInput.addEventListener('input', () => {
    sendButton.disabled = !messageInput.value.trim(); // Enable/disable send button
    socket.emit('typing'); // Notify that the user is typing
});

// Event listener for send button click
sendButton.addEventListener('click', sendMessage);

// Event listener for pressing the Enter key
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !sendButton.disabled) {
        sendMessage(); // Send message on Enter key press
    }
});

// Socket event listener for receiving chat messages
socket.on('chat message', (message) => {
    addMessage(message, 'received'); // Add received message to chat
});

// Socket event listener for bot typing indicator
socket.on('bot typing', () => {
    typingIndicator.style.display = 'block'; // Show typing indicator
});

// Socket event listener for bot stop typing indicator
socket.on('bot stop typing', () => {
    typingIndicator.style.display = 'none'; // Hide typing indicator
});

// Reconnection logic
socket.on('disconnect', () => {
    console.log('Disconnected from server'); // Log disconnection
});

socket.on('reconnect', () => {
    console.log('Reconnected to server'); // Log reconnection
});

socket.on('reconnect_error', () => {
    console.log('Reconnection failed'); // Log reconnection failure
});

// Function to display error messages
function showErrorMessage(message) {
    const errorContainer = document.getElementById('error-container');
    errorContainer.textContent = message;
    errorContainer.style.display = 'block';
    setTimeout(() => {
        errorContainer.style.display = 'none';
    }, 5000);
}

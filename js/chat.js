const socket = io();
const chatForm = document.getElementById('chat-form');
const messageInput = document.getElementById('message-input');
const chatContainer = document.getElementById('chat-container');

chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const message = messageInput.value.trim();
  if (message) {
    try {
      const response = await saveMessage(getUserId(), message);
      displayMessage(response.message, 'user');
      socket.emit('chat message', response.message);
      messageInput.value = '';
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }
});

socket.on('chat message', (message) => {
  displayMessage(message, 'bot');
});

function displayMessage(message, sender) {
  const messageElement = document.createElement('div');
  messageElement.classList.add('message', sender);
  messageElement.textContent = message;
  chatContainer.appendChild(messageElement);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Load conversation history
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

loadConversationHistory();

function getUserId() {
  // Implement this function to get the current user's ID
  // This could be stored in localStorage or retrieved from a global state
}

// Update the sendMessage function to emit the message
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
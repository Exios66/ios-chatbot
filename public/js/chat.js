export function initializeChat() {
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');
    const chatContainer = document.getElementById('chat-container');

    sendButton.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    async function sendMessage() {
        const message = messageInput.value.trim();
        if (message === '') return;

        appendMessage(message, 'sent');
        messageInput.value = '';

        try {
            const response = await fetchAIResponse(message);
            appendMessage(response, 'received');
        } catch (error) {
            console.error('Error fetching AI response:', error);
            appendMessage('Sorry, there was an error processing your request.', 'error');
        }
    }

    function appendMessage(message, type) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', type, 'message-animation');
        messageElement.innerHTML = DOMPurify.sanitize(marked(message));
        chatContainer.appendChild(messageElement);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    async function fetchAIResponse(message) {
        const selectedModel = JSON.parse(localStorage.getItem('selectedModel'));
        if (!selectedModel) {
            throw new Error('No AI model selected');
        }

        // In a real application, this would be an API call to your backend
        // For now, we'll simulate a response
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(`AI response using ${selectedModel.model}: ${message}`);
            }, 1000);
        });
    }
}
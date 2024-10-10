document.addEventListener('DOMContentLoaded', function () {
    // Digital clock functionality
    const clockElement = document.getElementById('clock');
    setInterval(() => {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        clockElement.textContent = `${hours}:${minutes}:${seconds}`;
    }, 1000);

    // Theme toggle functionality
    const themeToggle = document.getElementById('theme-toggle');
    const themeStyle = document.getElementById('theme-style');
    const toggleIcon = document.getElementById('toggle-icon');

    themeToggle.addEventListener('click', () => {
        const currentTheme = themeStyle.getAttribute('href');
        const newTheme = currentTheme.includes('dark') ? 'styles/themes/light.css' : 'styles/themes/dark.css';
        themeStyle.setAttribute('href', newTheme);
        toggleIcon.textContent = newTheme.includes('dark') ? '🌙' : '☀️';
    });

    // Chat functionality
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');
    const chatContainer = document.getElementById('chat-container');

    sendButton.addEventListener('click', async () => {
        const message = messageInput.value;
        if (message.trim() === '') return;

        appendMessage(message, 'sent');
        messageInput.value = '';

        // Fetch response from APIs
        const response = await getChatResponse(message);

        appendMessage(response, 'received');
    });

    function appendMessage(message, type) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', type);
        messageElement.textContent = message;
        chatContainer.appendChild(messageElement);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    async function getChatResponse(message) {
        try {
            const openAiResponse = await axios.post('/api/openai', { message });
            return openAiResponse.data.reply;
        } catch (openAiError) {
            console.error('Error fetching response from OpenAI:', openAiError);
            try {
                const llamaResponse = await axios.post('/api/llama', { message });
                return llamaResponse.data.reply;
            } catch (llamaError) {
                console.error('Error fetching response from Llama API:', llamaError);
                return 'Sorry, there was an error processing your request.';
            }
        }
    }
});

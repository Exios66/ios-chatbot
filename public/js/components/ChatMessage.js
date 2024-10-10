import { formatDate } from '../utils/dateFormatter'; // Assuming dateFormatter.js is in utils

export default class ChatMessage {
    constructor(container, message, type = 'user', status = 'sent') {
        this.container = container;
        this.message = message;
        this.type = type;
        this.status = status;
        this.element = this.createElement();
        this.container.appendChild(this.element);
        this.applyAnimation();
    }

    createElement() {
        const element = document.createElement('div');
        element.classList.add('message');
        element.classList.add(this.type); // Add class based on message type
        element.innerHTML = `
            <div class="message-content">${this.message}</div>
            <div class="message-info">
                <span class="timestamp">${formatDate(new Date())}</span>
                <span class="status">${this.status}</span>
            </div>
        `;
        return element;
    }

    applyAnimation() {
        this.element.classList.add('sent-animation');
    }

    // Optional: Add methods for further interactivity
    updateStatus(newStatus) {
        this.status = newStatus;
        this.element.querySelector('.status').textContent = newStatus;
    }

    highlight() {
        this.element.classList.add('highlight');
    }

    removeHighlight() {
        this.element.classList.remove('highlight');
    }
}

// Usage Example
const chatContainer = document.querySelector('.chat-container');
const userMessage = new ChatMessage(chatContainer, 'Hello, how can I help you?', 'user', 'sent');
const botMessage = new ChatMessage(chatContainer, 'I am here to assist you!', 'bot', 'received');

// Optional: Update status
setTimeout(() => userMessage.updateStatus('read'), 2000);

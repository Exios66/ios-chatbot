export default class TypingIndicator {
    constructor(container) {
        this.container = container;
        this.element = this.createElement();
        this.container.appendChild(this.element);
    }

    createElement() {
        const element = document.createElement('div');
        element.classList.add('typing-indicator');
        element.textContent = 'Bot is typing...';
        element.style.display = 'none';
        return element;
    }

    show() {
        this.element.style.display = 'block';
        this.container.scrollTop = this.container.scrollHeight;
    }

    hide() {
        this.element.style.display = 'none';
    }
}

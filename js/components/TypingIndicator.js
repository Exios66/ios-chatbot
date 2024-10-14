export default class TypingIndicator {
    constructor(container, options = {}) {
        this.container = container;
        this.message = options.message || 'Bot is typing';
        this.timeout = options.timeout || 5000; // default timeout duration
        this.animationStyle = options.animationStyle || 'dots';
        this.element = this.createElement();
        this.container.appendChild(this.element);
        this.timeoutId = null;
        this.addEventListeners();
    }

    createElement() {
        const element = document.createElement('div');
        element.classList.add('typing-indicator');
        element.setAttribute('role', 'alert');
        element.innerHTML = `
            <span>${this.message}</span>
            ${this.animationStyle === 'dots' ? `<span class="dot">.</span><span class="dot">.</span><span class="dot">.</span>` : ''}
        `;
        element.style.display = 'none';
        return element;
    }

    show() {
        this.element.style.display = 'block';
        this.container.scrollTop = this.container.scrollHeight;
        if (this.animationStyle === 'dots') {
            this.startDotAnimation();
        }
        this.resetTimeout();
    }

    hide() {
        this.element.style.display = 'none';
        if (this.animationStyle === 'dots') {
            this.stopDotAnimation();
        }
        this.clearTimeout();
    }

    startDotAnimation() {
        const dots = this.element.querySelectorAll('.dot');
        let dotIndex = 0;
        this.dotInterval = setInterval(() => {
            dots.forEach((dot, index) => {
                dot.style.visibility = index <= dotIndex ? 'visible' : 'hidden';
            });
            dotIndex = (dotIndex + 1) % dots.length;
        }, 500);
    }

    stopDotAnimation() {
        clearInterval(this.dotInterval);
    }

    resetTimeout() {
        this.clearTimeout();
        this.timeoutId = setTimeout(() => {
            this.hide();
        }, this.timeout);
    }

    clearTimeout() {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }
    }

    addEventListeners() {
        document.addEventListener('userTyping', () => this.show());
        document.addEventListener('stopTyping', () => this.hide());
    }
}

// Function to toggle light mode
export function toggleLightMode() {
    const body = document.body;
    const icon = document.querySelector('.dark-mode-toggle i');
    const themeStylesheet = document.getElementById('theme-stylesheet');

    if (body.classList.contains('dark-mode')) {
        // Switch to light mode
        body.classList.remove('dark-mode');
        icon.classList.replace('fa-sun', 'fa-moon');
        themeStylesheet.href = '/styles/themes/light.css';
        localStorage.setItem('darkMode', 'false');
    } else {
        // Switch to dark mode
        body.classList.add('dark-mode');
        icon.classList.replace('fa-moon', 'fa-sun');
        themeStylesheet.href = '/styles/themes/dark.css';
        localStorage.setItem('darkMode', 'true');
    }
}

// Function to set initial mode based on user preference or system setting
export function setInitialMode() {
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    const storedTheme = localStorage.getItem('darkMode');

    if (storedTheme === 'true' || (storedTheme === null && prefersDarkScheme.matches)) {
        document.body.classList.add('dark-mode');
        document.querySelector('.dark-mode-toggle i').classList.replace('fa-moon', 'fa-sun');
        document.getElementById('theme-stylesheet').href = '/styles/themes/dark.css';
    } else {
        document.body.classList.remove('dark-mode');
        document.querySelector('.dark-mode-toggle i').classList.replace('fa-sun', 'fa-moon');
        document.getElementById('theme-stylesheet').href = '/styles/themes/light.css';
    }
}

// Function to update mode when system preference changes
export function handleSystemThemeChange(e) {
    if (e.matches) {
        document.body.classList.add('dark-mode');
        document.querySelector('.dark-mode-toggle i').classList.replace('fa-moon', 'fa-sun');
        document.getElementById('theme-stylesheet').href = '/styles/themes/dark.css';
    } else {
        document.body.classList.remove('dark-mode');
        document.querySelector('.dark-mode-toggle i').classList.replace('fa-sun', 'fa-moon');
        document.getElementById('theme-stylesheet').href = '/styles/themes/light.css';
    }
}
// Function to toggle theme
export function toggleTheme() {
    const body = document.body;
    const icon = document.querySelector('.dark-mode-toggle i');
    const themeStylesheet = document.getElementById('theme-stylesheet');

    if (body.classList.contains('dark-mode')) {
        // Switch to light mode
        body.classList.remove('dark-mode');
        icon.classList.replace('fa-sun', 'fa-moon');
        themeStylesheet.href = '/styles/themes/light.css';
        localStorage.setItem('theme', 'light');
    } else {
        // Switch to dark mode
        body.classList.add('dark-mode');
        icon.classList.replace('fa-moon', 'fa-sun');
        themeStylesheet.href = '/styles/themes/dark.css';
        localStorage.setItem('theme', 'dark');
    }
}

// Function to set initial theme based on user preference or system setting
export function setInitialTheme() {
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    const storedTheme = localStorage.getItem('theme');

    if (storedTheme === 'light') {
        document.body.classList.remove('dark-mode');
        document.querySelector('.dark-mode-toggle i').classList.replace('fa-sun', 'fa-moon');
        document.getElementById('theme-stylesheet').href = '/styles/themes/light.css';
    } else if (storedTheme === 'dark' || prefersDarkScheme.matches) {
        document.body.classList.add('dark-mode');
        document.querySelector('.dark-mode-toggle i').classList.replace('fa-moon', 'fa-sun');
        document.getElementById('theme-stylesheet').href = '/styles/themes/dark.css';
    }
}

// Function to update theme when system preference changes
export function handleSystemThemeChange(e) {
    if (localStorage.getItem('theme')) {
        // If user has explicitly set a theme, don't change it
        return;
    }

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
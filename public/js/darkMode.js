export function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const darkModeIcon = document.querySelector('.dark-mode-toggle i');
    const isDarkMode = document.body.classList.contains('dark-mode');
    
    if (isDarkMode) {
        darkModeIcon.classList.replace('fa-moon', 'fa-sun');
    } else {
        darkModeIcon.classList.replace('fa-sun', 'fa-moon');
    }
    
    localStorage.setItem('darkMode', isDarkMode);
    
    // Dispatch a custom event for other parts of the app to react to dark mode changes
    document.dispatchEvent(new CustomEvent('darkModeToggled', { detail: { isDarkMode } }));
}

// Initialize dark mode based on localStorage
export function initializeDarkMode() {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    if (darkMode) {
        document.body.classList.add('dark-mode');
        document.querySelector('.dark-mode-toggle i').classList.replace('fa-moon', 'fa-sun');
    }
}
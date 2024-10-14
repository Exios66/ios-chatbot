export function toggleDarkMode() {
    // Toggle the dark mode class on the body element
    const body = document.body;
    const darkModeIcon = document.querySelector('.dark-mode-toggle i');
    
    // Check if dark mode is currently enabled
    const isDarkMode = body.classList.toggle('dark-mode');
    
    // Update the icon based on the current mode
    if (isDarkMode) {
        darkModeIcon.classList.replace('fa-moon', 'fa-sun');
    } else {
        darkModeIcon.classList.replace('fa-sun', 'fa-moon');
    }
    
    // Store the current mode in localStorage
    localStorage.setItem('darkMode', isDarkMode);
    
    // Dispatch a custom event to notify other parts of the app about the mode change
    document.dispatchEvent(new CustomEvent('darkModeToggled', { detail: { isDarkMode } }));
}

// Initialize dark mode based on localStorage
export function initializeDarkMode() {
    // Retrieve the dark mode setting from localStorage
    const darkMode = localStorage.getItem('darkMode') === 'true';
    
    // If dark mode is enabled, apply the class and update the icon
    if (darkMode) {
        document.body.classList.add('dark-mode');
        const darkModeIcon = document.querySelector('.dark-mode-toggle i');
        darkModeIcon.classList.replace('fa-moon', 'fa-sun');
    } else {
        // Ensure the icon is set to moon if dark mode is not enabled
        const darkModeIcon = document.querySelector('.dark-mode-toggle i');
        darkModeIcon.classList.replace('fa-sun', 'fa-moon');
    }
}
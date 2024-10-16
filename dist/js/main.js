import { initNavigation, changeTab } from './navigation.js';
import { toggleTheme, setInitialTheme, handleSystemThemeChange } from './themeToggle.js';
import { selectModel, initializeModelSelection } from './modelSelection.js';
import { initializeChat } from './chat.js';
import { initializeSettings } from './settings.js';
import { initializeAdmin } from './admin.js';
import { initUI } from './ui.js';

function initializeApp() {
    setInitialTheme();
    initUI();
    initializeChat();
    initializeModelSelection();
    initializeSettings();
    initializeAdmin();
    initNavigation();
    
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', toggleTheme);
    }

    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', (e) => {
            const tab = e.target.closest('.tab-button').dataset.tab;
            if (tab) {
                changeTab(tab);
            }
        });
    });

    // Add event listener for system theme changes
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    prefersDarkScheme.addListener(handleSystemThemeChange);
}

document.addEventListener('DOMContentLoaded', initializeApp);

// Expose functions to the global window object for external access
window.changeTab = changeTab;
window.selectModel = selectModel;

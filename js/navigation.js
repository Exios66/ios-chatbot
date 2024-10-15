import { initializeModelSelection } from './modelSelection.js';

/**
 * Navigates to the specified page by updating the URL and the display of page elements.
 * @param {string} url - The URL to navigate to.
 */
export function navigateTo(url) {
    history.pushState(null, null, url);
    handleRoute();
}

/**
 * Handles the current route based on the URL.
 */
export function handleRoute() {
    const path = window.location.pathname;
    const page = path === '/' ? 'home' : path.slice(1);
    
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(p => p.style.display = 'none');

    // Show the selected tab content if it exists
    const selectedTab = document.getElementById(`${page}-tab`);
    if (selectedTab) {
        selectedTab.style.display = 'block';
    } else {
        console.error(`Tab not found: ${page}`);
        // Optionally, redirect to a 404 page or home page
        navigateTo('/');
        return;
    }

    // Update the active tab to reflect the current page
    updateActiveTab(page);

    // Initialize model selection if the model-selection page is active
    if (page === 'model-selection') {
        initializeModelSelection();
    }
}

/**
 * Changes the current tab to the specified tab and updates the URL.
 * @param {string} tab - The name of the tab to change to.
 */
export function changeTab(tab) {
    navigateTo(`/${tab === 'home' ? '' : tab}`);
}

/**
 * Updates the active tab's appearance based on the currently active tab.
 * @param {string} activeTab - The name of the currently active tab.
 */
export function updateActiveTab(activeTab) {
    const tabs = document.querySelectorAll('.tab-button');
    tabs.forEach(t => {
        // Add or remove the 'active' class based on the active tab
        t.classList.toggle('active', t.dataset.tab === activeTab);
    });
}

/**
 * Initializes the navigation system.
 */
export function initNavigation() {
    window.addEventListener('popstate', handleRoute);
    document.body.addEventListener('click', (e) => {
        if (e.target.matches('[data-link]')) {
            e.preventDefault();
            navigateTo(e.target.href);
        }
    });

    // Handle initial route
    handleRoute();
}

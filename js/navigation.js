import { initializeModelSelection } from './modelSelection.js';

/**
 * Navigates to the specified page by updating the display of page elements.
 * @param {string} page - The name of the page to navigate to.
 */
export function navigateTo(page) {
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(p => p.style.display = 'none');

    // Show the selected tab content if it exists
    const selectedTab = document.getElementById(`${page}-tab`);
    if (selectedTab) {
        selectedTab.style.display = 'block';
    } else {
        console.error(`Tab not found: ${page}`);
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
 * Changes the current tab to the specified tab.
 * @param {string} tab - The name of the tab to change to.
 */
export function changeTab(tab) {
    navigateTo(tab);
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

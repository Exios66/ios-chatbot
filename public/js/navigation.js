import { initializeModelSelection } from './modelSelection.js';

export function navigateTo(page) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(p => p.style.display = 'none');

    const selectedPage = document.getElementById(`${page}-page`);
    if (selectedPage) {
        selectedPage.style.display = 'block';
    } else {
        console.error(`Page not found: ${page}`);
        return;
    }

    updateActiveTab(page);

    if (page === 'model-selection') {
        initializeModelSelection();
    }
}

export function changeTab(tab) {
    navigateTo(tab);
}

export function updateActiveTab(activeTab) {
    const tabs = document.querySelectorAll('.tab-button');
    tabs.forEach(t => {
        if (t.dataset.tab === activeTab) {
            t.classList.add('active');
        } else {
            t.classList.remove('active');
        }
    });
}
import { getUserId } from './utils.js';

export function initializeSettings() {
    const settingsForm = document.getElementById('settings-form');
    if (settingsForm) {
        settingsForm.addEventListener('submit', handleSettingsSubmit);
        loadUserSettings();
    }
}

async function handleSettingsSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const settings = Object.fromEntries(formData.entries());
    settings.notifications = formData.get('notifications') === 'on';

    try {
        await saveUserSettings(settings);
        alert('Settings saved successfully!');
    } catch (error) {
        console.error('Error saving settings:', error);
        alert('Failed to save settings. Please try again.');
    }
}

async function loadUserSettings() {
    try {
        const userId = getUserId();
        const response = await fetch(`/api/settings/${userId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch user settings');
        }
        const settings = await response.json();
        populateSettingsForm(settings);
    } catch (error) {
        console.error('Error loading user settings:', error);
    }
}

function populateSettingsForm(settings) {
    document.getElementById('username').value = settings.username || '';
    document.getElementById('email').value = settings.email || '';
    document.getElementById('language').value = settings.language || 'en';
    document.getElementById('notifications').checked = settings.notifications || false;
}

async function saveUserSettings(settings) {
    const userId = getUserId();
    const response = await fetch(`/api/settings/${userId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
    });

    if (!response.ok) {
        throw new Error('Failed to save user settings');
    }

    return await response.json();
}

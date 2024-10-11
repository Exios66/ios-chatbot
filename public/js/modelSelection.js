export function selectModel(api) {
    const dropdowns = {
        llama: document.getElementById('llama-models'),
        openai: document.getElementById('openai-models'),
        openrouter: document.getElementById('openrouter-models')
    };
    const currentModelSpan = document.getElementById('current-model');

    Object.values(dropdowns).forEach(dropdown => {
        dropdown.parentElement.classList.remove('disabled');
    });

    const selectedValue = dropdowns[api].value;

    if (selectedValue) {
        Object.entries(dropdowns).forEach(([key, dropdown]) => {
            if (key !== api) {
                dropdown.parentElement.classList.add('disabled');
            }
        });

        currentModelSpan.textContent = selectedValue;
        localStorage.setItem('selectedModel', JSON.stringify({ api, model: selectedValue }));
    } else {
        currentModelSpan.textContent = 'None';
        localStorage.removeItem('selectedModel');
    }
}

export async function initializeModelSelection() {
    const models = await fetchModels();
    const dropdowns = {
        llama: document.getElementById('llama-models'),
        openai: document.getElementById('openai-models'),
        openrouter: document.getElementById('openrouter-models')
    };

    Object.entries(dropdowns).forEach(([api, dropdown]) => {
        populateDropdown(dropdown, models[api]);
    });

    const savedModel = JSON.parse(localStorage.getItem('selectedModel'));
    if (savedModel && savedModel.api && savedModel.model) {
        dropdowns[savedModel.api].value = savedModel.model;
        selectModel(savedModel.api);
    }
}

function populateDropdown(dropdown, options) {
    dropdown.innerHTML = '<option value="">Select a model</option>';
    options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option;
        optionElement.textContent = option;
        dropdown.appendChild(optionElement);
    });
}

async function fetchModels() {
    try {
        const response = await fetch('/api/models');
        if (!response.ok) {
            throw new Error('Failed to fetch models');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching models:', error);
        return {
            llama: ['Llama 7B', 'Llama 13B', 'Llama 30B'],
            openai: ['GPT-3.5 Turbo', 'GPT-4', 'Davinci'],
            openrouter: ['Openrouter Model A', 'Openrouter Model B', 'Openrouter Model C']
        };
    }
}
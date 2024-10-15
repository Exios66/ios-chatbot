import { getModels, selectModel as apiSelectModel } from './services/modelService.js';
import { getUserId, showErrorMessage, showSuccessMessage } from './utils.js';

const modelSelects = {
  llama: document.getElementById('llama-models'),
  openai: document.getElementById('openai-models'),
  anthropic: document.getElementById('anthropic-models'),
  openrouter: document.getElementById('openrouter-models')
};

const currentModelSpan = document.getElementById('current-model');

async function loadModels() {
  try {
    showLoadingIndicator(true);
    const models = await getModels();
    Object.entries(models).forEach(([provider, providerModels]) => {
      const select = modelSelects[provider];
      if (select) {
        select.innerHTML = ''; // Clear existing options
        providerModels.forEach(model => {
          const option = document.createElement('option');
          option.value = model;
          option.textContent = model;
          select.appendChild(option);
        });
      }
    });
    showLoadingIndicator(false);
  } catch (error) {
    console.error('Error loading models:', error);
    showErrorMessage('Failed to load models. Please check your internet connection and try again.');
    showLoadingIndicator(false);
  }
}

export function selectModel(provider) {
  const selectedModelId = modelSelects[provider].value;
  if (selectedModelId) {
    showLoadingIndicator(true);
    apiSelectModel(provider, selectedModelId)
      .then(() => {
        localStorage.setItem('currentModel', selectedModelId);
        localStorage.setItem('currentProvider', provider);
        currentModelSpan.textContent = selectedModelId;
        showSuccessMessage(`Model ${selectedModelId} selected successfully!`);
      })
      .catch(error => {
        console.error('Error selecting model:', error);
        showErrorMessage('Failed to select model. Please try again or choose a different model.');
      })
      .finally(() => {
        showLoadingIndicator(false);
      });
  } else {
    showErrorMessage('Please select a valid model.');
  }
}

function showLoadingIndicator(show) {
  // Implement this function to show/hide a loading indicator
  // For example:
  const loadingIndicator = document.getElementById('loading-indicator');
  if (loadingIndicator) {
    loadingIndicator.style.display = show ? 'block' : 'none';
  }
}

export function initializeModelSelection() {
  loadModels();
  Object.keys(modelSelects).forEach(provider => {
    modelSelects[provider].addEventListener('change', () => selectModel(provider));
  });

  // Set initial model if stored in localStorage
  const storedModel = localStorage.getItem('currentModel');
  const storedProvider = localStorage.getItem('currentProvider');
  if (storedModel && storedProvider && modelSelects[storedProvider]) {
    currentModelSpan.textContent = storedModel;
    modelSelects[storedProvider].value = storedModel;
  } else {
    // Clear invalid stored data
    localStorage.removeItem('currentModel');
    localStorage.removeItem('currentProvider');
    currentModelSpan.textContent = 'None';
  }
}

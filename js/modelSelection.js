import { getModels, selectModel as apiSelectModel } from './services/modelService.js';
import { getUserId, showErrorMessage, showSuccessMessage } from './utils.js';

const modelSelects = {
  llama: document.getElementById('llama-models'),
  openai: document.getElementById('openai-models'),
  anthropic: document.getElementById('anthropic-models'),
  openrouter: document.getElementById('openrouter-models')
};

async function loadModels() {
  try {
    const models = await getModels();
    Object.entries(models).forEach(([provider, providerModels]) => {
      const select = modelSelects[provider];
      if (select) {
        providerModels.forEach(model => {
          const option = document.createElement('option');
          option.value = model;
          option.textContent = model;
          select.appendChild(option);
        });
      }
    });
  } catch (error) {
    console.error('Error loading models:', error);
    showErrorMessage('Failed to load models. Please try again.');
  }
}

export function selectModel(provider) {
  const selectedModelId = modelSelects[provider].value;
  if (selectedModelId) {
    document.getElementById('current-model').textContent = selectedModelId;
    apiSelectModel(provider, selectedModelId)
      .then(() => {
        localStorage.setItem('currentModel', selectedModelId);
        localStorage.setItem('currentProvider', provider);
        showSuccessMessage(`Model ${selectedModelId} selected successfully!`);
      })
      .catch(error => {
        console.error('Error selecting model:', error);
        showErrorMessage('Failed to select model. Please try again.');
      });
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
  if (storedModel && storedProvider) {
    document.getElementById('current-model').textContent = storedModel;
    if (modelSelects[storedProvider]) {
      modelSelects[storedProvider].value = storedModel;
    }
  }
}

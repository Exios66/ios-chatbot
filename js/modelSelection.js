import { getModels, selectModel as apiSelectModel } from './services/modelService.js';

const modelSelects = {
  llama: document.getElementById('llama-models'),
  openai: document.getElementById('openai-models'),
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
  }
}

export function selectModel(provider) {
  const selectedModelId = modelSelects[provider].value;
  if (selectedModelId) {
    document.getElementById('current-model').textContent = selectedModelId;
    // You might want to call the API here to actually select the model
    // apiSelectModel(getUserId(), selectedModelId);
  }
}

export function initializeModelSelection() {
  loadModels();
  Object.keys(modelSelects).forEach(provider => {
    modelSelects[provider].addEventListener('change', () => selectModel(provider));
  });
}

function getUserId() {
  // Implement this function to get the current user's ID
  // This could be stored in localStorage or retrieved from a global state
  return 'dummy-user-id';
}

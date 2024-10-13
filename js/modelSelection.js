import { getModels, selectModel } from './services/modelService.js';

const modelSelect = document.getElementById('model-select');
const modelSelectionForm = document.getElementById('model-selection-form');

async function loadModels() {
  try {
    const models = await getModels();
    models.forEach(model => {
      const option = document.createElement('option');
      option.value = model.id;
      option.textContent = model.name;
      modelSelect.appendChild(option);
    });
  } catch (error) {
    console.error('Error loading models:', error);
  }
}

modelSelectionForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const selectedModelId = modelSelect.value;
  try {
    const result = await selectModel(getUserId(), selectedModelId);
    alert(`Model ${result.name} selected successfully!`);
  } catch (error) {
    console.error('Error selecting model:', error);
    alert('Failed to select model. Please try again.');
  }
});

loadModels();

function getUserId() {
  // Implement this function to get the current user's ID
  // This could be stored in localStorage or retrieved from a global state
}
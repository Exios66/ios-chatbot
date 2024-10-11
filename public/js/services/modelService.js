import axios from 'axios';

export async function getModels() {
  try {
    const response = await axios.get('/api/models');
    return response.data;
  } catch (error) {
    console.error('Error fetching models:', error);
    throw error;
  }
}

export async function selectModel(userId, modelId) {
  try {
    const response = await axios.post('/api/models/select', { userId, modelId });
    return response.data;
  } catch (error) {
    console.error('Error selecting model:', error);
    throw error;
  }
}
import { getUserId } from '../utils.js';

const api = axios.create({
  baseURL: 'http://localhost:3000', // or whatever your API base URL is
});

export async function getModels() {
  try {
    const response = await api.get('/api/models');
    return response.data;
  } catch (error) {
    console.error('Error fetching models:', error);
    throw error;
  }
}

export async function selectModel(provider, modelId) {
  try {
    const userId = getUserId();
    const response = await api.post('/api/models/select', { userId, provider, modelId });
    return response.data;
  } catch (error) {
    console.error('Error selecting model:', error);
    throw error;
  }
}

export async function generateResponse(message, provider, modelId) {
  try {
    const userId = getUserId();
    const response = await api.post('/api/generate', { userId, message, provider, modelId });
    return response.data;
  } catch (error) {
    console.error('Error generating response:', error);
    throw error;
  }
}

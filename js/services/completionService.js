import axios from 'axios';

export async function generateCompletion(userId, prompt) {
  try {
    const response = await axios.post('/api/completions', { userId, prompt });
    return response.data;
  } catch (error) {
    console.error('Error generating completion:', error);
    throw error;
  }
}
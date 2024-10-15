import { getUserId } from '../utils.js';

const API_BASE_URL = typeof window !== 'undefined' && window.API_BASE_URL ? window.API_BASE_URL : 'http://localhost:3000';

async function fetchWithErrorHandling(url, options) {
  try {
    let response;
    if (typeof window !== 'undefined' && window.axios) {
      response = await window.axios({
        url,
        ...options,
        data: options.body, // axios uses 'data' instead of 'body'
      });
      return response.data;
    } else {
      // Fallback to fetch API if axios is not available
      response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    }
  } catch (error) {
    console.error('Fetch error:', error);
    if (error.response) {
      throw new Error(`HTTP error! status: ${error.response.status}`);
    } else if (error.request) {
      throw new Error('Network error: Unable to reach the server. Please check your internet connection.');
    } else {
      throw new Error(`An unexpected error occurred: ${error.message}`);
    }
  }
}

export async function getModels() {
  return fetchWithErrorHandling(`${API_BASE_URL}/api/models`);
}

export async function selectModel(provider, modelId) {
  const userId = getUserId();
  return fetchWithErrorHandling(`${API_BASE_URL}/api/models/select`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, provider, modelId }),
  });
}

export async function generateResponse(message, provider, modelId) {
  const userId = getUserId();
  return fetchWithErrorHandling(`${API_BASE_URL}/api/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, message, provider, modelId }),
  });
}

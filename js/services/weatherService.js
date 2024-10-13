import axios from 'axios';

export async function getWeatherForecast(location) {
  try {
    const response = await axios.get(`/api/weather?location=${encodeURIComponent(location)}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching weather forecast:', error);
    throw error;
  }
}
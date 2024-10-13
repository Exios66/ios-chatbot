export async function getConversationHistory(userId) {
  try {
    const response = await axios.get(`/api/chat/history/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching conversation history:', error);
    throw error;
  }
}

export async function saveMessage(userId, message) {
  try {
    const response = await axios.post('/api/chat/message', { userId, message });
    return response.data;
  } catch (error) {
    console.error('Error saving message:', error);
    throw error;
  }
}

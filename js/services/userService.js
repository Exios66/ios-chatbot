import axios from 'axios';

export async function getUsers() {
  try {
    const response = await axios.get('/api/users');
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

export const createUser = async (userData) => {
  // Implementation...
};

export const getUserByEmail = async (email) => {
  // Implementation...
  // For example:
  // return await User.findOne({ email });
};

export async function updateUser(userId, userData) {
  try {
    const response = await axios.put(`/api/users/${userId}`, userData);
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}

export async function deleteUser(userId) {
  try {
    await axios.delete(`/api/users/${userId}`);
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
}

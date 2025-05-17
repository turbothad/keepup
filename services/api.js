// services/api.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://localhost:818/api';
// For physical devices, use your computer's local IP instead:
// const API_URL = 'http://192.168.x.x:818/api';

// Set auth token for all requests
const setAuthToken = async () => {
  const token = await AsyncStorage.getItem('@auth_token');
  if (token) {
    axios.defaults.headers.common['x-auth-token'] = token;
  } else {
    delete axios.defaults.headers.common['x-auth-token'];
  }
};

export const AuthService = {
  setAuthToken: (token) => {
    if (token) {
      axios.defaults.headers.common['x-auth-token'] = token;
    }
  },

  clearAuthToken: () => {
    delete axios.defaults.headers.common['x-auth-token'];
  },

  register: async (userData) => {
    try {
      const res = await axios.post(`${API_URL}/users/register`, userData);
      await AsyncStorage.setItem('@auth_token', res.data.token);
      setAuthToken();
      return res.data;
    } catch (err) {
      throw err.response?.data || err.message;
    }
  },

  login: async (credentials) => {
    try {
      const res = await axios.post(`${API_URL}/users/login`, credentials);
      await AsyncStorage.setItem('@auth_token', res.data.token);
      setAuthToken();
      return res.data;
    } catch (err) {
      throw err.response?.data || err.message;
    }
  },

  logout: async () => {
    await AsyncStorage.removeItem('@auth_token');
    setAuthToken();
  },

  getProfile: async () => {
    try {
      await setAuthToken();
      const res = await axios.get(`${API_URL}/users/me`);
      return res.data;
    } catch (err) {
      throw err.response?.data || err.message;
    }
  },
};

export const PostService = {
  getPosts: async () => {
    await setAuthToken();
    try {
      const res = await axios.get(`${API_URL}/posts`);
      return res.data;
    } catch (err) {
      throw err.response?.data || err.message;
    }
  },

  getFriendsPosts: async () => {
    await setAuthToken();
    try {
      // If your backend has a dedicated endpoint for friends' posts, use it:
      // const res = await axios.get(`${API_URL}/posts/friends`);

      // Otherwise, we'll fetch all posts and filter client-side
      const res = await axios.get(`${API_URL}/posts`);
      return res.data;
    } catch (err) {
      throw err.response?.data || err.message;
    }
  },

  createPost: async (postData) => {
    await setAuthToken();
    try {
      const res = await axios.post(`${API_URL}/posts`, postData);
      return res.data;
    } catch (err) {
      throw err.response?.data || err.message;
    }
  },

  likePost: async (postId) => {
    await setAuthToken();
    try {
      const res = await axios.put(`${API_URL}/posts/like/${postId}`);
      return res.data;
    } catch (err) {
      throw err.response?.data || err.message;
    }
  },
};

export const UserService = {
  getProfile: async (userId = null) => {
    await setAuthToken();
    try {
      if (userId) {
        const res = await axios.get(`${API_URL}/users/${userId}`);
        return res.data;
      }
      const res = await axios.get(`${API_URL}/users/me`);
      return res.data;
    } catch (err) {
      throw err.response?.data || err.message;
    }
  },

  addFriend: async (friendId) => {
    await setAuthToken();
    try {
      const res = await axios.put(`${API_URL}/users/friends/${friendId}`);
      return res.data;
    } catch (err) {
      throw err.response?.data || err.message;
    }
  },

  removeFriend: async (friendId) => {
    await setAuthToken();
    try {
      const res = await axios.delete(`${API_URL}/users/friends/${friendId}`);
      return res.data;
    } catch (err) {
      throw err.response?.data || err.message;
    }
  },

  searchUsers: async (query) => {
    await setAuthToken();
    try {
      const res = await axios.get(`${API_URL}/users/search?query=${query}`);
      return res.data;
    } catch (err) {
      throw err.response?.data || err.message;
    }
  },
};

// Create similar services for users, groups, and comments

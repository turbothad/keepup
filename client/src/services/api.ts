import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Base API URL
const API_URL = 'http://localhost:5001/api';

// Create an axios instance with default settings
const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding token to request headers
apiClient.interceptors.request.use(
  async (config: AxiosRequestConfig) => {
    try {
      // Get token from storage
      const token = await AsyncStorage.getItem('authToken');
      
      // If token exists, add to Authorization header
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      console.error('Error adding auth token to request:', error);
      return config;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    // Handle 401 Unauthorized errors by redirecting to login
    if (error.response?.status === 401) {
      // Clear token from storage
      await AsyncStorage.removeItem('authToken');
      
      // Redirect logic would go here (navigation is typically handled outside the API service)
      // You might emit an event or use a callback for this
      console.log('Session expired, please log in again');
    }
    
    return Promise.reject(error);
  }
);

// API endpoints
const api = {
  // Auth endpoints
  auth: {
    login: (username: string, password: string) => 
      apiClient.post('/auth/login', { username, password }),
    register: (userData: any) => 
      apiClient.post('/auth/register', userData),
    logout: () => 
      apiClient.post('/auth/logout'),
    getProfile: () => 
      apiClient.get('/auth/profile'),
  },
  
  // Posts endpoints
  posts: {
    getAll: (page = 1, limit = 10) => 
      apiClient.get(`/posts?page=${page}&limit=${limit}`),
    getById: (id: string) => 
      apiClient.get(`/posts/${id}`),
    create: (postData: any) => 
      apiClient.post('/posts', postData),
    update: (id: string, postData: any) => 
      apiClient.put(`/posts/${id}`, postData),
    delete: (id: string) => 
      apiClient.delete(`/posts/${id}`),
    like: (id: string) => 
      apiClient.post(`/posts/${id}/like`),
    comment: (id: string, comment: string) => 
      apiClient.post(`/posts/${id}/comments`, { content: comment }),
  },
  
  // Users endpoints
  users: {
    getProfile: (id: string) => 
      apiClient.get(`/users/${id}`),
    updateProfile: (userData: any) => 
      apiClient.put('/users/profile', userData),
    follow: (id: string) => 
      apiClient.post(`/users/${id}/follow`),
    unfollow: (id: string) => 
      apiClient.post(`/users/${id}/unfollow`),
    getFollowers: (id: string) => 
      apiClient.get(`/users/${id}/followers`),
    getFollowing: (id: string) => 
      apiClient.get(`/users/${id}/following`),
  },
};

export { apiClient };
export default api;

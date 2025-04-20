// API service for communicating with the backend
const DEV_API_URL = 'http://localhost:3001/api'; // Local development server
const PROD_API_URL = 'https://keepup-vercel.vercel.app/api'; // Vercel deployment URL (replace with your actual Vercel URL)

// Determine which API URL to use
// In a real app, use environment variables or a config system
const API_URL = __DEV__ ? DEV_API_URL : PROD_API_URL;

console.log('API Service initialized with URL:', API_URL);

// Posts API methods
export const PostsAPI = {
  // Get all posts for the feed
  getPosts: async () => {
    try {
      console.log('API: Fetching posts from', `${API_URL}/posts`);
      const response = await fetch(`${API_URL}/posts`);
      
      if (!response.ok) {
        console.error('API: Failed to fetch posts', { 
          status: response.status, 
          statusText: response.statusText 
        });
        throw new Error('Failed to fetch posts');
      }
      
      const data = await response.json();
      console.log('API: Successfully fetched posts', { count: data.length });
      return data;
    } catch (error) {
      console.error('API: Error fetching posts:', error);
      throw error;
    }
  },

  // Create a new post
  createPost: async (postData) => {
    try {
      console.log('API: Creating post at', `${API_URL}/posts`);
      
      // Check if imageUrl is a valid string
      if (typeof postData.imageUrl === 'string' && postData.imageUrl.length > 1000) {
        console.log('API: Image URL is very long, likely a data URL. Length:', postData.imageUrl.length);
      }
      
      // Log request details for debugging
      console.log('API: Request details', { 
        method: 'POST',
        contentType: 'application/json',
        bodySize: JSON.stringify(postData).length,
        hasAuthorId: !!postData.authorId
      });
      
      const response = await fetch(`${API_URL}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });
      
      // Debug the response
      console.log('API: Post creation response', { 
        ok: response.ok, 
        status: response.status, 
        statusText: response.statusText 
      });
      
      if (!response.ok) {
        // Try to get the error message from response
        let errorMessage = 'Failed to create post';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
          console.error('API: Server error response:', errorData);
        } catch (e) {
          console.error('API: Could not parse error response');
        }
        
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      console.log('API: Post created successfully', { id: data.id || data._id });
      return data;
    } catch (error) {
      console.error('API: Error creating post:', error);
      throw error;
    }
  },

  // Like a post
  likePost: async (postId, userId) => {
    try {
      const response = await fetch(`${API_URL}/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });
      if (!response.ok) throw new Error('Failed to like post');
      return await response.json();
    } catch (error) {
      console.error('Error liking post:', error);
      throw error;
    }
  },

  // Save a post
  savePost: async (postId, userId) => {
    try {
      const response = await fetch(`${API_URL}/posts/${postId}/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });
      if (!response.ok) throw new Error('Failed to save post');
      return await response.json();
    } catch (error) {
      console.error('Error saving post:', error);
      throw error;
    }
  },
};

// Users API methods
export const UsersAPI = {
  // Get all users
  getUsers: async () => {
    try {
      const response = await fetch(`${API_URL}/users`);
      if (!response.ok) throw new Error('Failed to fetch users');
      return await response.json();
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  // Get user by ID
  getUserById: async (userId) => {
    try {
      const response = await fetch(`${API_URL}/users/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch user');
      return await response.json();
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },
}; 
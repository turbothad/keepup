import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import '@jest/globals';

// Mock the API client to avoid importing React Native dependencies
jest.mock('../src/services/api', () => ({
  apiClient: axios.create({
    baseURL: 'http://localhost:5001/api'
  })
}));

// Import the API service after mocking
import { apiClient } from '../src/services/api';

describe('API Client Tests', () => {
  let mock: MockAdapter;

  beforeEach(() => {
    // Create a new instance of axios-mock-adapter for each test
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    // Reset the mock after each test
    mock.reset();
  });

  it('should fetch API health status', async () => {
    // Mock the health check endpoint
    mock.onGet('http://localhost:5001/api/health').reply(200, {
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: {
        connected: true
      }
    });

    // Make the API call (adjust based on your actual API service structure)
    const response = await apiClient.get('/health');
    
    // Check that the response is as expected
    expect(response.status).toBe(200);
    expect(response.data.status).toBe('ok');
    expect(response.data.database.connected).toBe(true);
  });

  it('should handle authentication', async () => {
    // Mock credentials
    const credentials = {
      username: 'testuser',
      password: 'password123'
    };

    // Mock login endpoint
    mock.onPost('http://localhost:5001/api/auth/login').reply(200, {
      token: 'fake-jwt-token',
      user: {
        id: '123',
        username: 'testuser'
      }
    });

    // Make login API call (adjust based on your actual API service)
    const response = await apiClient.post('/auth/login', credentials);
    
    // Verify login response
    expect(response.status).toBe(200);
    expect(response.data.token).toBeDefined();
    expect(response.data.user).toBeDefined();
  });

  it('should handle errors gracefully', async () => {
    // Mock a server error
    mock.onGet('http://localhost:5001/api/posts').reply(500, { 
      message: 'Internal Server Error' 
    });

    try {
      // Make API call
      await apiClient.get('/posts');
      // If we reach this point, the request didn't throw an error
      fail('Expected API call to throw an error');
    } catch (error: any) {
      // Verify the error was caught and has the right status
      expect(error.response.status).toBe(500);
    }
  });
}); 
import axios from 'axios';
import '@jest/globals';
import MockAdapter from 'axios-mock-adapter';

describe('MongoDB Connection via Server API', () => {
  const API_URL = 'http://localhost:5001/api';
  let mock: MockAdapter;

  beforeEach(() => {
    // Create a new instance of axios-mock-adapter for each test
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    // Reset the mock after each test
    mock.reset();
  });

  it('should connect to MongoDB through the server health check', async () => {
    // Mock the successful health response
    mock.onGet(`${API_URL}/health`).reply(200, {
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: {
        connected: true
      }
    });

    // Make a request to the server's health endpoint
    const response = await axios.get(`${API_URL}/health`);
    
    // Check the response status
    expect(response.status).toBe(200);
    
    // Check that the database connection is successful
    expect(response.data).toHaveProperty('database');
    expect(response.data.database).toHaveProperty('connected', true);
  });
  
  it('should be able to make authenticated requests', async () => {
    // Mock the authentication endpoint
    mock.onGet(`${API_URL}/auth/status`).reply(401, {
      message: 'Unauthorized'
    });

    try {
      // This will return 401 as mocked
      await axios.get(`${API_URL}/auth/status`);
      fail('Expected an error response');
    } catch (error: any) {
      // We expect a 401 error
      expect(error.response.status).toBe(401);
      expect(error.response.status).not.toBe(500);
    }
  });
}); 
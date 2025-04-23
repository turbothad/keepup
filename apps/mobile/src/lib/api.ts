// Get API URL from environment variables
const API_URL = process.env.EXPO_PUBLIC_API_URL;

/**
 * Health check endpoint
 */
export async function getHealth() {
  try {
    const response = await fetch(`${API_URL}/health`);
    return await response.json();
  } catch (error) {
    console.error('API Health check failed:', error);
    throw error;
  }
}

// Add more API functions here as needed 
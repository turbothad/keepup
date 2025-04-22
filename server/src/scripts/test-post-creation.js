// Test script for debugging post creation
require('dotenv').config();
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

// API URL
const API_URL = 'http://localhost:3001';

// Test post data
const testPost = {
  content: 'Test post from debugging script',
  description: 'Debugging test',
  authorId: 'user1', // This is the same ID used in the app
  createdAt: new Date(),
  imageUrl: 'https://picsum.photos/200/300' // Remote URL for testing
};

// Additional test with base64 image
const createBase64Post = async () => {
  console.log('\nTesting post creation with base64 image...');
  try {
    // Create a small image as base64
    const base64Image = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
    
    const postData = {
      ...testPost,
      imageUrl: base64Image
    };
    
    console.log('Sending base64 post with payload:', {
      ...postData,
      imageUrl: postData.imageUrl.substring(0, 30) + '...' // Truncate for readability
    });
    
    const response = await fetch(`${API_URL}/api/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(postData)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed: ${response.status} - ${errorText}`);
    }
    
    const result = await response.json();
    console.log('✅ Base64 post created successfully:', result);
    return result;
  } catch (error) {
    console.error('❌ Base64 post creation failed:', error.message);
    return null;
  }
};

// Create a post with a URL image
const createUrlPost = async () => {
  console.log('\nTesting post creation with URL image...');
  try {
    const postData = {
      ...testPost
    };
    
    console.log('Sending URL post with payload:', postData);
    
    const response = await fetch(`${API_URL}/api/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(postData)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed: ${response.status} - ${errorText}`);
    }
    
    const result = await response.json();
    console.log('✅ URL post created successfully:', result);
    return result;
  } catch (error) {
    console.error('❌ URL post creation failed:', error.message);
    return null;
  }
};

// Test with the same file path format as in the simulator
const createLocalPathPost = async () => {
  console.log('\nTesting post creation with local file path (simulator format)...');
  try {
    const simulatorPath = 'file:///Users/test/Library/Developer/CoreSimulator/Devices/123/data/image.jpg';
    
    const postData = {
      ...testPost,
      imageUrl: simulatorPath
    };
    
    console.log('Sending local path post with payload:', postData);
    
    const response = await fetch(`${API_URL}/api/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(postData)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed: ${response.status} - ${errorText}`);
    }
    
    const result = await response.json();
    console.log('✅ Local path post created successfully:', result);
    return result;
  } catch (error) {
    console.error('❌ Local path post creation failed:', error.message);
    return null;
  }
};

// Test getting all users to validate user existence
const checkUsers = async () => {
  console.log('\nFetching users to verify user IDs...');
  try {
    const response = await fetch(`${API_URL}/api/users`);
    if (!response.ok) {
      throw new Error(`Failed to fetch users: ${response.status}`);
    }
    
    const users = await response.json();
    console.log(`Found ${users.length} users:`);
    users.forEach(user => {
      console.log(`- ID: ${user._id}, Name: ${user.name || 'N/A'}, Username: ${user.username || 'N/A'}`);
      if (user._id === 'user1' || user.username === 'user1') {
        console.log('✅ Found matching user for "user1"');
      }
    });
    
    if (!users.some(u => u._id === 'user1' || u.username === 'user1')) {
      console.log('❌ Warning: No user with ID or username "user1" found!');
    }
    
    return users;
  } catch (error) {
    console.error('Error getting users:', error.message);
    return [];
  }
};

// Run all tests
async function runTests() {
  console.log('=== Post Creation Debug Script ===');
  
  // 1. Check connectivity
  console.log('\nChecking API connectivity...');
  try {
    const healthResponse = await fetch(`${API_URL}/health`);
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('✅ API is accessible. DB status:', healthData.database);
    } else {
      console.error('❌ API health check failed with status:', healthResponse.status);
    }
  } catch (error) {
    console.error('❌ Failed to connect to API:', error.message);
    console.log('Make sure your server is running with: npm run server');
    process.exit(1);
  }
  
  // 2. Check users
  await checkUsers();
  
  // 3. Run post creation tests
  await createUrlPost();
  await createBase64Post();
  await createLocalPathPost();
  
  console.log('\n=== Test Summary ===');
  console.log('Check the server logs for detailed debugging information.');
  console.log('\nRecommendations for fixing the issue:');
  console.log('1. Ensure "user1" exists in your database - consider using a real ObjectId');
  console.log('2. Verify the image file handling in the API');
  console.log('3. For local file URLs, implement a file upload endpoint that accepts multipart/form-data');
}

runTests(); 
// Test script for API CRUD operations
require('dotenv').config();
const fetch = require('node-fetch');

// API URLs
const LOCAL_API_URL = 'http://localhost:3001';
const VERCEL_API_URL = 'https://keepup-vercel.vercel.app'; // Replace with your actual Vercel URL

// Sample test data
const testUser = { 
  // This should be a valid user ID from your database
  _id: '6578e05ab53d1e3c7a4a1234' // Replace with actual ID
};

const testPost = {
  content: 'Test post from API test script',
  authorId: testUser._id, // Will be replaced with actual user ID
  media: null
};

// Get all users to find a valid user
async function getValidUser(baseUrl) {
  console.log('Fetching users to get a valid ID...');
  try {
    const response = await fetch(`${baseUrl}/api/users`);
    if (!response.ok) {
      throw new Error(`Failed to fetch users: ${response.status}`);
    }
    
    const users = await response.json();
    if (users && users.length > 0) {
      console.log(`Found ${users.length} users, using first user as test user`);
      return users[0];
    } else {
      throw new Error('No users found in the database');
    }
  } catch (error) {
    console.error('Error getting valid user:', error.message);
    return null;
  }
}

// Test creating a post
async function testCreatePost(baseUrl, user) {
  console.log('\nTesting CREATE post operation');
  
  const postData = {
    ...testPost,
    authorId: user._id
  };
  
  try {
    console.log(`Creating post with data:`, JSON.stringify(postData, null, 2));
    
    const response = await fetch(`${baseUrl}/api/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(postData)
    });
    
    console.log(`Create post status: ${response.status}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create post: ${response.status} - ${errorText}`);
    }
    
    const createdPost = await response.json();
    console.log('Post created successfully:', JSON.stringify(createdPost, null, 2));
    
    return createdPost;
  } catch (error) {
    console.error('Error creating post:', error.message);
    return null;
  }
}

// Test reading posts
async function testReadPosts(baseUrl) {
  console.log('\nTesting READ posts operation');
  
  try {
    const response = await fetch(`${baseUrl}/api/posts`);
    console.log(`Read posts status: ${response.status}`);
    
    if (!response.ok) {
      throw new Error(`Failed to read posts: ${response.status}`);
    }
    
    const posts = await response.json();
    console.log(`Successfully retrieved ${posts.length} posts`);
    console.log('First post:', posts.length > 0 ? JSON.stringify(posts[0], null, 2) : 'No posts found');
    
    return posts;
  } catch (error) {
    console.error('Error reading posts:', error.message);
    return [];
  }
}

// Run CRUD tests for an environment
async function runCrudTests(name, baseUrl) {
  console.log(`\n=== Running CRUD Tests for ${name} ===`);
  console.log(`Base URL: ${baseUrl}`);
  
  // Get a valid user first
  const user = await getValidUser(baseUrl);
  
  if (!user) {
    console.error('Could not find a valid user. Skipping CRUD tests.');
    return {
      environment: name,
      success: false,
      error: 'No valid user found'
    };
  }
  
  // Run the tests
  const createdPost = await testCreatePost(baseUrl, user);
  const posts = await testReadPosts(baseUrl);
  
  // Check results
  const createSuccess = !!createdPost;
  const readSuccess = posts.length > 0;
  
  console.log(`\n--- ${name} CRUD Summary ---`);
  console.log(`Create: ${createSuccess ? '✅' : '❌'}`);
  console.log(`Read: ${readSuccess ? '✅' : '❌'}`);
  
  return {
    environment: name,
    success: createSuccess && readSuccess,
    results: {
      create: createSuccess,
      read: readSuccess
    }
  };
}

// Main test function
async function runTests() {
  console.log('API CRUD Test Script');
  console.log('===================\n');
  
  // Test local environment
  const localResult = await runCrudTests('Local', LOCAL_API_URL);
  
  // Ask before testing Vercel
  console.log('\nDo you want to test the Vercel environment? (yes/no)');
  process.stdin.once('data', async (data) => {
    const input = data.toString().trim().toLowerCase();
    if (input === 'yes' || input === 'y') {
      const vercelResult = await runCrudTests('Vercel', VERCEL_API_URL);
      console.log('\n=== Final Results ===');
      console.log(`Local: ${localResult.success ? 'PASS' : 'FAIL'}`);
      console.log(`Vercel: ${vercelResult.success ? 'PASS' : 'FAIL'}`);
    } else {
      console.log('\n=== Final Results ===');
      console.log(`Local: ${localResult.success ? 'PASS' : 'FAIL'}`);
      console.log('Vercel: SKIPPED');
    }
    process.exit(0);
  });
}

// Run the tests
runTests(); 
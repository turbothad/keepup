// Test script for API endpoints
require('dotenv').config();
const fetch = require('node-fetch');

// API URLs
const LOCAL_API_URL = 'http://localhost:3001';
const VERCEL_API_URL = 'https://keepup-vercel.vercel.app'; // Replace with your actual Vercel URL

// Endpoints to test
const endpoints = [
  { path: '/health', method: 'GET' },
  { path: '/api/posts', method: 'GET' },
  { path: '/api/users', method: 'GET' }
];

// Test a single endpoint
async function testEndpoint(baseUrl, endpoint) {
  const url = `${baseUrl}${endpoint.path}`;
  console.log(`Testing ${endpoint.method} ${url}...`);
  
  try {
    const response = await fetch(url, { method: endpoint.method });
    const status = response.status;
    let data;
    
    try {
      data = await response.json();
    } catch (e) {
      data = await response.text();
    }
    
    console.log(`  Status: ${status}`);
    console.log(`  Response: ${typeof data === 'object' ? JSON.stringify(data, null, 2).substring(0, 100) + '...' : data.substring(0, 100) + '...'}`);
    
    return {
      success: response.ok,
      status,
      data
    };
  } catch (error) {
    console.log(`  Error: ${error.message}`);
    return {
      success: false,
      error: error.message
    };
  }
}

// Test all endpoints for an environment
async function testEnvironment(name, baseUrl) {
  console.log(`\n=== Testing ${name} environment ===`);
  console.log(`Base URL: ${baseUrl}\n`);
  
  const results = [];
  
  for (const endpoint of endpoints) {
    const result = await testEndpoint(baseUrl, endpoint);
    results.push({
      endpoint: endpoint.path,
      ...result
    });
  }
  
  // Summary
  console.log(`\n--- ${name} Summary ---`);
  const successful = results.filter(r => r.success).length;
  console.log(`${successful}/${results.length} endpoints successful`);
  
  results.forEach(result => {
    const icon = result.success ? '✅' : '❌';
    console.log(`${icon} ${result.endpoint}`);
  });
  
  return {
    environment: name,
    success: successful === results.length,
    results
  };
}

// Main test function
async function runTests() {
  console.log('API Endpoint Test Script');
  console.log('=======================\n');
  
  const localResult = await testEnvironment('Local', LOCAL_API_URL);
  
  // Ask before testing Vercel
  console.log('\nDo you want to test the Vercel environment? (yes/no)');
  process.stdin.once('data', async (data) => {
    const input = data.toString().trim().toLowerCase();
    if (input === 'yes' || input === 'y') {
      const vercelResult = await testEnvironment('Vercel', VERCEL_API_URL);
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
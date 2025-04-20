// Test script for simulator API connectivity
require('dotenv').config();
const fetch = require('node-fetch');

// Define the localhost simulator address for iOS and Android
// iOS: localhost is accessible as localhost
// Android: localhost is accessible as 10.0.2.2
const IOS_SIMULATOR_URL = 'http://localhost:3001'; 
const ANDROID_SIMULATOR_URL = 'http://10.0.2.2:3001'; // For Android Emulator

// Endpoints to test
const endpoints = [
  { path: '/health', method: 'GET' },
  { path: '/api/posts', method: 'GET' }
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

// Generate simulator test code
function generateSimulatorTestCode(baseUrl) {
  const code = `
// Add this to your app to test API connectivity from the simulator

import { useEffect } from 'react';
import { Alert } from 'react-native';

// Test API connectivity
const testApiConnection = async () => {
  try {
    const response = await fetch('${baseUrl}/health');
    if (!response.ok) {
      throw new Error(\`HTTP error! Status: \${response.status}\`);
    }
    const data = await response.json();
    Alert.alert(
      'API Connection Success',
      \`Connected to API. Database: \${data.database}\`,
      [{ text: 'OK' }]
    );
    return true;
  } catch (error) {
    Alert.alert(
      'API Connection Failed',
      \`Error connecting to API: \${error.message}\`,
      [{ text: 'OK' }]
    );
    return false;
  }
};

// Call this in a component
useEffect(() => {
  testApiConnection();
}, []);
  `;
  
  return code;
}

// Test all endpoints for simulator
async function testSimulatorEndpoints(name, baseUrl) {
  console.log(`\n=== Testing ${name} Simulator Connection ===`);
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
  console.log(`\n--- ${name} Simulator Summary ---`);
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
  console.log('Mobile Simulator API Test Script');
  console.log('===============================\n');
  
  console.log('This script tests API connectivity from the mobile simulator perspective.\n');
  
  // Test iOS simulator connection
  console.log('Testing as if we were on an iOS simulator...');
  const iosResult = await testSimulatorEndpoints('iOS Simulator', IOS_SIMULATOR_URL);
  
  // Test Android simulator connection
  console.log('\nNote: For Android Emulator, use 10.0.2.2 instead of localhost');
  console.log('Android Emulator testing is skipped in this run, but the code is ready.');
  
  // Generate code for testing in the simulator
  console.log('\n=== Test Code for Simulators ===');
  console.log('Copy this code into a component in your app to test API connectivity:');
  console.log(generateSimulatorTestCode(IOS_SIMULATOR_URL));
  
  console.log('\n=== Final Results ===');
  console.log(`iOS Simulator: ${iosResult.success ? 'PASS' : 'FAIL'}`);
  console.log('Android Emulator: SKIPPED (use 10.0.2.2 instead of localhost)');
  
  console.log('\n=== Instructions for Simulator Testing ===');
  console.log('1. Make sure your server is running with: npm run server');
  console.log('2. Start your iOS simulator with: npm run ios');
  console.log('3. Copy the test code above into a component to verify API connectivity');
  
  process.exit(0);
}

// Run the tests
runTests(); 
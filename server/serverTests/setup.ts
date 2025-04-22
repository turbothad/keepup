import dotenv from 'dotenv';
import '@jest/globals';

// Load environment variables from .env file
dotenv.config();

// Set timeout for all tests to 10 seconds
jest.setTimeout(10000);

// Mock console.log and console.error to keep test output clean
// Comment these out if you want to see the logs during tests
// global.console.log = jest.fn();
// global.console.error = jest.fn();

// Add any global test setup here 
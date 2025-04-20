# API Testing Guide

This guide explains how to test the API connectivity for your KeepUp app, both locally and on Vercel.

## Testing the API

We have several test scripts to help you verify API connectivity:

### Basic API Connectivity

```bash
# Test basic API connectivity
npm run test-api
```

This will check if your API endpoints are accessible and responding correctly.

### CRUD Operations

```bash
# Test CRUD operations (Create/Read Posts)
npm run test-crud
```

This will test creating and retrieving posts via the API.

### Mobile Simulator Connectivity

```bash
# Test API from iOS simulator perspective
npm run test-simulator
```

This script tests API connectivity from the perspective of an iOS simulator and provides example code to test from your app.

## Running the Server

To start the local server:

```bash
# Start the server in development mode
npm run server

# Or with NODE_ENV explicitly set
npm run dev
```

## iOS Simulator Testing

To test on the iOS simulator:

1. Start your local server in one terminal:
   ```bash
   npm run server
   ```

2. Start the iOS simulator in another terminal:
   ```bash
   npm run ios
   ```

3. Add the `ApiTester` component to any screen in your app:
   ```jsx
   import ApiTester from '../components/ApiTester';
   
   // Then in your component's render function:
   <ApiTester />
   ```

The simulator will automatically connect to your local server via `localhost:3001`.

## Environment Setup

The app will automatically use:
- `http://localhost:3001` when running in development mode
- `https://keepup-vercel.vercel.app` when running in production mode

## Vercel Deployment

To deploy to Vercel:

1. Make sure your Vercel account is set up
2. Install the Vercel CLI:
   ```bash
   npm install -g vercel
   ```

3. Deploy to Vercel:
   ```bash
   vercel --prod
   ```

4. Set up the environment variables in the Vercel dashboard:
   - `MONGODB_URI_PROD`: Your MongoDB production URI

## Troubleshooting

### If iOS Simulator Can't Connect

1. Check that your server is running (`npm run server`)
2. Verify the server is listening on port 3001
3. Test with `curl http://localhost:3001/health` from your computer
4. Use the ApiTester component to debug from within the app

### If Android Emulator Can't Connect

For Android, you need to use `10.0.2.2` instead of `localhost`. This is already configured in the ApiTester component.

## API Structure

Your API is structured into serverless functions:

- `/api/health` - Health check endpoint
- `/api/posts` - Posts CRUD operations 
- `/api/users` - Users operations

These endpoints work identically on both your local server and on Vercel. 
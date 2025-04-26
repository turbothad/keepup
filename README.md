# KeepUp App

KeepUp is a social media app that allows users to connect with friends and share daily posts. The app is built with Expo and React Native for the frontend, with a MongoDB-based Node.js backend.

## Project Structure

```
keepup/                # Frontend (Expo/React Native)
├── app/               # Main application screens (Expo Router)
├── components/        # Reusable UI components
├── models/            # TypeScript interfaces for data models
├── services/          # API services for backend communication
├── hooks/             # Custom React hooks
└── constants/         # App-wide constants and theme

keepupServer/          # Backend (Node.js/Express)
├── models/            # MongoDB schemas
├── routes/            # API endpoints
└── middleware/        # Authentication and other middleware
```

## Getting Started

### Frontend Setup

1. Install dependencies:
   ```bash
   cd keepup
   npm install
   ```

2. Start the Expo app:
   ```bash
   npm start
   ```

3. Open the app in:
   - iOS Simulator
   - Android Emulator
   - Scan QR code with Expo Go on your device

### Backend Setup

1. Install dependencies:
   ```bash
   cd keepupServer
   npm install
   ```

2. Set up environment variables:
   Create a `.env` file with:
   ```
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/keepup
   JWT_SECRET=your_jwt_secret_key
   PORT=818
   ```

3. Start the server:
   ```bash
   npm start
   ```

## Testing Server Connectivity

A debug screen is included to test connectivity with the backend:

1. Launch the app and navigate to the Debug screen
2. The Server Connection Test will attempt to connect to your backend
3. Use the API Tests to verify specific endpoints

For physical devices, update the API_URL in these files:
- `services/api.js`
- `components/ServerTest.js`
- `components/ApiTester.js`

Replace `localhost` with your computer's IP address.

## Data Models

The app uses the following key data models:

- **User**: User profiles, authentication, and preferences
- **Post**: Daily posts with images and descriptions
- **Group**: Groups of users for shared content
- **Comment**: Comments on posts

## Features

- User authentication (register, login, logout)
- Create and view daily posts
- Social connections with friends
- Group-based content sharing
- Modern, clean UI

## Development Notes

- Backend runs locally on port 818 by default
- CORS is configured to allow connections from Expo development servers
- MongoDB is used for data persistence
- JWT authentication is implemented for API security

## Next Steps

- Deploy backend to production (Vercel, Heroku, etc.)
- Implement real-time notifications
- Add image upload capabilities
- Create group management features

# KeepUp App

A full-stack social media application built with React Native (Expo), Express, and MongoDB.

## Project Structure

```
/ (root)
├── client          # React Native (Expo) mobile client
├── server          # Express.js + MongoDB backend
```

## Prerequisites

- Node.js (14+)
- npm or yarn
- MongoDB Atlas account (or local MongoDB installation)
- Expo CLI (`npm install -g expo-cli`)

## Setup

### Server Setup

1. Navigate to the server directory:
   ```
   cd server
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the server directory with the following:
   ```
   MONGODB_URI=your_mongodb_atlas_connection_string
   PORT=5001
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=development
   ```

4. Start the server:
   ```
   npm run dev
   ```

The server will run on http://localhost:5001

### Client Setup

1. Navigate to the client directory:
   ```
   cd client
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the Expo development server:
   ```
   npm start
   ```

4. Use the Expo Go app on your device to scan the QR code, or press 'i' to open in iOS simulator (requires Xcode) or 'a' for Android emulator (requires Android Studio).

## Testing

### Running Server Tests

```
cd server
npm test
```

For watching mode:
```
npm run test:watch
```

For test coverage:
```
npm run test:coverage
```

### Running Client Tests

```
cd client
npm test
```

For watching mode:
```
npm run test:watch
```

For test coverage:
```
npm run test:coverage
```

## API Documentation

The API endpoints are available at `http://localhost:5001/api/`.

Key endpoints:
- `/api/health` - Health check endpoint
- `/api/auth` - Authentication endpoints (login, register, etc.)
- `/api/posts` - Post management
- `/api/users` - User profiles and relationships

## Development

This project uses TypeScript for both client and server. 

- Use `npm run lint` to check code quality
- Make sure MongoDB is properly connected before working on server features
- Check the client-server connection by running both and accessing the health endpoint

## License

[MIT License](LICENSE)

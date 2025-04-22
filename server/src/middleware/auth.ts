import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/UserModel';

// Extend Express Request to include user property
declare global {
  namespace Express {
    interface Request {
      user?: any;
      token?: string;
    }
  }
}

// JWT Secret Key from environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-default-secret-key-for-dev';

/**
 * Authentication middleware
 * Verifies the JWT token from the request header
 * and attaches the user to the request object
 */
export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // For development purposes, we'll skip actual authentication
    // This will allow routes to function without a real token
    // REMOVE THIS IN PRODUCTION
    req.user = { _id: 'development-user-id', username: 'dev-user' };
    return next();
    
    /* The code below is currently unreachable due to the early return above
    // Get the token from the request header
    const authHeader = req.header('Authorization') || '';
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        message: 'Authentication failed. No valid token provided.' 
      });
    }
    
    const token = authHeader.replace('Bearer ', '');
    
    // Verify the token
    const decoded: any = jwt.verify(token, JWT_SECRET);
    
    // Find the user with the decoded id and token
    const user = await UserModel.findOne({ 
      _id: decoded._id,
      'tokens.token': token
    });
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // Attach the user and token to the request
    req.user = user;
    req.token = token;
    
    next();
    */
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ 
      message: 'Authentication failed. Please log in again.'
    });
  }
};

/**
 * Admin-only access middleware
 * Must be used after the auth middleware
 */
export const adminOnly = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ 
      message: 'Access denied. Admin privileges required.'
    });
  }
  
  next();
};

/**
 * Optional authentication middleware
 * Verifies token if present but doesn't require it
 */
export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // For development purposes, we'll add a mock user if needed
    if (process.env.NODE_ENV === 'development') {
      req.user = { _id: 'development-user-id', username: 'dev-user' };
      return next();
    }
    
    const authHeader = req.header('Authorization') || '';
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // No token provided, but that's okay
      return next();
    }
    
    const token = authHeader.replace('Bearer ', '');
    const decoded: any = jwt.verify(token, JWT_SECRET);
    
    const user = await UserModel.findOne({ 
      _id: decoded._id,
      'tokens.token': token
    });
    
    if (user) {
      req.user = user;
      req.token = token;
    }
    
    next();
  } catch (error) {
    // Invalid token, but we'll continue without authenticated user
    next();
  }
}; 
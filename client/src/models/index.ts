// User model
export interface User {
  id: string;
  username: string;
  email: string;
  fullName?: string;
  bio?: string;
  avatar?: string;
  joinedAt: string;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  isFollowing?: boolean;
}

// Post model
export interface Post {
  id: string;
  content: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt?: string;
  author: {
    id: string;
    username: string;
    avatar?: string;
  };
  likes: number;
  comments: number;
  isLiked?: boolean;
  isSaved?: boolean;
}

// Comment model
export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    username: string;
    avatar?: string;
  };
  likes: number;
  isLiked?: boolean;
}

// Group model
export interface Group {
  id: string;
  name: string;
  description?: string;
  coverImage?: string;
  createdAt: string;
  membersCount: number;
  postsCount: number;
  isJoined?: boolean;
  isAdmin?: boolean;
  owner: {
    id: string;
    username: string;
  };
}

// API Response models
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  message: string;
  code?: string;
  statusCode?: number;
  errors?: Record<string, string[]>;
}

// Auth types
export interface AuthTokens {
  token: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  username: string;
  email: string;
  password: string;
  fullName?: string;
}

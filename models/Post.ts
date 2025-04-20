/**
 * Post Model Interface
 * Represents a single daily post in the KeepUp platform
 */

import { User } from './User';

export interface Post {
  id: string;
  _id?: string; // MongoDB ObjectId
  imageUrl: string | object; // URL or required local image
  description: string; // Text caption/description
  createdAt: Date; // Timestamp for chronological sorting
  updatedAt: Date;
  
  // Relationship fields
  authorId: string; // User ID of post creator
  author?: User; // Added author field for populated data
  groupId?: string; // Optional group ID if post is limited to a specific group
  recipientIds?: string[]; // Array of user IDs who can see this post
  
  // Engagement tracking
  comments: {
    user: string;
    text: string;
    createdAt: Date;
  }[];
  likes: string[]; // Array of user IDs who liked the post
  savedBy: string[]; // Array of user IDs who saved the post
} 
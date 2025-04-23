/**
 * Post Model Interface
 * Represents a single daily post in the KeepUp platform
 */

export interface Post {
  id: string;
  imageUrl: string | any; // URL or required local image
  description: string; // Text caption/description
  createdAt: Date; // Timestamp for chronological sorting
  updatedAt: Date;
  
  // Relationship fields
  authorId: string; // User ID of post creator
  groupId?: string; // Optional group ID if post is limited to a specific group
  recipientIds?: string[]; // Array of user IDs who can see this post
  
  // Engagement tracking
  comments: Comment[] | string[]; // Can be embedded comments or just IDs
  likes: string[]; // Array of user IDs who liked the post
  savedBy: string[]; // Array of user IDs who saved the post
} 
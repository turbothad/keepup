/**
 * Comment Model Interface
 * Represents comments on posts
 */

export interface Comment {
  id: string;
  text: string; // Comment content
  createdAt: Date;
  updatedAt: Date;

  // Relationships
  authorId: string; // User ID of comment creator
  postId: string; // Post ID this comment belongs to

  // Optional fields for enhanced features
  likes?: string[]; // Array of user IDs who liked the comment
  parentId?: string; // For nested comments (replies to comments)
}

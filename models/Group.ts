/**
 * Group Model Interface
 * Represents a group of connected users in the KeepUp platform
 */

export enum GroupPrivacy {
  PUBLIC = 'public', // Anyone can join
  PRIVATE = 'private', // Invitation only
  SECRET = 'secret', // Not discoverable, invitation only
}

export interface GroupSettings {
  privacy: GroupPrivacy;
  allowMemberPosts: boolean; // Whether members can post to the group
  allowMemberInvites: boolean; // Whether members can invite others
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;

  // Relationships
  adminId: string; // User ID of group creator/admin
  members: string[]; // Array of user IDs who are members

  // Settings
  settings: GroupSettings;

  // Optional
  avatar?: string; // Group profile image URL
}

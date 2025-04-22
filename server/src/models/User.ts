/**
 * User Model Interface
 * Represents a user in the KeepUp social platform
 */

// Define theme preferences
export enum UserTheme {
  DARK = 'dark',
  LIGHT = 'light',
  SYSTEM = 'system'
}

// User notification settings
export interface NotificationSettings {
  newComments: boolean;
  friendRequests: boolean;
  groupInvites: boolean;
  dailyReminder: boolean;
}

// User privacy settings
export interface PrivacySettings {
  profileVisibility: 'public' | 'friends' | 'private';
  allowFriendRequests: boolean;
}

// User settings/preferences
export interface UserSettings {
  theme: UserTheme;
  notifications: NotificationSettings;
  privacy: PrivacySettings;
}

// Main User interface
export interface User {
  id: string;
  username: string;
  email: string;
  password?: string; // Only used on the backend, never stored in frontend
  profilePicture?: string; // URL to profile picture
  
  // Relationships
  friends: string[]; // Array of friend user IDs
  groups: string[]; // Array of group IDs the user belongs to
  
  // Additional fields
  settings: UserSettings;
  hasPostedToday: boolean; // Flag to track if user has posted for the day
  createdAt: Date;
  updatedAt: Date;
} 
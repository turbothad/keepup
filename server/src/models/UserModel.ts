import mongoose, { Document, Schema } from 'mongoose';

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

// Main User interface that extends Document for MongoDB
export interface IUser extends Document {
  username: string;
  email: string;
  password?: string; // Only used on the backend, never stored in frontend
  profilePicture?: string; // URL to profile picture
  
  // Relationships
  friends: string[] | mongoose.Types.ObjectId[]; // Array of friend user IDs
  groups: string[] | mongoose.Types.ObjectId[]; // Array of group IDs the user belongs to
  
  // Additional fields
  settings: UserSettings;
  hasPostedToday: boolean; // Flag to track if user has posted for the day
  createdAt: Date;
  updatedAt: Date;
}

// Define the schema
const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    select: false, // Won't be returned in queries by default
  },
  profilePicture: {
    type: String,
    default: null,
  },
  friends: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  groups: [{
    type: Schema.Types.ObjectId,
    ref: 'Group',
  }],
  settings: {
    theme: {
      type: String,
      enum: Object.values(UserTheme),
      default: UserTheme.SYSTEM,
    },
    notifications: {
      newComments: { type: Boolean, default: true },
      friendRequests: { type: Boolean, default: true },
      groupInvites: { type: Boolean, default: true },
      dailyReminder: { type: Boolean, default: true },
    },
    privacy: {
      profileVisibility: {
        type: String,
        enum: ['public', 'friends', 'private'],
        default: 'public',
      },
      allowFriendRequests: { type: Boolean, default: true },
    },
  },
  hasPostedToday: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
});

// Create and export the model
export const UserModel = mongoose.models.User || mongoose.model<IUser>('User', userSchema); 
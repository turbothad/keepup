const mongoose = require('mongoose');
const { Schema } = mongoose;

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
      enum: ['dark', 'light', 'system'],
      default: 'system',
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
const User = mongoose.models.User || mongoose.model('User', userSchema);
module.exports = User; 
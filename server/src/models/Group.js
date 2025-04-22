const mongoose = require('mongoose');
const { Schema } = mongoose;

const groupSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
    default: '',
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  profilePicture: {
    type: String, // URL to profile picture
    default: null,
  },
  members: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  posts: [{
    type: Schema.Types.ObjectId,
    ref: 'Post',
  }],
  isPrivate: {
    type: Boolean,
    default: false,
  }
}, {
  timestamps: true,
});

// Create and export the model
const Group = mongoose.models.Group || mongoose.model('Group', groupSchema);
module.exports = Group; 
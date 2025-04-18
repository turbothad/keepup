const mongoose = require('mongoose');
const { Schema } = mongoose;

const postSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
  media: {
    type: String, // URL to media
    default: null,
  },
  group: {
    type: Schema.Types.ObjectId,
    ref: 'Group',
    default: null,
  },
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment',
  }],
}, {
  timestamps: true,
});

// Create and export the model
const Post = mongoose.models.Post || mongoose.model('Post', postSchema);
module.exports = Post; 
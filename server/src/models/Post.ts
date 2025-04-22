/**
 * Post Model Interface
 * Represents a single daily post in the KeepUp platform
 */

import mongoose, { Schema, Document } from 'mongoose';

export interface IPost extends Document {
  content: string;
  imageUrl?: string;
  author: mongoose.Types.ObjectId | string;
  likes: mongoose.Types.ObjectId[] | string[];
  savedBy: mongoose.Types.ObjectId[] | string[];
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema: Schema = new Schema(
  {
    content: {
      type: String,
      required: [true, 'Post content is required'],
      trim: true,
      maxlength: [500, 'Post content cannot exceed 500 characters'],
    },
    imageUrl: {
      type: String,
      trim: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    savedBy: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual field for comments
PostSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'post',
});

// Index for faster queries
PostSchema.index({ author: 1, createdAt: -1 });
PostSchema.index({ createdAt: -1 });

// Pre-save hook example
PostSchema.pre('save', function (next) {
  // Any pre-save logic goes here
  next();
});

// Static method to get feed for user
PostSchema.statics.getFeedForUser = async function (userId: string, limit = 10, page = 1) {
  const User = mongoose.model('User');
  
  // Get user's following list
  const user = await User.findById(userId).select('following');
  
  if (!user) {
    throw new Error('User not found');
  }
  
  // Include user's own posts and posts from followed users
  const following = [...user.following, userId];
  
  const skip = (page - 1) * limit;
  
  // Find posts from followed users and user themselves
  return this.find({ author: { $in: following } })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('author', 'username avatar')
    .populate({
      path: 'comments',
      options: { limit: 3, sort: { createdAt: -1 } },
      populate: { path: 'author', select: 'username avatar' },
    });
};

const Post = mongoose.model<IPost>('Post', PostSchema);

export default Post; 
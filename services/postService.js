const Post = require('../models/Post');
const User = require('../models/User');

/**
 * Post Service
 * Contains methods for Post-related database operations
 */
class PostService {
  /**
   * Create a new post
   * @param {Object} postData - Post data including userId
   * @returns {Promise<Object>} Newly created post
   */
  async createPost(postData) {
    try {
      const post = new Post(postData);
      const savedPost = await post.save();
      
      // Note: Removed hasPostedToday flag update to allow multiple posts per day
      
      return savedPost;
    } catch (error) {
      console.error('Error creating post:', error.message);
      throw error;
    }
  }

  /**
   * Get post by ID
   * @param {string} postId - Post ID
   * @returns {Promise<Object>} Post object
   */
  async getPostById(postId) {
    try {
      return await Post.findById(postId)
        .populate('user', 'username profilePicture')
        .populate({
          path: 'comments',
          populate: {
            path: 'user',
            select: 'username profilePicture',
          }
        });
    } catch (error) {
      console.error('Error getting post by ID:', error.message);
      throw error;
    }
  }

  /**
   * Get posts by user
   * @param {string} userId - User ID
   * @returns {Promise<Array>} Array of post objects
   */
  async getPostsByUser(userId) {
    try {
      return await Post.find({ user: userId })
        .sort({ createdAt: -1 })
        .populate('user', 'username profilePicture')
        .populate({
          path: 'comments',
          populate: {
            path: 'user',
            select: 'username profilePicture',
          }
        });
    } catch (error) {
      console.error('Error getting posts by user:', error.message);
      throw error;
    }
  }

  /**
   * Get feed for user (posts from friends and groups)
   * @param {string} userId - User ID
   * @returns {Promise<Array>} Array of post objects
   */
  async getFeedForUser(userId) {
    try {
      // Get user with friends and groups
      const user = await User.findById(userId)
        .populate('friends')
        .populate('groups');
      
      if (!user) {
        throw new Error('User not found');
      }
      
      // Get friend IDs
      const friendIds = user.friends.map(friend => friend._id);
      
      // Get group IDs
      const groupIds = user.groups.map(group => group._id);
      
      // Get posts from friends and groups
      return await Post.find({
        $or: [
          { user: { $in: [...friendIds, userId] } },
          { group: { $in: groupIds } }
        ]
      })
        .sort({ createdAt: -1 })
        .populate('user', 'username profilePicture')
        .populate('group', 'name')
        .populate({
          path: 'comments',
          populate: {
            path: 'user',
            select: 'username profilePicture',
          }
        });
    } catch (error) {
      console.error('Error getting feed for user:', error.message);
      throw error;
    }
  }

  /**
   * Like a post
   * @param {string} postId - Post ID
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Updated post
   */
  async likePost(postId, userId) {
    try {
      return await Post.findByIdAndUpdate(
        postId,
        { $addToSet: { likes: userId } },
        { new: true }
      );
    } catch (error) {
      console.error('Error liking post:', error.message);
      throw error;
    }
  }

  /**
   * Unlike a post
   * @param {string} postId - Post ID
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Updated post
   */
  async unlikePost(postId, userId) {
    try {
      return await Post.findByIdAndUpdate(
        postId,
        { $pull: { likes: userId } },
        { new: true }
      );
    } catch (error) {
      console.error('Error unliking post:', error.message);
      throw error;
    }
  }

  /**
   * Delete a post
   * @param {string} postId - Post ID
   * @returns {Promise<boolean>} Success status
   */
  async deletePost(postId) {
    try {
      const result = await Post.findByIdAndDelete(postId);
      return !!result;
    } catch (error) {
      console.error('Error deleting post:', error.message);
      throw error;
    }
  }
}

module.exports = new PostService(); 
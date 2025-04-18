const User = require('../models/User');

/**
 * User Service
 * Contains methods for User-related database operations
 */
class UserService {
  /**
   * Create a new user
   * @param {Object} userData - User data
   * @returns {Promise<Object>} Newly created user
   */
  async createUser(userData) {
    try {
      const user = new User(userData);
      return await user.save();
    } catch (error) {
      console.error('Error creating user:', error.message);
      throw error;
    }
  }

  /**
   * Get user by ID
   * @param {string} userId - User ID
   * @returns {Promise<Object>} User object
   */
  async getUserById(userId) {
    try {
      return await User.findById(userId);
    } catch (error) {
      console.error('Error getting user by ID:', error.message);
      throw error;
    }
  }

  /**
   * Get user by username
   * @param {string} username - Username
   * @returns {Promise<Object>} User object
   */
  async getUserByUsername(username) {
    try {
      return await User.findOne({ username });
    } catch (error) {
      console.error('Error getting user by username:', error.message);
      throw error;
    }
  }

  /**
   * Update user
   * @param {string} userId - User ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated user
   */
  async updateUser(userId, updateData) {
    try {
      return await User.findByIdAndUpdate(
        userId,
        updateData,
        { new: true, runValidators: true }
      );
    } catch (error) {
      console.error('Error updating user:', error.message);
      throw error;
    }
  }

  /**
   * Add friend to user
   * @param {string} userId - User ID
   * @param {string} friendId - Friend's user ID
   * @returns {Promise<Object>} Updated user
   */
  async addFriend(userId, friendId) {
    try {
      // Add friend to user's friends list
      await User.findByIdAndUpdate(
        userId,
        { $addToSet: { friends: friendId } }
      );
      
      // Add user to friend's friends list
      return await User.findByIdAndUpdate(
        friendId,
        { $addToSet: { friends: userId } },
        { new: true }
      );
    } catch (error) {
      console.error('Error adding friend:', error.message);
      throw error;
    }
  }

  /**
   * Remove friend from user
   * @param {string} userId - User ID
   * @param {string} friendId - Friend's user ID
   * @returns {Promise<Object>} Updated user
   */
  async removeFriend(userId, friendId) {
    try {
      // Remove friend from user's friends list
      await User.findByIdAndUpdate(
        userId,
        { $pull: { friends: friendId } }
      );
      
      // Remove user from friend's friends list
      return await User.findByIdAndUpdate(
        friendId,
        { $pull: { friends: userId } },
        { new: true }
      );
    } catch (error) {
      console.error('Error removing friend:', error.message);
      throw error;
    }
  }
}

module.exports = new UserService(); 
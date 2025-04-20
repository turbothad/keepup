const express = require('express');
const router = express.Router();
const User = require('../../models/User');

// Get all users
router.get('/', async (req, res) => {
  try {
    console.log('API: Fetching all users');
    const users = await User.find({}, '-password');
    console.log(`API: Successfully retrieved ${users.length} users`);
    res.json(users);
  } catch (error) {
    console.error('API Error - Get users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get user by ID
router.get('/:id', async (req, res) => {
  try {
    console.log(`API: Fetching user with ID: ${req.params.id}`);
    const user = await User.findById(req.params.id, '-password');
    
    if (!user) {
      console.log(`API: User with ID ${req.params.id} not found`);
      return res.status(404).json({ error: 'User not found' });
    }
    
    console.log(`API: Successfully retrieved user: ${user.username}`);
    res.json(user);
  } catch (error) {
    console.error('API Error - Get user by ID:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Update user
router.put('/:id', async (req, res) => {
  try {
    const { name, bio, profilePicture } = req.body;
    const updates = {};
    
    if (name) updates.name = name;
    if (bio !== undefined) updates.bio = bio;
    if (profilePicture) updates.profilePicture = profilePicture;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('API Error - Update user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

module.exports = router; 
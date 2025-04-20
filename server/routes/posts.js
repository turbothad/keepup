const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');
const User = require('../../models/User');
const mongoose = require('mongoose');

// Helper to validate MongoDB ObjectId
const isValidObjectId = (id) => {
  if (!id) return false;
  try {
    return mongoose.Types.ObjectId.isValid(id);
  } catch (e) {
    return false;
  }
};

// Helper to process image URLs
const processImageUrl = (imageUrl) => {
  if (!imageUrl) return null;
  
  console.log('DEBUG - Processing image URL:', typeof imageUrl);
  console.log('DEBUG - Image URL starts with:', imageUrl.substring(0, 50) + (imageUrl.length > 50 ? '...' : ''));
  
  // Handle file:// URLs from simulator
  if (imageUrl.startsWith('file://')) {
    console.log('DEBUG - Local file URL detected, this requires special handling');
    // In production, you would upload this to cloud storage
    return imageUrl;
  }
  
  // Handle data:image URLs (base64)
  if (imageUrl.startsWith('data:image')) {
    console.log('DEBUG - Base64 image detected, length:', imageUrl.length);
    // In production, you would decode and save this to cloud storage
    return imageUrl.substring(0, 100) + '...';
  }
  
  // Regular URL
  return imageUrl;
};

// Get all posts
router.get('/', async (req, res) => {
  try {
    console.log('API: Fetching all posts');
    const posts = await Post.find()
      .populate('user', 'name username profilePicture')
      .sort({ createdAt: -1 });
    
    console.log(`API: Successfully retrieved ${posts.length} posts`);
    res.json(posts);
  } catch (error) {
    console.error('API Error - Get posts:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// Create a new post
router.post('/', async (req, res) => {
  try {
    console.log('API: Creating a new post');
    console.log('DEBUG - Request body:', JSON.stringify(req.body, null, 2));
    
    const { content, description, media, authorId, imageUrl } = req.body;
    
    // Input validation for content or description
    const postContent = content || description;
    if (!postContent) {
      console.log('DEBUG - Missing content/description');
      return res.status(400).json({ error: 'Content is required' });
    }
    
    if (!authorId) {
      console.log('DEBUG - Missing authorId');
      return res.status(400).json({ error: 'Author ID is required' });
    }
    
    // Check if author ID is a valid ObjectId
    if (!isValidObjectId(authorId) && authorId !== 'user1') {
      console.log(`DEBUG - Invalid author ID format: ${authorId}`);
      return res.status(400).json({ error: 'Invalid author ID format' });
    }
    
    // Process image URL if provided
    const processedImageUrl = processImageUrl(imageUrl || media);
    
    // Check if user exists
    console.log(`DEBUG - Looking up user with ID: ${authorId}`);
    
    const user = await User.findById(authorId);
    if (!user) {
      // Special case for testing with "user1"
      if (authorId === 'user1') {
        console.log('DEBUG - Using "user1" as test user, but it doesn\'t exist in the database');
        console.log('DEBUG - Creating mock post for testing purposes');
        
        // Return mock response for testing without saving to DB
        return res.status(201).json({
          _id: 'mock_post_id',
          content: postContent,
          media: processedImageUrl,
          user: { _id: 'user1', name: 'Test User', username: 'user1' },
          createdAt: new Date(),
          likes: [],
          comments: [],
          _mockResponse: true,
          _message: 'Note: This is a mock response. Post was not saved because user1 doesn\'t exist in the database.'
        });
      } else {
        console.log(`DEBUG - User not found: ${authorId}`);
        return res.status(404).json({ error: 'User not found' });
      }
    }
    
    // Create post
    console.log('DEBUG - Creating post with data:', {
      user: authorId,
      content: postContent,
      media: processedImageUrl ? 'Present (truncated)' : null
    });
    
    const post = new Post({
      user: authorId,
      content: postContent,
      media: processedImageUrl,
    });
    
    const savedPost = await post.save();
    console.log(`DEBUG - Post saved successfully with ID: ${savedPost._id}`);
    
    // Return the created post with populated user
    const populatedPost = await Post.findById(savedPost._id)
      .populate('user', 'name username profilePicture');
    
    res.status(201).json(populatedPost);
  } catch (error) {
    console.error('API Error - Create post:', error);
    res.status(500).json({ error: 'Failed to create post', details: error.message });
  }
});

// Get post by ID
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('user', 'name username profilePicture');
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    res.json(post);
  } catch (error) {
    console.error('API Error - Get post by ID:', error);
    res.status(500).json({ error: 'Failed to fetch post' });
  }
});

// Like a post
router.post('/:id/like', async (req, res) => {
  try {
    const { userId } = req.body;
    const postId = req.params.id;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    // Check if user already liked the post
    const alreadyLiked = post.likes.includes(userId);
    
    if (alreadyLiked) {
      // Unlike the post
      post.likes = post.likes.filter(id => id.toString() !== userId);
    } else {
      // Like the post
      post.likes.push(userId);
    }
    
    await post.save();
    res.json(post);
  } catch (error) {
    console.error('API Error - Like post:', error);
    res.status(500).json({ error: 'Failed to update like status' });
  }
});

module.exports = router; 
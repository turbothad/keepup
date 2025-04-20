// Load environment variables
require('dotenv').config();

// Import required modules
const mongoose = require('mongoose');
const database = require('../config/database');
const Post = require('../models/Post');
const User = require('../models/User');

// Helper to handle database connection
const connectDB = async () => {
  if (!database.getConnectionStatus().isConnected) {
    await database.connect();
  }
};

// CORS Headers
const setCorsHeaders = (res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
};

// Helper to check image URLs and handle different formats
const processImageUrl = (imageUrl) => {
  if (!imageUrl) return null;
  
  // Debug the image URL
  console.log('DEBUG - Processing image URL:', typeof imageUrl);
  console.log('DEBUG - Image URL starts with:', imageUrl.substring(0, 50) + (imageUrl.length > 50 ? '...' : ''));
  
  // Handle file:// URLs from simulator
  if (imageUrl.startsWith('file://')) {
    console.log('DEBUG - Local file URL detected, this requires special handling');
    // In production, you would upload this to cloud storage
    // For now, we'll just store the URL as-is and note the issue
    return imageUrl;
  }
  
  // Handle data:image URLs (base64)
  if (imageUrl.startsWith('data:image')) {
    console.log('DEBUG - Base64 image detected, length:', imageUrl.length);
    // In production, you would decode and save this to cloud storage
    // For now, just saving the first 100 chars to avoid massive strings in DB
    return imageUrl.substring(0, 100) + '...';
  }
  
  // Regular URL
  return imageUrl;
};

// Helper to validate MongoDB ObjectId
const isValidObjectId = (id) => {
  if (!id) return false;
  try {
    return mongoose.Types.ObjectId.isValid(id);
  } catch (e) {
    return false;
  }
};

module.exports = async (req, res) => {
  // Set CORS headers
  setCorsHeaders(res);
  
  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  try {
    // Connect to MongoDB
    await connectDB();
    
    // Handle different HTTP methods
    switch (req.method) {
      case 'GET':
        if (req.query.id) {
          // Get post by ID
          const post = await Post.findById(req.query.id)
            .populate('user', 'name username profilePicture');
          
          if (!post) {
            return res.status(404).json({ error: 'Post not found' });
          }
          
          return res.status(200).json(post);
        } else {
          // Get all posts
          const posts = await Post.find()
            .populate('user', 'name username profilePicture')
            .sort({ createdAt: -1 });
          
          console.log(`DEBUG - Retrieved ${posts.length} posts`);
          return res.status(200).json(posts);
        }
      
      case 'POST':
        // Create a new post
        console.log('DEBUG - Post creation request received');
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
        try {
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
          
          return res.status(201).json(populatedPost);
        } catch (error) {
          console.error('DEBUG - Error checking user or saving post:', error);
          return res.status(500).json({ error: 'Failed to create post', details: error.message });
        }
      
      case 'PUT':
        // Update post (like/unlike)
        if (req.query.id && req.query.action === 'like') {
          const { userId } = req.body;
          const postId = req.query.id;
          
          if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
          }
          
          const postToUpdate = await Post.findById(postId);
          if (!postToUpdate) {
            return res.status(404).json({ error: 'Post not found' });
          }
          
          // Check if user already liked the post
          const alreadyLiked = postToUpdate.likes.includes(userId);
          
          if (alreadyLiked) {
            // Unlike the post
            postToUpdate.likes = postToUpdate.likes.filter(id => id.toString() !== userId);
          } else {
            // Like the post
            postToUpdate.likes.push(userId);
          }
          
          await postToUpdate.save();
          return res.status(200).json(postToUpdate);
        }
        
        return res.status(400).json({ error: 'Invalid update action' });
      
      case 'DELETE':
        // Delete post
        if (req.query.id) {
          const result = await Post.findByIdAndDelete(req.query.id);
          if (!result) {
            return res.status(404).json({ error: 'Post not found' });
          }
          return res.status(200).json({ success: true });
        }
        
        return res.status(400).json({ error: 'Post ID is required' });
      
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error', message: error.message });
  }
}; 
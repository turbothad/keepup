import express from 'express';
import { auth } from '../middleware/auth';
import postController from '../controllers/postController';

const router = express.Router();

// Get posts feed
// GET /api/posts
router.get('/', auth, postController.getFeed);

// Get a specific post
// GET /api/posts/:postId
router.get('/:postId', auth, postController.getPostById);

// Create a new post
// POST /api/posts
router.post('/', auth, postController.createPost);

// Update a post
// PUT /api/posts/:postId
router.put('/:postId', auth, postController.updatePost);

// Delete a post
// DELETE /api/posts/:postId
router.delete('/:postId', auth, postController.deletePost);

// Like a post
// POST /api/posts/:postId/like
router.post('/:postId/like', auth, postController.likePost);

// Unlike a post
// DELETE /api/posts/:postId/like
router.delete('/:postId/like', auth, postController.unlikePost);

// Save a post
// POST /api/posts/:postId/save
router.post('/:postId/save', auth, postController.savePost);

// Unsave a post
// DELETE /api/posts/:postId/save
router.delete('/:postId/save', auth, postController.unsavePost);

// Get all comments for a post
// GET /api/posts/:postId/comments
router.get('/:postId/comments', auth, postController.getComments);

// Add a comment to a post
// POST /api/posts/:postId/comments
router.post('/:postId/comments', auth, postController.addComment);

// Delete a comment
// DELETE /api/posts/:postId/comments/:commentId
router.delete('/:postId/comments/:commentId', auth, postController.deleteComment);

export default router; 
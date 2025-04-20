const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const env = require('../config/environment');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Debug startup
console.log('Server starting with MongoDB URI:', env.MONGODB_URI ? 'URI present (hidden)' : 'URI missing');

// Middleware
app.use(cors());
// Increase JSON payload size limit for image uploads
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Database connection
mongoose.connect(env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define User schema
const userSchema = new mongoose.Schema({
  id: String,
  username: String,
  email: String,
  profilePicture: String,
  friends: [String],
  groups: [String],
  settings: {
    theme: String,
    notifications: {
      newComments: Boolean,
      friendRequests: Boolean,
      groupInvites: Boolean,
      dailyReminder: Boolean
    },
    privacy: {
      profileVisibility: String,
      allowFriendRequests: Boolean
    }
  },
  hasPostedToday: Boolean,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Define Post schema
const postSchema = new mongoose.Schema({
  imageUrl: String,
  description: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  authorId: String,
  groupId: String,
  comments: [{ user: String, text: String, createdAt: Date }],
  likes: [String],
  savedBy: [String]
});

// Create models
const User = mongoose.model('User', userSchema);
const Post = mongoose.model('Post', postSchema);

// Seed initial users if none exist
const seedInitialUsers = async () => {
  const count = await User.countDocuments();
  if (count === 0) {
    console.log('Seeding initial users...');
    const initialUsers = [
      {
        id: 'user1',
        username: 'John Doe',
        email: 'john@example.com',
        profilePicture: 'https://via.placeholder.com/40',
        friends: ['user2', 'user3'],
        groups: ['1', '2'],
        settings: {
          theme: 'DARK',
          notifications: {
            newComments: true,
            friendRequests: true,
            groupInvites: true,
            dailyReminder: true
          },
          privacy: {
            profileVisibility: 'public',
            allowFriendRequests: true
          }
        },
        hasPostedToday: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'user2',
        username: 'Jane Smith',
        email: 'jane@example.com',
        profilePicture: 'https://via.placeholder.com/40',
        friends: ['user1', 'user3'],
        groups: ['3'],
        settings: {
          theme: 'DARK',
          notifications: {
            newComments: true,
            friendRequests: true,
            groupInvites: true,
            dailyReminder: false
          },
          privacy: {
            profileVisibility: 'friends',
            allowFriendRequests: true
          }
        },
        hasPostedToday: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'user3',
        username: 'Mike Johnson',
        email: 'mike@example.com',
        profilePicture: 'https://via.placeholder.com/40',
        friends: ['user1', 'user2'],
        groups: ['1', '2'],
        settings: {
          theme: 'DARK',
          notifications: {
            newComments: true,
            friendRequests: true,
            groupInvites: true,
            dailyReminder: true
          },
          privacy: {
            profileVisibility: 'public',
            allowFriendRequests: true
          }
        },
        hasPostedToday: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    await User.insertMany(initialUsers);
    console.log('Initial users seeded successfully');
  }
};

// Call the seed function
seedInitialUsers();

// API Routes
const apiRouter = express.Router();

// Get all users
apiRouter.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get user by ID
apiRouter.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findOne({ id: req.params.id });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Get all posts
apiRouter.get('/posts', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    
    // Get all users to include with posts
    const users = await User.find();
    
    // Map posts with author data
    const postsWithAuthors = posts.map(post => {
      const author = users.find(user => user.id === post.authorId);
      return {
        ...post.toObject(),
        author: author ? author.toObject() : null
      };
    });
    
    res.json(postsWithAuthors);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// Create a new post
apiRouter.post('/posts', async (req, res) => {
  try {
    console.log('Server: Received post creation request');
    const { imageUrl, description, authorId, groupId } = req.body;
    
    // Debug the request
    console.log('Server: Post data received', {
      hasImageUrl: !!imageUrl,
      imageUrlType: typeof imageUrl,
      imageUrlLength: typeof imageUrl === 'string' ? imageUrl.length : 'Not a string',
      descriptionLength: description?.length || 0,
      authorId,
      groupId
    });
    
    // Verify author exists
    console.log('Server: Looking up author with ID:', authorId);
    const author = await User.findOne({ id: authorId });
    
    if (!author) {
      console.error('Server: Author not found:', authorId);
      return res.status(400).json({ error: 'Author not found' });
    }
    
    console.log('Server: Author found:', author.username);
    
    // Check if imageUrl is too large for MongoDB (BSON limit ~16MB)
    if (typeof imageUrl === 'string' && imageUrl.length > 15000000) {
      console.error('Server: Image URL too large for MongoDB storage');
      return res.status(400).json({ error: 'Image too large. Please use a smaller image.' });
    }
    
    const newPost = new Post({
      imageUrl,
      description,
      authorId,
      groupId,
      createdAt: new Date(),
      updatedAt: new Date(),
      comments: [],
      likes: [],
      savedBy: []
    });
    
    console.log('Server: Saving new post to database');
    const savedPost = await newPost.save();
    console.log('Server: Post saved successfully with ID:', savedPost._id);
    
    // Return post with author data
    res.status(201).json({
      ...savedPost.toObject(),
      author: author.toObject()
    });
  } catch (error) {
    console.error('Server: Error creating post:', error);
    res.status(500).json({ error: 'Failed to create post: ' + error.message });
  }
});

// Like a post
apiRouter.post('/posts/:id/like', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    // Toggle like
    const userLikedIndex = post.likes.indexOf(userId);
    if (userLikedIndex > -1) {
      // User already liked, remove like
      post.likes.splice(userLikedIndex, 1);
    } else {
      // Add like
      post.likes.push(userId);
    }
    
    post.updatedAt = new Date();
    const updatedPost = await post.save();
    res.json(updatedPost);
  } catch (error) {
    console.error('Error liking post:', error);
    res.status(500).json({ error: 'Failed to like post' });
  }
});

// Save a post
apiRouter.post('/posts/:id/save', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    // Toggle save
    const userSavedIndex = post.savedBy.indexOf(userId);
    if (userSavedIndex > -1) {
      // User already saved, remove save
      post.savedBy.splice(userSavedIndex, 1);
    } else {
      // Add save
      post.savedBy.push(userId);
    }
    
    const updatedPost = await post.save();
    res.json(updatedPost);
  } catch (error) {
    console.error('Error saving post:', error);
    res.status(500).json({ error: 'Failed to save post' });
  }
});

// Register API routes
app.use('/api', apiRouter);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 
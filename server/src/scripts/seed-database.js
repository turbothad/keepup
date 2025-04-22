/**
 * Database Seeding Script
 * Run with 'node scripts/seed-database.js'
 * 
 * This script populates the database with initial demo data
 */

// Load environment variables
require('dotenv').config();

// Import the database connection
const database = require('../config/database');

// Import models
const { User, Post, Comment, Group } = require('../models');

// Seed data
const seedUsers = [
  {
    username: 'johndoe',
    email: 'john@example.com',
    password: 'password123',
    profilePicture: 'https://randomuser.me/api/portraits/men/1.jpg',
    settings: {
      theme: 'system',
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
    }
  },
  {
    username: 'janedoe',
    email: 'jane@example.com',
    password: 'password123',
    profilePicture: 'https://randomuser.me/api/portraits/women/1.jpg',
    settings: {
      theme: 'dark',
      notifications: {
        newComments: true,
        friendRequests: true,
        groupInvites: false,
        dailyReminder: true
      },
      privacy: {
        profileVisibility: 'friends',
        allowFriendRequests: true
      }
    }
  },
  {
    username: 'bobsmith',
    email: 'bob@example.com',
    password: 'password123',
    profilePicture: 'https://randomuser.me/api/portraits/men/2.jpg',
    settings: {
      theme: 'light',
      notifications: {
        newComments: false,
        friendRequests: true,
        groupInvites: true,
        dailyReminder: false
      },
      privacy: {
        profileVisibility: 'public',
        allowFriendRequests: true
      }
    }
  }
];

// Seed the database
async function seedDatabase() {
  try {
    // Connect to the database
    await database.connect();
    console.log('Connected to database');

    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Post.deleteMany({});
    await Comment.deleteMany({});
    await Group.deleteMany({});

    // Seed users
    console.log('Seeding users...');
    const users = await User.insertMany(seedUsers);
    console.log(`Created ${users.length} users`);

    // Make users friends with each other
    console.log('Creating friendships...');
    await User.findByIdAndUpdate(users[0]._id, { $push: { friends: [users[1]._id, users[2]._id] } });
    await User.findByIdAndUpdate(users[1]._id, { $push: { friends: [users[0]._id, users[2]._id] } });
    await User.findByIdAndUpdate(users[2]._id, { $push: { friends: [users[0]._id, users[1]._id] } });

    // Create a group
    console.log('Creating group...');
    const group = await Group.create({
      name: 'KeepUp Friends',
      description: 'A group for friends in the KeepUp app',
      creator: users[0]._id,
      members: [users[0]._id, users[1]._id, users[2]._id],
      isPrivate: false
    });

    // Add group to users
    await User.updateMany(
      { _id: { $in: [users[0]._id, users[1]._id, users[2]._id] } },
      { $push: { groups: group._id } }
    );

    // Create posts
    console.log('Creating posts...');
    const posts = await Post.insertMany([
      {
        user: users[0]._id,
        content: 'Hello world! This is my first post on KeepUp!',
        likes: [users[1]._id, users[2]._id]
      },
      {
        user: users[1]._id,
        content: 'Excited to be part of this community!',
        likes: [users[0]._id]
      },
      {
        user: users[2]._id,
        content: 'Just finished my daily goal! #keepingup',
        likes: [users[0]._id, users[1]._id]
      },
      {
        user: users[0]._id,
        content: 'Group post for everyone!',
        group: group._id,
        likes: [users[1]._id]
      }
    ]);

    // Create comments
    console.log('Creating comments...');
    const comments = await Comment.insertMany([
      {
        user: users[1]._id,
        post: posts[0]._id,
        content: 'Welcome to KeepUp!',
        likes: [users[0]._id]
      },
      {
        user: users[2]._id,
        post: posts[0]._id,
        content: 'Great first post!',
        likes: []
      },
      {
        user: users[0]._id,
        post: posts[1]._id,
        content: 'Glad to have you here!',
        likes: [users[1]._id]
      }
    ]);

    // Add comments to posts
    await Post.findByIdAndUpdate(posts[0]._id, { $push: { comments: [comments[0]._id, comments[1]._id] } });
    await Post.findByIdAndUpdate(posts[1]._id, { $push: { comments: comments[2]._id } });

    console.log('Database seeded successfully!');
    
    // Display summary
    console.log('\nSeed Summary:');
    console.log(`- Users: ${await User.countDocuments()}`);
    console.log(`- Groups: ${await Group.countDocuments()}`);
    console.log(`- Posts: ${await Post.countDocuments()}`);
    console.log(`- Comments: ${await Comment.countDocuments()}`);

    // Disconnect from database
    await database.disconnect();
    
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

// Run the seeder
seedDatabase(); 
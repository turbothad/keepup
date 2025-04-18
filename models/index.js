/**
 * Models Index
 * Central export point for all data models using CommonJS syntax
 */

const User = require('./User');
const Post = require('./Post');
const Comment = require('./Comment');
const Group = require('./Group');

module.exports = {
  User,
  Post,
  Comment,
  Group
}; 
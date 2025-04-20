import React, { useState, useEffect } from 'react';
import { FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import PostCard from '../components/posts/PostCard';
import { Post } from '../models/Post';
import { User, UserTheme } from '../models/User';
import { PostsAPI, UsersAPI } from '../services/api';

// Debug UserTheme
console.log('UserTheme import check:', UserTheme);

export default function Feed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const currentUserId = 'user1'; // In a real app, this would come from authentication

  useEffect(() => {
    // Fetch posts when component mounts
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // The API now includes the author object with each post
      const fetchedPosts = await PostsAPI.getPosts();
      setPosts(fetchedPosts);
      
    } catch (err) {
      console.error('Failed to fetch data:', err);
      setError('Failed to load feed. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId: string) => {
    try {
      await PostsAPI.likePost(postId, currentUserId);
      // Update local state to reflect the like
      setPosts(posts.map(post => {
        if (post.id === postId) {
          // If user already liked it, remove like (toggle)
          const userLikedIndex = post.likes.indexOf(currentUserId);
          if (userLikedIndex > -1) {
            return {
              ...post,
              likes: post.likes.filter(id => id !== currentUserId)
            };
          } 
          // Otherwise add the like
          return {
            ...post,
            likes: [...post.likes, currentUserId]
          };
        }
        return post;
      }));
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  const handleSave = async (postId: string) => {
    try {
      await PostsAPI.savePost(postId, currentUserId);
      // Update local state to reflect the save
      setPosts(posts.map(post => {
        if (post.id === postId) {
          // If user already saved it, remove save (toggle)
          const userSavedIndex = post.savedBy.indexOf(currentUserId);
          if (userSavedIndex > -1) {
            return {
              ...post,
              savedBy: post.savedBy.filter(id => id !== currentUserId)
            };
          } 
          // Otherwise add the save
          return {
            ...post,
            savedBy: [...post.savedBy, currentUserId]
          };
        }
        return post;
      }));
    } catch (err) {
      console.error('Error saving post:', err);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>Feed</ThemedText>
      <ThemedText style={styles.subtitle}>Your chronological timeline</ThemedText>
      
      {loading ? (
        <ActivityIndicator size="large" color="#fff" />
      ) : error ? (
        <ThemedText style={styles.errorText}>{error}</ThemedText>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item._id || item.id}
          renderItem={({ item }) => (
            <PostCard 
              post={item}
              author={item.author}
              currentUserId={currentUserId}
              onLike={handleLike}
              onSave={handleSave}
            />
          )}
          style={styles.list}
          refreshing={loading}
          onRefresh={fetchData}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#000',
  },
  title: {
    marginTop: 20,
    marginBottom: 10,
  },
  subtitle: {
    marginBottom: 20,
    fontSize: 18,
  },
  list: {
    width: '100%',
    paddingHorizontal: 10,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    margin: 20,
  }
}); 
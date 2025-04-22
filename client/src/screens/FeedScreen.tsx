import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl } from 'react-native';
import PostCard from '../components/posts/PostCard';
import { useTheme } from '../hooks/useTheme';

interface Post {
  id: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    username: string;
    avatar?: string;
  };
  likes: number;
  comments: number;
}

export default function FeedScreen() {
  const { colors } = useTheme();
  const [posts, setPosts] = useState<Post[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch posts
  const fetchPosts = async () => {
    try {
      setLoading(true);
      // Replace with actual API call
      const response = await fetch('https://api.keepup.com/posts');
      const data = await response.json();
      setPosts(data.posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      // Use sample data for now
      setPosts([
        {
          id: '1',
          content: 'Just launched my new project!',
          createdAt: new Date().toISOString(),
          author: {
            id: '101',
            username: 'techguru',
            avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
          },
          likes: 24,
          comments: 5,
        },
        {
          id: '2',
          content: 'Beautiful day for a hike! #outdoors #nature',
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          author: {
            id: '102',
            username: 'adventurer',
            avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
          },
          likes: 42,
          comments: 8,
        },
      ]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchPosts();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PostCard post={item} />}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.text }]}>
              {loading ? 'Loading posts...' : 'No posts found.'}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    height: 300,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
});

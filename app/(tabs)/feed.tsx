import React, { useState, useEffect, useContext } from 'react';
import {
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import { PostService } from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import PostCard from '../../components/posts/PostCard';
import { User, UserTheme } from '../../models/User';

// Interface for the post data structure coming from the API
interface ApiPost {
  _id: string;
  content: string;
  mediaUrl?: string;
  createdAt: string;
  updatedAt: string;
  likes: Array<{ _id: string } | string>;
  comments: any[];
  user: {
    _id: string;
    username: string;
    profilePicture?: string;
  };
}

// Create a simplified author object for the PostCard
const createAuthorFromApiUser = (apiUser: ApiPost['user']): User => ({
  id: apiUser._id,
  username: apiUser.username,
  email: '', // Not provided by the API response
  profilePicture: apiUser.profilePicture,
  friends: [],
  groups: [],
  settings: {
    theme: UserTheme.DARK,
    notifications: {
      newComments: true,
      friendRequests: true,
      groupInvites: true,
      dailyReminder: true,
    },
    privacy: {
      profileVisibility: 'public',
      allowFriendRequests: true,
    },
  },
  hasPostedToday: false,
  createdAt: new Date(),
  updatedAt: new Date(),
});

export default function FeedScreen() {
  const [posts, setPosts] = useState<ApiPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showFriendsOnly, setShowFriendsOnly] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    // Log the current user and their friends list
    console.log('Current user:', JSON.stringify(user, null, 2));
    console.log('User friends:', user?.friends);
  }, [user]);

  // Check and refresh auth token if needed
  const ensureAuth = async () => {
    try {
      // Check if token exists
      const token = await AsyncStorage.getItem('@auth_token');
      console.log('Current auth token:', token ? 'Token exists' : 'No token');

      if (!token) {
        setAuthError('You need to log in to view posts.');
        return false;
      }

      // Set token in axios headers
      axios.defaults.headers.common['x-auth-token'] = token;
      return true;
    } catch (error) {
      console.error('Error checking auth token:', error);
      setAuthError('Authentication error. Please log in again.');
      return false;
    }
  };

  const fetchPosts = async () => {
    setAuthError(null);

    // Ensure we have a valid auth token
    const isAuthenticated = await ensureAuth();
    if (!isAuthenticated) {
      setLoading(false);
      setRefreshing(false);
      return;
    }

    try {
      // Fetch either all posts or just friends' posts based on the filter
      const fetchedPosts = showFriendsOnly
        ? await PostService.getFriendsPosts()
        : await PostService.getPosts();

      // Log the full posts data to inspect what's coming from the API
      console.log('Posts from API:', JSON.stringify(fetchedPosts, null, 2));

      // Sort posts in chronological order (newest first)
      const sortedPosts = fetchedPosts.sort(
        (a: ApiPost, b: ApiPost) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setPosts(sortedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      if (
        error &&
        typeof error === 'object' &&
        'message' in error &&
        error.message === 'No token, authorization denied'
      ) {
        setAuthError('Your session has expired. Please log in again.');
      } else {
        setAuthError('Error loading posts. Please try again.');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [showFriendsOnly]); // Re-fetch when filter changes

  const handleRefresh = () => {
    setRefreshing(true);
    fetchPosts();
  };

  const handleLike = async (postId: string) => {
    // Ensure we have a valid auth token
    const isAuthenticated = await ensureAuth();
    if (!isAuthenticated) return;

    try {
      // Call the like endpoint
      await PostService.likePost(postId);
      // Refresh posts to get updated like status
      fetchPosts();
    } catch (error) {
      console.error('Error liking post:', error);
      Alert.alert('Error', 'Unable to like post. Please try again.');
    }
  };

  const toggleFriendsOnly = () => {
    setShowFriendsOnly(!showFriendsOnly);
  };

  // Filter posts by friends if the toggle is on
  const displayedPosts = showFriendsOnly
    ? user?.friends
      ? posts.filter((post) => {
          const postUserId = post.user._id;
          const isFriend = user.friends.some(
            (friendId: string) =>
              friendId === postUserId || friendId === postUserId.toString()
          );

          // Debug logging for each post's user ID and whether they're a friend
          console.log(
            `Post by user ${post.user.username} (ID: ${postUserId}): ${isFriend ? 'Is friend' : 'Not a friend'}`
          );

          return isFriend;
        })
      : [] // Return empty array if no friends list exists
    : posts;

  const hasFriendsList = user && Array.isArray(user.friends);

  if (loading) {
    return (
      <ThemedView style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  if (authError) {
    return (
      <ThemedView style={[styles.container, styles.centered]}>
        <ThemedText type="subtitle" style={styles.errorText}>
          {authError}
        </ThemedText>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => fetchPosts()}
        >
          <ThemedText style={styles.retryText}>Retry</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          Activity Feed
        </ThemedText>
        <TouchableOpacity
          style={[styles.filterButton, showFriendsOnly && styles.activeFilter]}
          onPress={toggleFriendsOnly}
        >
          <ThemedText style={styles.filterText}>
            {showFriendsOnly ? 'Friends Only' : 'All Posts'}
          </ThemedText>
        </TouchableOpacity>
      </View>

      {showFriendsOnly && !hasFriendsList && (
        <ThemedView style={styles.warningContainer}>
          <ThemedText style={styles.warningText}>
            Your profile doesn't have a friends list. Please update your profile
            or add friends.
          </ThemedText>
        </ThemedView>
      )}

      <FlatList
        data={displayedPosts}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <PostCard
            post={{
              id: item._id,
              imageUrl: item.mediaUrl,
              description: item.content,
              createdAt: new Date(item.createdAt),
              updatedAt: new Date(item.updatedAt),
              authorId: item.user._id,
              likes: item.likes.map((like) =>
                typeof like === 'string' ? like : like._id
              ),
              comments: item.comments,
              savedBy: [], // Backend doesn't seem to track this yet
            }}
            author={createAuthorFromApiUser(item.user)}
            currentUserId={user?.id}
            onLike={handleLike}
            onSave={() => {}} // Implement when backend supports it
          />
        )}
        style={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          <ThemedView style={styles.emptyContainer}>
            <ThemedText style={styles.emptyText}>
              {showFriendsOnly
                ? hasFriendsList
                  ? 'No posts from friends yet'
                  : "You don't have any friends added yet"
                : 'No posts yet'}
            </ThemedText>
          </ThemedView>
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  activeFilter: {
    backgroundColor: '#0066cc',
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    opacity: 0.7,
  },
  errorText: {
    marginBottom: 20,
    opacity: 0.8,
    textAlign: 'center',
  },
  filterButton: {
    backgroundColor: '#333',
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  filterText: {
    fontSize: 12,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  list: {
    flex: 1,
  },
  retryButton: {
    backgroundColor: '#0066cc',
    borderRadius: 5,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  retryText: {
    color: '#fff',
  },
  title: {
    flex: 1,
  },
  warningContainer: {
    backgroundColor: '#664d00',
    borderRadius: 5,
    marginBottom: 15,
    padding: 10,
  },
  warningText: {
    color: '#fff',
    fontSize: 14,
  },
});

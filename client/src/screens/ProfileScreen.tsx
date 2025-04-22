import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  FlatList, 
  ScrollView 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import PostCard from '../components/posts/PostCard';

interface User {
  id: string;
  username: string;
  fullName: string;
  bio?: string;
  avatar?: string;
  followersCount: number;
  followingCount: number;
  postsCount: number;
}

interface UserPost {
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

export default function ProfileScreen() {
  const { colors } = useTheme();
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<UserPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('posts');

  // Fetch user data
  useEffect(() => {
    // TODO: Replace with actual API calls
    // Simulate API call
    setTimeout(() => {
      setUser({
        id: '1',
        username: 'johndoe',
        fullName: 'John Doe',
        bio: 'Software developer and photography enthusiast',
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
        followersCount: 245,
        followingCount: 186,
        postsCount: 42
      });
      
      setPosts([
        {
          id: '1',
          content: 'Just launched my new project!',
          createdAt: new Date().toISOString(),
          author: {
            id: '1',
            username: 'johndoe',
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
            id: '1',
            username: 'johndoe',
            avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
          },
          likes: 42,
          comments: 8,
        },
      ]);
      
      setLoading(false);
    }, 1000);
  }, []);

  if (loading || !user) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Image 
          source={{ uri: user.avatar || 'https://via.placeholder.com/100' }} 
          style={styles.avatar} 
        />
        
        <View style={styles.userInfo}>
          <Text style={[styles.fullName, { color: colors.text }]}>{user.fullName}</Text>
          <Text style={[styles.username, { color: colors.tabIconDefault }]}>@{user.username}</Text>
          {user.bio && <Text style={[styles.bio, { color: colors.text }]}>{user.bio}</Text>}
        </View>
        
        <TouchableOpacity 
          style={[styles.editButton, { borderColor: colors.primary }]}
        >
          <Text style={{ color: colors.primary }}>Edit Profile</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.stats}>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: colors.text }]}>{user.postsCount}</Text>
          <Text style={[styles.statLabel, { color: colors.tabIconDefault }]}>Posts</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: colors.text }]}>{user.followersCount}</Text>
          <Text style={[styles.statLabel, { color: colors.tabIconDefault }]}>Followers</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: colors.text }]}>{user.followingCount}</Text>
          <Text style={[styles.statLabel, { color: colors.tabIconDefault }]}>Following</Text>
        </View>
      </View>
      
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[
            styles.tab, 
            activeTab === 'posts' && { borderBottomColor: colors.primary }
          ]} 
          onPress={() => setActiveTab('posts')}
        >
          <Ionicons 
            name="grid-outline" 
            size={24} 
            color={activeTab === 'posts' ? colors.primary : colors.tabIconDefault} 
          />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.tab, 
            activeTab === 'saved' && { borderBottomColor: colors.primary }
          ]} 
          onPress={() => setActiveTab('saved')}
        >
          <Ionicons 
            name="bookmark-outline" 
            size={24} 
            color={activeTab === 'saved' ? colors.primary : colors.tabIconDefault} 
          />
        </TouchableOpacity>
      </View>
      
      {activeTab === 'posts' && posts.length > 0 && (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <PostCard post={item} />}
          scrollEnabled={false}
        />
      )}
      
      {activeTab === 'posts' && posts.length === 0 && (
        <View style={styles.emptyContainer}>
          <Ionicons name="images-outline" size={48} color={colors.tabIconDefault} />
          <Text style={[styles.emptyText, { color: colors.text }]}>
            No posts yet
          </Text>
        </View>
      )}
      
      {activeTab === 'saved' && (
        <View style={styles.emptyContainer}>
          <Ionicons name="bookmark-outline" size={48} color={colors.tabIconDefault} />
          <Text style={[styles.emptyText, { color: colors.text }]}>
            No saved posts
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 16,
    alignItems: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  userInfo: {
    alignItems: 'center',
    marginBottom: 16,
  },
  fullName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  username: {
    fontSize: 16,
    marginBottom: 8,
  },
  bio: {
    fontSize: 14,
    textAlign: 'center',
  },
  editButton: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#ddd',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#ddd',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    marginTop: 8,
    fontSize: 16,
  },
});

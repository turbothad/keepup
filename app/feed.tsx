import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import PostCard from '../components/posts/PostCard';
import { Post } from '../models/Post';
import { User, UserTheme } from '../models/User';

// Sample users data
const sampleUsers: User[] = [
  {
    id: 'user1',
    username: 'John Doe',
    email: 'john@example.com',
    profilePicture: 'https://via.placeholder.com/40',
    friends: ['user2', 'user3'],
    groups: ['1', '2'],
    settings: {
      theme: UserTheme.DARK,
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
      theme: UserTheme.DARK,
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
      theme: UserTheme.DARK,
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

// Sample posts data
const samplePosts: Post[] = [
  {
    id: '1',
    imageUrl: 'https://via.placeholder.com/400',
    description: 'Just had a great day hiking with the family!',
    createdAt: new Date(Date.now() - 3600000), // 1 hour ago
    updatedAt: new Date(Date.now() - 3600000),
    authorId: 'user1',
    groupId: '1',
    comments: [],
    likes: ['user2', 'user3'],
    savedBy: ['user2']
  },
  {
    id: '2',
    imageUrl: 'https://via.placeholder.com/400',
    description: 'Our team just shipped a major feature. So proud of everyone!',
    createdAt: new Date(Date.now() - 7200000), // 2 hours ago
    updatedAt: new Date(Date.now() - 7200000),
    authorId: 'user2',
    groupId: '3',
    comments: [],
    likes: ['user1', 'user3'],
    savedBy: []
  },
  {
    id: '3',
    imageUrl: 'https://via.placeholder.com/400',
    description: 'Reuniting with my college friends next weekend!',
    createdAt: new Date(Date.now() - 86400000), // 1 day ago
    updatedAt: new Date(Date.now() - 86400000),
    authorId: 'user3',
    groupId: '2',
    comments: [],
    likes: ['user1'],
    savedBy: ['user1', 'user2']
  },
];

export default function Feed() {
  const currentUserId = 'user1'; // In a real app, this would come from authentication

  const handleLike = (postId: string) => {
    console.log(`Like pressed for post: ${postId}`);
    // In a real app, this would call an API to like the post
  };

  const handleSave = (postId: string) => {
    console.log(`Save pressed for post: ${postId}`);
    // In a real app, this would call an API to save the post
  };

  // Function to find the author of a post
  const findAuthor = (authorId: string): User => {
    const author = sampleUsers.find(user => user.id === authorId);
    if (!author) {
      throw new Error(`Author with ID ${authorId} not found`);
    }
    return author;
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>Feed</ThemedText>
      <ThemedText style={styles.subtitle}>Your chronological timeline</ThemedText>
      
      <FlatList
        data={samplePosts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PostCard 
            post={item}
            author={findAuthor(item.authorId)}
            currentUserId={currentUserId}
            onLike={handleLike}
            onSave={handleSave}
          />
        )}
        style={styles.list}
      />
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
  }
}); 
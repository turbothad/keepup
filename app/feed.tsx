import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import PostCard from '../components/posts/PostCard';
import { User } from '../models/User';

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
    const author = sampleUsers.find((user) => user.id === authorId);
    if (!author) {
      throw new Error(`Author with ID ${authorId} not found`);
    }
    return author;
  };

  return (
    <ThemedView style={styles.container}>
      <Text style={styles.title}>Feed</Text>
      <Text style={styles.subtitle}>Your chronological timeline</Text>

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
    alignItems: 'center',
    backgroundColor: '#000',
    flex: 1,
  },
  list: {
    paddingHorizontal: 10,
    width: '100%',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
  },
  title: {
    marginBottom: 10,
    marginTop: 20,
  },
});

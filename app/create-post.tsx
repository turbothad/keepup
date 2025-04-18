import React from 'react';
import { StyleSheet } from 'react-native';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import CreatePostForm from '../components/posts/CreatePostForm';
import { Post } from '../models/Post';

export default function CreatePost() {
  // In a real app, this would come from user authentication and state
  const currentUserId = 'user1';

  const handleCreatePost = (post: Partial<Post>) => {
    console.log('Creating post:', post);
    // In a real app, this would call an API to create the post
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>Create Post</ThemedText>
      <ThemedText style={styles.subtitle}>Share a moment with your friends</ThemedText>
      
      <CreatePostForm 
        userId={currentUserId}
        onCreatePost={handleCreatePost}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#000',
    padding: 20,
  },
  title: {
    marginTop: 20,
    marginBottom: 10,
  },
  subtitle: {
    marginBottom: 30,
    fontSize: 18,
  }
}); 
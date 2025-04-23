import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import CreatePostForm from '../components/posts/CreatePostForm';
import { Post } from '../models/Post';

export default function CreatePost() {
  // In a real app, this would come from user authentication and state
  const currentUserId = 'user1';
  const [hasPostedToday, setHasPostedToday] = useState(false);

  const handleCreatePost = (post: Partial<Post>) => {
    console.log('Creating post:', post);
    // In a real app, this would call an API to create the post
    // and update the user's hasPostedToday status
    setHasPostedToday(true);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>Create Post</ThemedText>
      <ThemedText style={styles.subtitle}>Share a moment from today</ThemedText>
      
      <CreatePostForm 
        userId={currentUserId}
        hasPostedToday={hasPostedToday}
        onCreatePost={handleCreatePost}
      />
      
      <ThemedText style={styles.reminder}>
        Remember, you can post only once a day.
      </ThemedText>
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
  },
  reminder: {
    marginTop: 30,
    textAlign: 'center',
    opacity: 0.7,
    fontSize: 14,
  }
}); 
import React, { useState } from 'react';
import { StyleSheet, Alert, ActivityIndicator, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import CreatePostForm from '../components/posts/CreatePostForm';
import { Post } from '../models/Post';
import { PostsAPI } from '../services/api';
import ApiTester from '../components/ApiTester';

export default function CreatePost() {
  // In a real app, this would come from user authentication and state
  const currentUserId = '6801c9b2948f6062efba4a9c'; // johndoe
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleCreatePost = async (post: Partial<Post>) => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      console.log('Creating post:', post);
      
      // Add more details to the post if needed
      const postData = {
        ...post,
        authorId: post.authorId || currentUserId,
      };
      
      // Call API service to create post
      const result = await PostsAPI.createPost(postData);
      
      console.log('Post created successfully:', result);
      
      // Show success message
      Alert.alert(
        'Success',
        'Your post has been created!',
        [
          {
            text: 'OK',
            onPress: () => {
              // Navigate back to the feed
              router.push('/');
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error creating post:', error);
      
      // Show error to user
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to create post. Please try again.';
      
      setError(errorMessage);
      
      Alert.alert(
        'Error Creating Post',
        errorMessage,
        [{ text: 'OK' }]
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>Create Post</ThemedText>
      <ThemedText style={styles.subtitle}>Share a moment with your friends</ThemedText>
      
      {isSubmitting ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ffffff" />
          <ThemedText style={styles.loadingText}>Creating your post...</ThemedText>
        </View>
      ) : (
        <>
          <CreatePostForm 
            userId={currentUserId}
            onCreatePost={handleCreatePost}
          />
          
          {error && (
            <View style={styles.errorContainer}>
              <ThemedText style={styles.errorText}>{error}</ThemedText>
            </View>
          )}
          
          {/* In development mode, show the API tester */}
          {__DEV__ && (
            <ApiTester />
          )}
        </>
      )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
  },
  errorContainer: {
    backgroundColor: '#ff000030',
    padding: 15,
    borderRadius: 8,
    marginVertical: 20,
    width: '100%',
  },
  errorText: {
    color: '#ff6666',
    textAlign: 'center',
  }
}); 
import React, { useState } from 'react';
import { StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import CreatePostForm from '../components/posts/CreatePostForm';
import { Post } from '../models/Post';
import { PostsAPI } from '../services/api';

export default function CreatePost() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  
  // In a real app, this would come from user authentication and state
  const currentUserId = 'user1';

  const handleCreatePost = async (post: Partial<Post>) => {
    try {
      console.log('CreatePost: Starting post submission');
      setIsSubmitting(true);
      
      // Add the current user ID
      const postWithUser = {
        ...post,
        authorId: currentUserId,
      };
      
      console.log('CreatePost: Calling API with post data', {
        authorId: postWithUser.authorId,
        descriptionLength: postWithUser.description?.length || 0,
        imageUrlLength: typeof postWithUser.imageUrl === 'string' ? postWithUser.imageUrl.length : 'Not a string'
      });
      
      // Send the post to the API
      const result = await PostsAPI.createPost(postWithUser);
      console.log('CreatePost: Post created successfully', { postId: result.id || result._id });
      
      // Show success message
      Alert.alert(
        "Success", 
        "Your post has been created successfully!", 
        [{ text: "OK", onPress: () => router.push('/feed') }]
      );
    } catch (error) {
      console.error('CreatePost: Error creating post:', error);
      // Log more details about the error
      if (error instanceof Error) {
        console.error('CreatePost: Error details:', {
          message: error.message,
          stack: error.stack
        });
      }
      Alert.alert("Error", "Failed to create post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>Create Post</ThemedText>
      <ThemedText style={styles.subtitle}>Share a moment with your friends</ThemedText>
      
      <CreatePostForm 
        userId={currentUserId}
        onCreatePost={handleCreatePost}
        isSubmitting={isSubmitting}
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
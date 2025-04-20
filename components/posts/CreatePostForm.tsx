import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, Image, View, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ThemedText } from '../ThemedText';
import { ThemedView } from '../ThemedView';
import { Post } from '../../models/Post';

// For image compression and conversion
const MAX_IMAGE_SIZE = 800; // Max width/height in pixels

interface CreatePostFormProps {
  userId: string;
  onCreatePost: (post: Partial<Post>) => void;
}

export default function CreatePostForm({ userId, onCreatePost }: CreatePostFormProps) {
  const [image, setImage] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5, // Lower quality for smaller size
        base64: false, // Changed to false as we'll use the URI directly
      });

      if (!result.canceled) {
        console.log('Image selected: ' + result.assets[0].uri.substring(0, 50) + '...');
        console.log('Image size: ' + (result.assets[0].fileSize || 'unknown') + ' bytes');
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const handleSubmit = async () => {
    try {
      if (!image) {
        Alert.alert("Image Required", "Please select an image for your post");
        return;
      }

      if (!description.trim()) {
        Alert.alert("Description Required", "Please add a description for your post");
        return;
      }

      setIsLoading(true);

      // Log the post data we're about to send
      const postData: Partial<Post> = {
        imageUrl: image,
        description: description.trim(),
        authorId: userId,
        createdAt: new Date(),
      };

      console.log('Creating post:', postData);
      
      // For debugging purposes
      if (image.startsWith('file://')) {
        console.log('Using local file URL. On production, this would be uploaded to cloud storage.');
      }

      // Call the parent handler to create the post
      onCreatePost(postData);
      
      // Clear form after submission
      setDescription('');
      setImage(null);
    } catch (error) {
      console.error('Error creating post:', error);
      Alert.alert('Error', 'Failed to create post. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="subtitle" style={styles.title}>Share a Moment</ThemedText>
      
      <TouchableOpacity 
        style={styles.imageContainer} 
        onPress={pickImage}
        disabled={isLoading}
      >
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <ThemedView style={styles.imagePlaceholder}>
            <ThemedText>Tap to select image</ThemedText>
          </ThemedView>
        )}
      </TouchableOpacity>
      
      <TextInput
        style={styles.input}
        placeholder="What's happening today?"
        placeholderTextColor="#777"
        value={description}
        onChangeText={setDescription}
        multiline
        maxLength={250}
        editable={!isLoading}
      />
      
      <TouchableOpacity 
        style={[styles.button, isLoading && styles.buttonDisabled]} 
        onPress={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#000" size="small" />
        ) : (
          <ThemedText style={styles.buttonText}>
            Share Post
          </ThemedText>
        )}
      </TouchableOpacity>
      
      {/* Add debug info for development */}
      {__DEV__ && image && (
        <View style={styles.debugContainer}>
          <ThemedText style={styles.debugTitle}>Debug Info:</ThemedText>
          <ThemedText style={styles.debugText}>
            Image URI: {image.substring(0, 50)}...
          </ThemedText>
          <ThemedText style={styles.debugText}>
            User ID: {userId}
          </ThemedText>
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    width: '100%',
  },
  title: {
    fontSize: 20,
    marginBottom: 15,
  },
  imageContainer: {
    width: '100%',
    height: 250,
    marginBottom: 15,
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    backgroundColor: '#333',
    borderRadius: 5,
    color: 'white',
    height: 100,
    marginBottom: 15,
    padding: 10,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#cccccc',
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
  },
  debugContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#444',
    borderRadius: 5,
  },
  debugTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  debugText: {
    fontSize: 12,
    color: '#aaa',
  }
}); 
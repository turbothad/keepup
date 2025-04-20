import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, Image, View, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ThemedText } from '../ThemedText';
import { ThemedView } from '../ThemedView';
import { Post } from '../../models/Post';

// Debug ImagePicker APIs
console.log('ImagePicker APIs available:', {
  MediaTypeOptions: ImagePicker.MediaTypeOptions || 'Not available'
});

interface CreatePostFormProps {
  userId: string;
  onCreatePost: (post: Partial<Post>) => void;
  isSubmitting?: boolean;
}

export default function CreatePostForm({ userId, onCreatePost, isSubmitting = false }: CreatePostFormProps) {
  const [image, setImage] = useState<string | null>(null);
  const [description, setDescription] = useState('');

  const pickImage = async () => {
    try {
      // Use the current ImagePicker API
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: true,
      });

      console.log('ImagePicker result:', {
        canceled: result.canceled,
        assets: result.assets ? `${result.assets.length} assets` : 'no assets'
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        console.log('Setting image URI:', result.assets[0].uri.substring(0, 30) + '...');
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleSubmit = () => {
    if (!image) {
      Alert.alert("Image Required", "Please select an image for your post");
      return;
    }

    console.log('Creating post with data:', {
      imageUrlLength: image ? image.length : 0,
      description: description.substring(0, 20) + (description.length > 20 ? '...' : ''),
      authorId: userId
    });
    
    // Create new post
    const newPost: Partial<Post> = {
      imageUrl: image,
      description,
      authorId: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
      comments: [],
      likes: [],
      savedBy: []
    };
    
    try {
      onCreatePost(newPost);
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      Alert.alert('Error', 'Failed to create post');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="subtitle" style={styles.title}>Share a Moment</ThemedText>
      
      <TouchableOpacity 
        style={styles.imageContainer} 
        onPress={pickImage}
        disabled={isSubmitting}
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
        editable={!isSubmitting}
      />
      
      <TouchableOpacity 
        style={[
          styles.button,
          isSubmitting && styles.buttonDisabled
        ]} 
        onPress={handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator color="black" />
        ) : (
          <ThemedText style={styles.buttonText}>
            Share Post
          </ThemedText>
        )}
      </TouchableOpacity>
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
    backgroundColor: '#888',
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
  }
}); 
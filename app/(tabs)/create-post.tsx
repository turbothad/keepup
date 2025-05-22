import React, { useState } from 'react';
import {
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  View,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import { PostService } from '../../services/api';

export default function CreatePostScreen() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Launch image picker to choose an image from the library
  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Unable to open image library.');
    }
  };

  /**
   * Placeholder image upload helper.
   * Replace the implementation with your own upload logic (e.g. Cloudinary, S3, or custom backend endpoint).
   *
   * Returns an accessible URL that can be stored in the Post document on the server.
   */
  // NOTE: deprecated placeholder kept for reference, not used in production
  /* const deprecatedUploadImage = async (uri: string): Promise<string> => {@placeholder@} */
  const uploadImageProper = async (uri: string): Promise<string> => 
    // TODO: replace with actual upload logic
     uri
  ;
  const handleSubmit = async () => {
    if (!imageUri) {
      Alert.alert('Error', 'Please select an image');
      return;
    }

    try {
      setSubmitting(true);

      // 1) Upload image and obtain remote URL
      const imageUrl = await uploadImageProper(imageUri);

      // 2) Create post on backend
      await PostService.createPost({
        content: description,
        mediaUrl: imageUrl,
      });

      // 3) Navigate back to feed (or simply go back)
      router.back();
    } catch (error) {
      console.error('Error creating post:', error);
      Alert.alert('Error', 'Failed to create post. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Create New Post
      </ThemedText>

      {/* Image picker */}
      <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : (
          <View style={styles.placeholderContainer}>
            <ThemedText>Tap to select an image</ThemedText>
          </View>
        )}
      </TouchableOpacity>

      {/* Description input */}
      <TextInput
        style={styles.input}
        placeholder="What's on your mind?"
        placeholderTextColor="#777"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      {/* Submit button */}
      <TouchableOpacity
        style={[
          styles.button,
          (!imageUri || submitting) && styles.buttonDisabled,
        ]}
        onPress={handleSubmit}
        disabled={!imageUri || submitting}
      >
        {submitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <ThemedText style={styles.buttonText}>Post</ThemedText>
        )}
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#007bff',
    borderRadius: 10,
    padding: 15,
  },
  buttonDisabled: {
    backgroundColor: '#555',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  image: {
    height: '100%',
    width: '100%',
  },
  imageContainer: {
    borderRadius: 10,
    height: 300,
    marginBottom: 20,
    overflow: 'hidden',
    width: '100%',
  },
  input: {
    backgroundColor: '#333',
    borderRadius: 10,
    color: '#fff',
    marginBottom: 20,
    minHeight: 100,
    padding: 15,
  },
  placeholderContainer: {
    alignItems: 'center',
    backgroundColor: '#333',
    height: '100%',
    justifyContent: 'center',
    width: '100%',
  },
  title: {
    marginBottom: 20,
  },
});

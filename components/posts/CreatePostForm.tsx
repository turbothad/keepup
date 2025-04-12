import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, Image, View, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ThemedText } from '../ThemedText';
import { ThemedView } from '../ThemedView';
import { Post } from '../../models/Post';

interface CreatePostFormProps {
  userId: string;
  hasPostedToday: boolean;
  onCreatePost: (post: Partial<Post>) => void;
}

export default function CreatePostForm({ userId, hasPostedToday, onCreatePost }: CreatePostFormProps) {
  const [image, setImage] = useState<string | null>(null);
  const [description, setDescription] = useState('');

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = () => {
    if (hasPostedToday) {
      Alert.alert(
        "Daily Post Limit Reached",
        "You've already shared a post today. Come back tomorrow for a fresh post!",
        [{ text: "OK" }]
      );
      return;
    }
    
    if (!image) {
      Alert.alert("Image Required", "Please select an image for your post");
      return;
    }

    // Create new post
    const newPost: Partial<Post> = {
      imageUrl: image,
      description,
      authorId: userId,
      createdAt: new Date(),
    };
    
    onCreatePost(newPost);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="subtitle" style={styles.title}>Today's Moment</ThemedText>
      
      <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
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
      />
      
      <TouchableOpacity 
        style={[styles.button, hasPostedToday && styles.disabledButton]} 
        onPress={handleSubmit}
        disabled={hasPostedToday}
      >
        <ThemedText style={styles.buttonText}>
          {hasPostedToday ? "Already Posted Today" : "Share Post"}
        </ThemedText>
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
  disabledButton: {
    backgroundColor: '#555',
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
  }
}); 
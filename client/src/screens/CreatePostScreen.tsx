import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  Image,
  ActivityIndicator,
  Alert
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';

export default function CreatePostScreen({ navigation }: any) {
  const { colors } = useTheme();
  const [content, setContent] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pickImage = async () => {
    // Request permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Sorry, we need camera roll permissions to make this work!');
      return;
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!content.trim()) {
      Alert.alert('Error', 'Post content cannot be empty');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Create form data for image upload
      const formData = new FormData();
      formData.append('content', content);
      
      if (image) {
        const filename = image.split('/').pop() || 'image.jpg';
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image/jpeg';
        
        formData.append('image', {
          uri: image,
          name: filename,
          type,
        } as any);
      }
      
      // TODO: Replace with actual API call
      // const response = await fetch('https://api.keepup.com/posts', {
      //   method: 'POST',
      //   body: formData,
      //   headers: {
      //     'Content-Type': 'multipart/form-data',
      //   },
      // });
      
      // Mock success response
      setTimeout(() => {
        setIsSubmitting(false);
        setContent('');
        setImage(null);
        Alert.alert('Success', 'Post created successfully!');
        navigation.navigate('Feed');
      }, 1000);
      
    } catch (error) {
      console.error('Error creating post:', error);
      Alert.alert('Error', 'Failed to create post. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <TextInput
        style={[styles.input, { color: colors.text, borderColor: colors.tabIconDefault }]}
        placeholder="What's happening?"
        placeholderTextColor={colors.tabIconDefault}
        multiline
        value={content}
        onChangeText={setContent}
      />
      
      {image && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: image }} style={styles.previewImage} />
          <TouchableOpacity 
            style={styles.removeImage} 
            onPress={() => setImage(null)}
          >
            <Ionicons name="close-circle" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>
      )}
      
      <View style={styles.actions}>
        <TouchableOpacity 
          style={styles.imagePickerButton} 
          onPress={pickImage}
        >
          <Ionicons name="image-outline" size={24} color={colors.primary} />
          <Text style={[styles.buttonText, { color: colors.primary }]}>Add Image</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.submitButton, 
            { backgroundColor: colors.primary },
            (!content.trim() || isSubmitting) && styles.disabledButton
          ]} 
          onPress={handleSubmit}
          disabled={!content.trim() || isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.submitButtonText}>Post</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    height: 150,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    textAlignVertical: 'top',
    fontSize: 16,
  },
  imageContainer: {
    marginTop: 16,
    position: 'relative',
    alignSelf: 'flex-start',
  },
  previewImage: {
    width: 200,
    height: 200,
    borderRadius: 8,
  },
  removeImage: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: 'white',
    borderRadius: 12,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  imagePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  buttonText: {
    marginLeft: 8,
    fontSize: 16,
  },
  submitButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

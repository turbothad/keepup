import React, { useState } from 'react';
import { StyleSheet, TextInput, Button, ScrollView } from 'react-native';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';

export default function CreatePostScreen() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleCreatePost = () => {
    console.log('Creating post with title:', title, 'and content:', content);
    // Here you would call your API to create the post
    // After success, navigate to the feed or show a success message

    // Reset the form
    setTitle('');
    setContent('');
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <ThemedText type="title" style={styles.screenTitle}>
          Create New Post
        </ThemedText>

        <ThemedView style={styles.inputContainer}>
          <ThemedText>Title</ThemedText>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Enter post title"
            placeholderTextColor="#666"
          />
        </ThemedView>

        <ThemedView style={styles.inputContainer}>
          <ThemedText>Content</ThemedText>
          <TextInput
            style={[styles.input, styles.contentInput]}
            value={content}
            onChangeText={setContent}
            placeholder="What's on your mind?"
            placeholderTextColor="#666"
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />
        </ThemedView>

        <ThemedView style={styles.buttonContainer}>
          <Button
            title="Post"
            onPress={handleCreatePost}
            disabled={!title.trim() || !content.trim()}
          />
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: 20,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  contentInput: {
    height: 150,
  },
  input: {
    borderColor: '#ccc',
    borderRadius: 5,
    borderWidth: 1,
    color: '#333',
    marginTop: 5,
    padding: 10,
  },
  inputContainer: {
    marginBottom: 20,
  },
  screenTitle: {
    marginBottom: 20,
  },
  scrollView: {
    flex: 1,
  },
});

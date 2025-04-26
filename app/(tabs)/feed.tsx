import React from 'react';
import { StyleSheet, FlatList } from 'react-native';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';

// Placeholder feed data
const feedItems = [
  { id: '1', title: 'Post 1', content: 'This is a sample post content', author: 'User1', date: new Date().toISOString() },
  { id: '2', title: 'Post 2', content: 'Another sample post', author: 'User2', date: new Date().toISOString() },
  { id: '3', title: 'Post 3', content: 'Yet another sample post', author: 'User3', date: new Date().toISOString() },
];

export default function FeedScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>Activity Feed</ThemedText>
      
      <FlatList
        data={feedItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ThemedView style={styles.feedItem}>
            <ThemedText type="subtitle">{item.title}</ThemedText>
            <ThemedText>{item.content}</ThemedText>
            <ThemedText style={styles.meta}>Posted by {item.author}</ThemedText>
          </ThemedView>
        )}
        style={styles.list}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    marginBottom: 20,
  },
  list: {
    flex: 1,
  },
  feedItem: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  meta: {
    marginTop: 10,
    fontSize: 12,
    opacity: 0.7,
  }
}); 
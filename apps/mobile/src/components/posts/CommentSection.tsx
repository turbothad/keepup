import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { ThemedText } from '../ThemedText';
import { ThemedView } from '../ThemedView';
import { Comment } from '../../models/Comment';

interface CommentSectionProps {
  postId: string;
  comments: Comment[] | string[];
  currentUserId: string;
}

export default function CommentSection({ postId, comments, currentUserId }: CommentSectionProps) {
  const [newComment, setNewComment] = useState('');
  
  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    // In a real app, you would call an API to add the comment
    console.log('Adding comment:', { postId, text: newComment, authorId: currentUserId });
    
    // Clear the input
    setNewComment('');
  };
  
  // Check if we have Comment objects or just string IDs
  const hasCommentObjects = comments.length > 0 && typeof comments[0] !== 'string';
  
  const renderComment = ({ item }: { item: Comment }) => {
    const isCurrentUserComment = item.authorId === currentUserId;
    
    return (
      <ThemedView style={[styles.commentContainer, isCurrentUserComment && styles.currentUserComment]}>
        <ThemedText type="defaultSemiBold" style={styles.authorName}>
          {isCurrentUserComment ? 'You' : 'User ' + item.authorId.substring(0, 5)}
        </ThemedText>
        <ThemedText>{item.text}</ThemedText>
        <ThemedText style={styles.timestamp}>
          {new Date(item.createdAt).toLocaleTimeString()}
        </ThemedText>
      </ThemedView>
    );
  };
  
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="subtitle" style={styles.title}>Comments</ThemedText>
      
      {hasCommentObjects && comments.length > 0 ? (
        <FlatList
          data={comments as Comment[]}
          renderItem={renderComment}
          keyExtractor={(item) => item.id}
          style={styles.commentsList}
        />
      ) : (
        <ThemedText style={styles.noComments}>
          {comments.length > 0 ? 'Loading comments...' : 'No comments yet. Be the first!'}
        </ThemedText>
      )}
      
      <View style={styles.addCommentContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add a comment..."
          placeholderTextColor="#777"
          value={newComment}
          onChangeText={setNewComment}
          multiline
        />
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddComment}
          disabled={!newComment.trim()}
        >
          <MaterialIcons name="send" size={20} color="black" />
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  title: {
    marginBottom: 10,
  },
  commentsList: {
    maxHeight: 300,
  },
  commentContainer: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 8,
    backgroundColor: '#333',
  },
  currentUserComment: {
    backgroundColor: '#1D3D47',
  },
  authorName: {
    marginBottom: 5,
  },
  timestamp: {
    fontSize: 10,
    opacity: 0.7,
    marginTop: 5,
    alignSelf: 'flex-end',
  },
  noComments: {
    fontStyle: 'italic',
    opacity: 0.7,
    textAlign: 'center',
    marginVertical: 15,
  },
  addCommentContainer: {
    flexDirection: 'row',
    marginTop: 15,
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    backgroundColor: '#333',
    borderRadius: 20,
    color: 'white',
    padding: 10,
    maxHeight: 100,
  },
  addButton: {
    backgroundColor: 'white',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
}); 
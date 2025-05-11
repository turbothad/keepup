import React, { useState } from 'react';
import { StyleSheet, Image, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Post } from '../../models/Post';
import { User } from '../../models/User';
import { Comment } from '../../models/Comment';
import CommentSection from './CommentSection';
import { ThemedText } from '../ThemedText';
import { ThemedView } from '../ThemedView';

interface PostCardProps {
  post: Post;
  author: User;
  currentUserId: string;
  onLike: (postId: string) => void;
  onSave: (postId: string) => void;
}

export default function PostCard({ post, author, currentUserId, onLike, onSave }: PostCardProps) {
  const [showComments, setShowComments] = useState(false);

  const isLiked = post.likes.includes(currentUserId);
  const isSaved = post.savedBy.includes(currentUserId);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: author.profilePicture || 'https://via.placeholder.com/40' }}
          style={styles.avatar}
        />
        <View style={styles.headerText}>
          <ThemedText type="defaultSemiBold">{author.username}</ThemedText>
          <ThemedText style={styles.timestamp}>{formatDate(post.createdAt)}</ThemedText>
        </View>
      </View>

      <Image
        source={typeof post.imageUrl === 'string' ? { uri: post.imageUrl } : post.imageUrl}
        style={styles.postImage}
      />

      <View style={styles.content}>
        <ThemedText>{post.description}</ThemedText>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity onPress={() => onLike(post.id)} style={styles.actionButton}>
          <MaterialIcons
            name={isLiked ? 'favorite' : 'favorite-border'}
            size={24}
            color={isLiked ? 'white' : 'white'}
          />
          <ThemedText style={styles.actionText}>{post.likes.length}</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setShowComments(!showComments)}
          style={styles.actionButton}>
          <MaterialIcons name="chat-bubble-outline" size={24} color="white" />
          <ThemedText style={styles.actionText}>
            {Array.isArray(post.comments) ? post.comments.length : 0}
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => onSave(post.id)} style={styles.actionButton}>
          <MaterialIcons name={isSaved ? 'bookmark' : 'bookmark-border'} size={24} color="white" />
        </TouchableOpacity>
      </View>

      {showComments && (
        <CommentSection postId={post.id} comments={[]} currentUserId={currentUserId} />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  actionButton: {
    alignItems: 'center',
    flexDirection: 'row',
    marginRight: 20,
  },
  actionText: {
    marginLeft: 5,
  },
  actions: {
    borderTopColor: '#333',
    borderTopWidth: 1,
    flexDirection: 'row',
    padding: 15,
  },
  avatar: {
    borderRadius: 20,
    height: 40,
    marginRight: 10,
    width: 40,
  },
  container: {
    borderRadius: 10,
    marginBottom: 20,
    overflow: 'hidden',
  },
  content: {
    padding: 15,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    padding: 15,
  },
  headerText: {
    flex: 1,
  },
  postImage: {
    height: 400,
    resizeMode: 'cover',
    width: '100%',
  },
  timestamp: {
    fontSize: 12,
    opacity: 0.7,
  },
});

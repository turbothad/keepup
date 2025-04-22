import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';

export interface Post {
  id: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    username: string;
    avatar?: string;
  };
  likes: number;
  comments: number;
}

export interface PostCardProps {
  post: Post;
  onLike?: (postId: string) => void;
  onComment?: (postId: string) => void;
  onSave?: (postId: string) => void;
}

export default function PostCard({ post, onLike, onComment, onSave }: PostCardProps) {
  const { colors } = useTheme();
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Image
          source={{ uri: post.author.avatar || 'https://via.placeholder.com/50' }}
          style={styles.avatar}
        />
        <View>
          <Text style={[styles.username, { color: colors.text }]}>{post.author.username}</Text>
          <Text style={[styles.timestamp, { color: colors.tabIconDefault }]}>
            {formatDate(post.createdAt)}
          </Text>
        </View>
      </View>
      
      <Text style={[styles.content, { color: colors.text }]}>{post.content}</Text>
      
      <View style={styles.actions}>
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={() => onLike && onLike(post.id)}
        >
          <Ionicons name="heart-outline" size={24} color={colors.tabIconDefault} />
          <Text style={[styles.actionText, { color: colors.tabIconDefault }]}>{post.likes}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={() => onComment && onComment(post.id)}
        >
          <Ionicons name="chatbubble-outline" size={24} color={colors.tabIconDefault} />
          <Text style={[styles.actionText, { color: colors.tabIconDefault }]}>{post.comments}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={() => onSave && onSave(post.id)}
        >
          <Ionicons name="bookmark-outline" size={24} color={colors.tabIconDefault} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  username: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  timestamp: {
    fontSize: 12,
  },
  content: {
    fontSize: 16,
    marginBottom: 16,
    lineHeight: 22,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#ddd',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    marginLeft: 5,
    fontSize: 14,
  },
}); 
import React from 'react';
import { StyleSheet, Image, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '../ThemedText';
import { ThemedView } from '../ThemedView';
import { User } from '../../models/User';

interface FriendRequestCardProps {
  user: User;
  onAccept: (userId: string) => void;
  onReject: (userId: string) => void;
}

export default function FriendRequestCard({ user, onAccept, onReject }: FriendRequestCardProps) {
  return (
    <ThemedView style={styles.container}>
      <Image 
        source={{ uri: user.profilePicture || 'https://via.placeholder.com/50' }} 
        style={styles.avatar} 
      />
      
      <View style={styles.userInfo}>
        <ThemedText type="defaultSemiBold">{user.username}</ThemedText>
      </View>
      
      <View style={styles.actions}>
        <TouchableOpacity 
          style={[styles.button, styles.acceptButton]} 
          onPress={() => onAccept(user.id)}
        >
          <ThemedText style={styles.acceptText}>Accept</ThemedText>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.rejectButton]} 
          onPress={() => onReject(user.id)}
        >
          <ThemedText style={styles.rejectText}>Decline</ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  userInfo: {
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginLeft: 10,
  },
  acceptButton: {
    backgroundColor: 'white',
  },
  acceptText: {
    color: 'black',
    fontWeight: 'bold',
  },
  rejectButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'white',
  },
  rejectText: {
    color: 'white',
  }
}); 
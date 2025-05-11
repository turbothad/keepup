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
          onPress={() => onAccept(user.id)}>
          <ThemedText style={styles.acceptText}>Accept</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.rejectButton]}
          onPress={() => onReject(user.id)}>
          <ThemedText style={styles.rejectText}>Decline</ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  acceptButton: {
    backgroundColor: 'white',
  },
  acceptText: {
    color: 'black',
    fontWeight: 'bold',
  },
  actions: {
    flexDirection: 'row',
  },
  avatar: {
    borderRadius: 25,
    height: 50,
    marginRight: 15,
    width: 50,
  },
  button: {
    borderRadius: 5,
    marginLeft: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  container: {
    alignItems: 'center',
    borderRadius: 10,
    flexDirection: 'row',
    marginVertical: 5,
    padding: 15,
  },
  rejectButton: {
    backgroundColor: 'transparent',
    borderColor: 'white',
    borderWidth: 1,
  },
  rejectText: {
    color: 'white',
  },
  userInfo: {
    flex: 1,
  },
});

import React, { useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import GroupCard from '../components/groups/GroupCard';
import { Group, GroupPrivacy } from '../models/Group';

// Sample data - in a real app this would come from an API or local storage
const sampleGroups: Group[] = [
  { 
    id: '1', 
    name: 'Family', 
    description: 'Stay connected with family members',
    createdAt: new Date(), 
    updatedAt: new Date(), 
    adminId: 'user1', 
    members: ['user1', 'user2', 'user3', 'user4', 'user5'],
    settings: {
      privacy: GroupPrivacy.PRIVATE,
      allowMemberPosts: true,
      allowMemberInvites: true
    },
    avatar: 'https://via.placeholder.com/60'
  },
  { 
    id: '2', 
    name: 'College Friends', 
    description: 'Keeping in touch with college buddies',
    createdAt: new Date(), 
    updatedAt: new Date(), 
    adminId: 'user1', 
    members: ['user1', 'user2', 'user3', 'user4', 'user5', 'user6', 'user7', 'user8'],
    settings: {
      privacy: GroupPrivacy.PUBLIC,
      allowMemberPosts: true,
      allowMemberInvites: true
    }
  },
  { 
    id: '3', 
    name: 'Work Team', 
    description: 'Work-related updates and discussions',
    createdAt: new Date(), 
    updatedAt: new Date(), 
    adminId: 'user2', 
    members: ['user1', 'user2', 'user3', 'user4', 'user5', 'user6', 'user7', 'user8', 'user9', 'user10', 'user11', 'user12'],
    settings: {
      privacy: GroupPrivacy.SECRET,
      allowMemberPosts: false,
      allowMemberInvites: false
    },
    avatar: 'https://via.placeholder.com/60'
  },
];

export default function Index() {
  const handleGroupPress = (groupId: string) => {
    console.log(`Group pressed: ${groupId}`);
    // Navigation would go here in a real app
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>KeepUp</ThemedText>
      <ThemedText style={styles.subtitle}>Your Groups</ThemedText>
      
      <FlatList
        data={sampleGroups}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <GroupCard 
            group={item} 
            memberCount={item.members.length}
            onPress={handleGroupPress}
          />
        )}
        style={styles.list}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#000',
  },
  title: {
    marginTop: 20,
    marginBottom: 10,
  },
  subtitle: {
    marginBottom: 20,
    fontSize: 18,
  },
  list: {
    width: '100%',
    paddingHorizontal: 20,
  }
});

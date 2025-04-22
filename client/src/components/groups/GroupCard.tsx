import React from 'react';
import { StyleSheet, Image, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '../ThemedText';
import { ThemedView } from '../ThemedView';
import { Group, GroupPrivacy } from '../../models/Group';

interface GroupCardProps {
  group: Group;
  memberCount: number;
  onPress: (groupId: string) => void;
}

export default function GroupCard({ group, memberCount, onPress }: GroupCardProps) {
  const getPrivacyIcon = (privacy: GroupPrivacy) => {
    switch (privacy) {
      case GroupPrivacy.PUBLIC:
        return '🌐';
      case GroupPrivacy.PRIVATE:
        return '🔒';
      case GroupPrivacy.SECRET:
        return '🔐';
      default:
        return '🌐';
    }
  };

  return (
    <TouchableOpacity onPress={() => onPress(group.id)}>
      <ThemedView style={styles.container}>
        <Image 
          source={{ uri: group.avatar || 'https://via.placeholder.com/60' }} 
          style={styles.avatar} 
        />
        
        <View style={styles.info}>
          <View style={styles.nameRow}>
            <ThemedText type="defaultSemiBold" style={styles.name}>{group.name}</ThemedText>
            <ThemedText>{getPrivacyIcon(group.settings.privacy)}</ThemedText>
          </View>
          
          <ThemedText style={styles.description} numberOfLines={2}>
            {group.description || 'No description'}
          </ThemedText>
          
          <ThemedText style={styles.memberCount}>
            {memberCount} {memberCount === 1 ? 'member' : 'members'}
          </ThemedText>
        </View>
      </ThemedView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  name: {
    fontSize: 16,
  },
  description: {
    opacity: 0.8,
    marginBottom: 5,
  },
  memberCount: {
    fontSize: 12,
    opacity: 0.6,
  }
}); 
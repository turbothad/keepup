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
            <ThemedText type="defaultSemiBold" style={styles.name}>
              {group.name}
            </ThemedText>
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
  avatar: {
    borderRadius: 30,
    height: 60,
    marginRight: 15,
    width: 60,
  },
  container: {
    borderRadius: 10,
    flexDirection: 'row',
    marginVertical: 5,
    padding: 15,
  },
  description: {
    marginBottom: 5,
    opacity: 0.8,
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  memberCount: {
    fontSize: 12,
    opacity: 0.6,
  },
  name: {
    fontSize: 16,
  },
  nameRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
});

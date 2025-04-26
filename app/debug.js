import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import ServerTest from '../components/ServerTest';
import ApiTester from '../components/ApiTester';

export default function Debug() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>Debug</ThemedText>
      
      <ScrollView style={styles.scrollView}>
        <ServerTest />
        <ApiTester />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  title: {
    marginTop: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
}); 
import React from 'react';
import { StyleSheet, ScrollView, Text } from 'react-native';
import { ThemedView } from '../components/ThemedView';
import ServerTest from '../components/ServerTest';
import ApiTester from '../components/ApiTester';

export default function Debug() {
  return (
    <ThemedView style={styles.container}>
      <Text style={styles.title}>Debug</Text>
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
  scrollView: {
    flex: 1,
  },
  title: {
    marginBottom: 20,
    marginTop: 20,
    textAlign: 'center',
  },
});

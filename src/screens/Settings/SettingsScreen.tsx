// src/screens/Settings/SettingsScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Linking } from 'react-native';
import { Colors, Spacing } from '../../utils/theme';
import { useDownloads } from '../../hooks/useDownloads';
// import AdBanner from '../../ads/AdBanner';

const SettingsScreen = () => {
  const { clearDownloads } = useDownloads();

  const onRateApp = () => {
    // Replace with your app's Play Store URL
    const url = 'https://play.google.com/store/apps/details?id=com.socialsaver';
    Linking.openURL(url).catch(() => Alert.alert('Error', 'Cannot open store.'));
  };

  const onShareApp = () => {
    Alert.alert('Info', 'Implement share app later.');
  };

  const onClearDownloads = () => {
    Alert.alert('Confirm', 'Clear all downloads from list (not files)?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear',
        style: 'destructive',
        onPress: () => clearDownloads(),
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <TouchableOpacity style={styles.item} onPress={onRateApp}>
        <Text style={styles.itemText}>Rate this app</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.item} onPress={onShareApp}>
        <Text style={styles.itemText}>Share this app</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.item} onPress={onClearDownloads}>
        <Text style={[styles.itemText, { color: 'red' }]}>Clear downloads list</Text>
      </TouchableOpacity>

      {/* <AdBanner /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: Spacing.m, backgroundColor: Colors.background },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: Spacing.m },
  item: {
    paddingVertical: Spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  itemText: { fontSize: 15, color: Colors.text },
});

export default SettingsScreen;

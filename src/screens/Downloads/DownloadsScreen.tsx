// src/screens/Downloads/DownloadsScreen.tsx
import React from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import { useDownloads } from '../../hooks/useDownloads';
import VideoCard from '../../components/VideoCard/VideoCard';
// import AdBanner from '../../ads/AdBanner';
import { Colors, Spacing } from '../../utils/theme';

const DownloadsScreen = () => {
  const { downloads, removeDownload } = useDownloads();

  return (
    <View style={styles.container}>
      {downloads?.length === 0 ? (
        <Text style={styles.emptyText}>No downloads yet.</Text>
      ) : (
        <FlatList
          data={downloads}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <VideoCard item={item} onDeleted={removeDownload} />
          )}
          contentContainerStyle={{ padding: Spacing.m }}
        />
      )}
      {/* <AdBanner /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  emptyText: {
    textAlign: 'center',
    marginTop: Spacing.l,
    color: Colors.muted,
  },
});

export default DownloadsScreen;

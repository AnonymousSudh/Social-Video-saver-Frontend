// src/screens/Status/StatusScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import { Colors, Spacing } from '../../utils/theme';
import { getStatusFiles, saveStatusFile } from '../../services/fileSystem';
// import AdBanner from '../../ads/AdBanner';

type StatusFile = {
  path: string;
  name: string;
  isVideo: boolean;
};

const requestAndroidPermissions = async () => {
  if (Platform.OS !== 'android') return true;

  try {
    const read = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    );
    return read === PermissionsAndroid.RESULTS.GRANTED;
  } catch (e) {
    console.log('Permission error', e);
    return false;
  }
};

const StatusScreen = () => {
  const [files, setFiles] = useState<StatusFile[]>([]);
  const [loading, setLoading] = useState(false);

  const loadStatuses = async () => {
    const granted = await requestAndroidPermissions();
    if (!granted) {
      Alert.alert('Permission required', 'Storage permission is needed to read statuses.');
      return;
    }

    try {
      setLoading(true);
      const rawFiles = await getStatusFiles();
      const mapped: StatusFile[] = rawFiles.map(f => ({
        path: f.path,
        name: f.name,
        isVideo: f.name.endsWith('.mp4') || f.name.endsWith('.3gp') || f.name.endsWith('.mkv'),
      }));
      setFiles(mapped);
    } catch (e) {
      Alert.alert('Error', 'Could not load statuses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStatuses();
  }, []);

  const onSavePress = async (item: StatusFile) => {
    try {
      const dest = await saveStatusFile(item.path);
      Alert.alert('Saved', 'Status saved to Downloads folder:\n' + dest);
    } catch (e) {
      Alert.alert('Error', 'Could not save status');
    }
  };

  const renderItem = ({ item }: { item: StatusFile }) => {
    return (
      <View style={styles.item}>
        {item.isVideo ? (
          <View style={styles.videoPlaceholder}>
            <Text style={{ color: '#fff' }}>Video</Text>
          </View>
        ) : (
          <Image source={{ uri: 'file://' + item.path }} style={styles.image} />
        )}
        <TouchableOpacity style={styles.saveButton} onPress={() => onSavePress(item)}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>WhatsApp Status Saver</Text>
      <Text style={styles.subHeader}>Open WhatsApp → View Status → Come back here</Text>

      {loading ? (
        <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: Spacing.l }} />
      ) : (
        <FlatList
          data={files}
          numColumns={2}
          keyExtractor={item => item.path}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No statuses found. Make sure you viewed some.</Text>
          }
        />
      )}

      {/* <AdBanner /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: Spacing.m,
    paddingHorizontal: Spacing.m,
  },
  subHeader: {
    fontSize: 12,
    color: Colors.muted,
    paddingHorizontal: Spacing.m,
    marginBottom: Spacing.s,
  },
  listContent: {
    paddingHorizontal: Spacing.s,
    paddingBottom: Spacing.m,
  },
  item: {
    flex: 1,
    margin: Spacing.s,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    resizeMode: 'cover',
  },
  videoPlaceholder: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 6,
    alignItems: 'center',
  },
  saveText: { color: '#fff', fontSize: 13, fontWeight: 'bold' },
  emptyText: {
    textAlign: 'center',
    marginTop: Spacing.l,
    color: Colors.muted,
  },
});

export default StatusScreen;

// src/screens/Home/HomeScreen.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import { Colors, Spacing } from '../../utils/theme';
import { downloadFromUrl } from '../../services/download';
import { useDownloads } from '../../hooks/useDownloads';

const HomeScreen = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const { addDownload } = useDownloads();

  const generateId = () => `${Date.now()}-${Math.random()}`;

  const onDownloadPress = async () => {
    if (!url.trim()) {
      Alert.alert('Error', 'Please paste a valid URL');
      return;
    }

    try {
      setLoading(true);

      const result = await downloadFromUrl(url.trim());

      const item = {
        id: generateId(),
        url: url.trim(),
        localPath: result.localPath,
        title: result?.title,
        duration: result?.duration,
        createdAt: new Date().toISOString(),
      };

      addDownload(item);

      Alert.alert('Success', 'Video downloaded successfully');
      setUrl('');
    } catch (e: any) {
      Alert.alert('Download Failed', e?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: 'padding', android: undefined })}
    >
      <View style={styles.inner}>
        <Text style={styles.title}>SocialSaver</Text>
        <Text style={styles.subtitle}>Paste reel / video link to download</Text>

        <TextInput
          style={styles.input}
          placeholder="Paste link here..."
          placeholderTextColor={Colors.muted}
          value={url}
          onChangeText={setUrl}
          autoCapitalize="none"
        />

        <TouchableOpacity
          style={styles.button}
          onPress={onDownloadPress}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Downloading...' : 'Download'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  inner: { flex: 1, padding: Spacing.m, justifyContent: 'center' },
  title: { fontSize: 26, fontWeight: 'bold', color: Colors.text, textAlign: 'center' },
  subtitle: { fontSize: 14, color: Colors.muted, textAlign: 'center', marginTop: Spacing.s },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: Spacing.m,
    marginTop: Spacing.l,
    fontSize: 14,
    color: Colors.text,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.m,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: Spacing.m,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
});

export default HomeScreen;

// src/components/VideoCard/VideoCard.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Colors, Spacing } from '../../utils/theme';
import Share from 'react-native-share';
import Video from 'react-native-video';
import { deleteFile } from '../../services/fileSystem';

type Props = {
  item: {
    id: string;
    url: string;
    localPath: string;
    createdAt: string;
  };
  onDeleted: (id: string) => void;
};

const VideoCard: React.FC<Props> = ({ item, onDeleted }) => {
  const onShare = async () => {
    try {
      await Share.open({
        url: 'file://' + item.localPath,
      });
    } catch (e) {
      console.log('Share error', e);
    }
  };

  const onDelete = async () => {
    try {
      await deleteFile(item.localPath);
      onDeleted(item.id);
    } catch (e) {
      Alert.alert('Error', 'Could not delete file');
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.videoBox}>
        {/* Just show a small preview (muted) */}
        <Video
          source={{ uri: 'file://' + item.localPath }}
          style={styles.video}
          paused={true}
          resizeMode="cover"
        />
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.title} numberOfLines={1}>
          {item?.title}
        </Text>
        <View style={styles.actions}>
          <TouchableOpacity onPress={onShare}>
            <Text style={styles.actionText}>Share</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onDelete}>
            <Text style={[styles.actionText, { color: 'red' }]}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: Spacing.m,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    overflow: 'hidden',
  },
  videoBox: {
    height: 180,
    backgroundColor: '#000',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  infoRow: {
    padding: Spacing.s,
  },
  title: {
    fontSize: 14,
    color: Colors.text,
  },
  actions: {
    flexDirection: 'row',
    marginTop: Spacing.s,
    justifyContent: 'flex-end',
    gap: 16,
  },
  actionText: {
    fontSize: 13,
    color: Colors.primary,
  },
});

export default VideoCard;

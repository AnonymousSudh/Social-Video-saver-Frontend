// src/screens/History/HistoryScreen.tsx
import React, { useState } from 'react';
import { View, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, Image, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Share from 'react-native-share';
import { useDownloadContext } from '../../context/DownloadContext';
import VideoPlayerModal from '../../components/VideoPlayerModal/VideoPlayerModal';
import AdBanner from '../../ads/AdBanner';
import { Spacing } from '../../utils/theme';
import { useTheme } from '../../context/ThemeContext';

const HistoryScreen = () => {
  const { downloads, removeDownload } = useDownloadContext();
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Video player modal state
  const [playerVisible, setPlayerVisible] = useState(false);
  const [selectedPath, setSelectedPath] = useState('');
  const [selectedTitle, setSelectedTitle] = useState('');

  const handlePlayVideo = (path: string, title: string) => {
    setSelectedPath(path);
    setSelectedTitle(title);
    setPlayerVisible(true);
  };

  const handleShare = async (path: string, title: string) => {
    try {
      await Share.open({
        url: 'file://' + path,
        title: title || 'Instagram Video',
      });
    } catch (e) {
      console.log('Share error:', e);
    }
  };

  const handleDelete = (id: string) => {
    removeDownload(id);
  };

  const formatDuration = (secs: number) => {
    if (!secs) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const filteredDownloads = downloads.filter((item) =>
    item.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderDownloadItem = ({ item }: { item: any }) => {
    const formattedDate = new Date(item.createdAt).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    });

    return (
      <View style={styles.card}>
        <TouchableOpacity 
          style={styles.cardHeader} 
          activeOpacity={0.8}
          onPress={() => handlePlayVideo(item.localPath, item.title)}
        >
          {/* Thumbnail Preview with Play Button Overlay */}
          <View style={styles.thumbnailContainer}>
            {item.thumbnail ? (
              <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
            ) : (
              <View style={styles.thumbPlaceholder}>
                <Text style={{ fontSize: 20 }}>🎥</Text>
              </View>
            )}
            {item.duration > 0 ? (
              <Text style={styles.durationTag}>{formatDuration(item.duration)}</Text>
            ) : null}
            <View style={styles.playOverlay}>
              <Text style={styles.playIconSymbol}>▶</Text>
            </View>
          </View>

          {/* Details */}
          <View style={styles.details}>
            <Text style={styles.title} numberOfLines={1}>
              {item.title || 'Instagram Video'}
            </Text>
            <Text style={styles.creator}>
              @{item.author || 'creator'}
            </Text>
            <Text style={styles.meta}>
              {item.resolution || 'HD'} • {item.fileSize || 'Est. Size'} • {formattedDate}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Action button bar */}
        <View style={styles.actionBar}>
          <TouchableOpacity 
            style={styles.actionBtn} 
            onPress={() => handleShare(item.localPath, item.title)}
          >
            <Text style={styles.actionBtnText}>📤 Share</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionBtn, styles.deleteBtn]} 
            onPress={() => handleDelete(item.id)}
          >
            <Text style={[styles.actionBtnText, { color: colors.error }]}>🗑 Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Header with Search */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Download History</Text>
        <TextInput
          style={styles.searchBar}
          placeholder="Search downloaded videos..."
          placeholderTextColor={colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      {/* History content list */}
      {filteredDownloads.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconBox}>
            <Text style={styles.emptyIconSymbol}>📥</Text>
          </View>
          <Text style={styles.emptyTitle}>No History Found</Text>
          <Text style={styles.emptySubtitle}>
            {searchQuery 
              ? 'Try adjusting your search terms.' 
              : 'Completed downloads will appear here. Start by saving reels!'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredDownloads}
          keyExtractor={(item) => item.id}
          renderItem={renderDownloadItem}
          contentContainerStyle={styles.listContent}
        />
      )}

      {/* Built-in player modal */}
      <VideoPlayerModal
        visible={playerVisible}
        videoPath={selectedPath}
        videoTitle={selectedTitle}
        onClose={() => setPlayerVisible(false)}
      />

      {/* Ads Banner */}
      <AdBanner />
    </SafeAreaView>
  );
};

const getStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: Spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginTop: Spacing.s,
  },
  headerTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: Spacing.s,
  },
  searchBar: {
    backgroundColor: colors.surface,
    borderColor: colors.glassBorder,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: Spacing.m,
    height: 44,
    color: colors.text,
    fontSize: 14,
  },
  listContent: {
    padding: Spacing.m,
    paddingBottom: Spacing.xl,
    gap: 12,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    padding: Spacing.s,
    alignItems: 'center',
  },
  thumbnailContainer: {
    width: 76,
    height: 76,
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#000',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  thumbPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  durationTag: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.7)',
    color: '#fff',
    fontSize: 9,
    fontWeight: 'bold',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
    overflow: 'hidden',
  },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIconSymbol: {
    color: '#fff',
    fontSize: 18,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  details: {
    flex: 1,
    marginLeft: Spacing.m,
  },
  title: {
    color: colors.text,
    fontSize: 14,
    fontWeight: 'bold',
  },
  creator: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  meta: {
    color: colors.textSecondary,
    fontSize: 11,
    marginTop: 4,
  },
  actionBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    height: 44,
  },
  actionBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  deleteBtn: {
    borderLeftWidth: 1,
    borderLeftColor: colors.border,
  },
  actionBtnText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
    marginTop: 60,
  },
  emptyIconBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 0, 110, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.m,
  },
  emptyIconSymbol: {
    fontSize: 28,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptySubtitle: {
    color: colors.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: Spacing.xl,
    lineHeight: 18,
  },
});

export default HistoryScreen;

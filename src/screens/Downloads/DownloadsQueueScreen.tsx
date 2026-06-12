// src/screens/Downloads/DownloadsQueueScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing } from '../../utils/theme';
import { useDownloadContext } from '../../context/DownloadContext';
import AdBanner from '../../ads/AdBanner';

const DownloadsQueueScreen = () => {
  const { activeQueue, pauseDownload, resumeDownload, cancelDownload } = useDownloadContext();

  // Find the primary download (the one that is downloading, or the first one in the queue)
  const activeItem = activeQueue.find(item => item.status === 'downloading') || activeQueue[0];
  const queuedItems = activeQueue.filter(item => item.id !== activeItem?.id);

  const formatRemainingTime = (progress: number, fileSizeStr: string) => {
    if (progress <= 0) return 'Estimating...';
    if (progress >= 100) return 'Finished';
    const sizeMB = parseFloat(fileSizeStr) || 8;
    const remainingMB = sizeMB * (1 - progress / 100);
    const mockSpeed = 4.5; // MB/s
    const secondsLeft = Math.ceil(remainingMB / mockSpeed);
    return `${secondsLeft}s left`;
  };

  const renderActiveItem = () => {
    if (!activeItem) return null;

    const remainingTime = formatRemainingTime(activeItem.progress, activeItem.fileSize);
    const mockSpeed = activeItem.status === 'downloading' ? '4.5 MB/s' : '0 KB/s';

    return (
      <View style={styles.activeCard}>
        {/* Circular Progress Area */}
        <View style={styles.circularContainer}>
          <View style={styles.outerCircle}>
            {/* Glassmorphic inner circle */}
            <View style={styles.innerCircle}>
              <Text style={styles.percentText}>{activeItem.progress}%</Text>
              <Text style={styles.speedText}>{mockSpeed}</Text>
              <Text style={styles.remainingText}>
                {activeItem.status === 'paused' ? 'Paused' : remainingTime}
              </Text>
            </View>
          </View>
        </View>

        {/* Media details row */}
        <View style={styles.activeInfoRow}>
          {activeItem.thumbnail ? (
            <Image source={{ uri: activeItem.thumbnail }} style={styles.activeThumb} />
          ) : (
            <View style={styles.activeThumbPlaceholder}>
              <Text style={{ fontSize: 18 }}>🎥</Text>
            </View>
          )}
          <View style={styles.activeDetails}>
            <Text style={styles.activeTitle} numberOfLines={1}>
              {activeItem.title || 'Instagram Media'}
            </Text>
            <Text style={styles.activeMeta}>
              {activeItem.selectedQuality} • {activeItem.fileSize}
            </Text>
          </View>
        </View>

        {/* Action Controls */}
        <View style={styles.controlsRow}>
          {activeItem.status === 'downloading' ? (
            <TouchableOpacity style={styles.controlBtn} onPress={() => pauseDownload(activeItem.id)}>
              <Text style={styles.controlBtnText}>⏸ Pause</Text>
            </TouchableOpacity>
          ) : activeItem.status === 'paused' ? (
            <TouchableOpacity style={[styles.controlBtn, styles.resumeBtn]} onPress={() => resumeDownload(activeItem.id)}>
              <Text style={styles.controlBtnText}>▶ Resume</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.controlBtn}>
              <Text style={styles.controlBtnText}>Queued...</Text>
            </View>
          )}

          <TouchableOpacity style={[styles.controlBtn, styles.cancelBtn]} onPress={() => cancelDownload(activeItem.id)}>
            <Text style={[styles.controlBtnText, { color: Colors.error }]}>✕ Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderQueueItem = ({ item }: { item: any }) => {
    return (
      <View style={styles.queueCard}>
        {item.thumbnail ? (
          <Image source={{ uri: item.thumbnail }} style={styles.queueThumb} />
        ) : (
          <View style={styles.queueThumbPlaceholder}>
            <Text style={{ fontSize: 14 }}>🎥</Text>
          </View>
        )}
        <View style={styles.queueInfo}>
          <Text style={styles.queueTitle} numberOfLines={1}>{item.title}</Text>
          <Text style={styles.queueMeta}>{item.selectedQuality} • {item.fileSize} • {item.status}</Text>
        </View>
        <TouchableOpacity style={styles.queueCancelBtn} onPress={() => cancelDownload(item.id)}>
          <Text style={styles.queueCancelText}>✕</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Downloads Manager</Text>
        <Text style={styles.headerSubtitle}>Monitor and manage active downloads</Text>
      </View>

      {activeQueue.length === 0 ? (
        /* Empty State */
        <View style={styles.emptyContainer}>
          <View style={styles.successIconBox}>
            <Text style={styles.successIconSymbol}>✓</Text>
          </View>
          <Text style={styles.emptyTitle}>All Caught Up!</Text>
          <Text style={styles.emptySubtitle}>
            There are no active downloads in progress. Paste a link on the home screen to start.
          </Text>
        </View>
      ) : (
        /* Active download details & scrollable queue list */
        <FlatList
          data={queuedItems}
          keyExtractor={(item) => item.id}
          renderItem={renderQueueItem}
          ListHeaderComponent={renderActiveItem}
          contentContainerStyle={styles.listContent}
          ListFooterComponent={<View style={{ height: 20 }} />}
        />
      )}

      {/* Ads Banner */}
      <AdBanner />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: Spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    marginTop: Spacing.s,
  },
  headerTitle: {
    color: Colors.text,
    fontSize: 22,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginTop: 4,
  },
  listContent: {
    padding: Spacing.m,
  },
  activeCard: {
    backgroundColor: Colors.surface,
    borderColor: Colors.glassBorder,
    borderWidth: 1,
    borderRadius: 24,
    padding: Spacing.l,
    alignItems: 'center',
    marginBottom: Spacing.l,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  circularContainer: {
    marginVertical: Spacing.m,
    justifyContent: 'center',
    alignItems: 'center',
  },
  outerCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 4,
    borderColor: 'rgba(255, 0, 110, 0.15)', // transparent primary track
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
  },
  innerCircle: {
    width: 124,
    height: 124,
    borderRadius: 62,
    backgroundColor: Colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  percentText: {
    color: Colors.text,
    fontSize: 28,
    fontWeight: '900',
  },
  speedText: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 2,
  },
  remainingText: {
    color: Colors.textSecondary,
    fontSize: 10,
    marginTop: 4,
  },
  activeInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceLight,
    borderColor: Colors.glassBorder,
    borderWidth: 1,
    borderRadius: 14,
    padding: Spacing.s,
    width: '100%',
    marginVertical: Spacing.m,
  },
  activeThumb: {
    width: 48,
    height: 48,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  activeThumbPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeDetails: {
    flex: 1,
    marginLeft: Spacing.s,
  },
  activeTitle: {
    color: Colors.text,
    fontSize: 13,
    fontWeight: 'bold',
  },
  activeMeta: {
    color: Colors.textSecondary,
    fontSize: 11,
    marginTop: 2,
  },
  controlsRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  controlBtn: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: Colors.surfaceLight,
    borderColor: Colors.glassBorder,
    borderWidth: 1,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resumeBtn: {
    backgroundColor: Colors.primary,
  },
  cancelBtn: {
    backgroundColor: 'rgba(255, 77, 109, 0.1)',
  },
  controlBtnText: {
    color: Colors.text,
    fontSize: 13,
    fontWeight: 'bold',
  },
  queueCard: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderColor: Colors.glassBorder,
    borderWidth: 1,
    borderRadius: 16,
    padding: Spacing.s,
    alignItems: 'center',
    marginBottom: Spacing.s,
  },
  queueThumb: {
    width: 40,
    height: 40,
    borderRadius: 6,
    resizeMode: 'cover',
  },
  queueThumbPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 6,
    backgroundColor: Colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  queueInfo: {
    flex: 1,
    marginLeft: Spacing.s,
  },
  queueTitle: {
    color: Colors.text,
    fontSize: 12,
    fontWeight: 'bold',
  },
  queueMeta: {
    color: Colors.textSecondary,
    fontSize: 10,
    marginTop: 2,
  },
  queueCancelBtn: {
    padding: 8,
  },
  queueCancelText: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  successIconBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(6, 214, 160, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.m,
  },
  successIconSymbol: {
    color: Colors.success,
    fontSize: 32,
    fontWeight: 'bold',
  },
  emptyTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptySubtitle: {
    color: Colors.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: Spacing.l,
    lineHeight: 18,
  },
});

export default DownloadsQueueScreen;

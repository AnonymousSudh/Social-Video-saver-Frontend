// src/components/QualitySheet/QualitySheet.tsx
import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Spacing } from '../../utils/theme';
import { useTheme } from '../../context/ThemeContext';

type Props = {
  visible: boolean;
  videoData: {
    title: string;
    thumbnail: string;
    duration: number;
    author: string;
  } | null;
  onSelectQuality: (quality: string, simulatedSize: string) => void;
  onClose: () => void;
};

const QualitySheet: React.FC<Props> = ({ visible, videoData, onSelectQuality, onClose }) => {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  if (!videoData) return null;

  const duration = videoData.duration || 30; // Fallback to 30 seconds
  const options = [
    { label: '1080p Full HD', resolution: '1920x1080', size: `${(duration * 0.56).toFixed(1)} MB`, speed: '4.8 MB/s', tag: 'Premium' },
    { label: '720p HD', resolution: '1280x720', size: `${(duration * 0.27).toFixed(1)} MB`, speed: '3.9 MB/s', tag: 'HD' },
    { label: '480p SD', resolution: '854x480', size: `${(duration * 0.12).toFixed(1)} MB`, speed: '2.5 MB/s' },
    { label: '360p Mobile', resolution: '640x360', size: `${(duration * 0.075).toFixed(1)} MB`, speed: '1.8 MB/s' },
    { label: '240p Low', resolution: '426x240', size: `${(duration * 0.038).toFixed(1)} MB`, speed: '1.2 MB/s' },
    { label: '144p Ultra Low', resolution: '256x144', size: `${(duration * 0.019).toFixed(1)} MB`, speed: '0.8 MB/s' },
  ];

  const formatDuration = (secs: number) => {
    if (!secs) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <TouchableOpacity style={styles.dismissBackdrop} activeOpacity={1} onPress={onClose} />
        
        <View style={styles.sheet}>
          <View style={styles.handle} />
          
          <Text style={styles.title}>Select Quality</Text>
          
          {/* Video preview card */}
          <View style={styles.videoCard}>
            {videoData.thumbnail ? (
              <Image source={{ uri: videoData.thumbnail }} style={styles.thumbnail} />
            ) : (
              <View style={[styles.thumbnail, styles.thumbnailPlaceholder]}>
                <Text style={styles.placeholderText}>No Preview</Text>
              </View>
            )}
            <View style={styles.videoInfo}>
              <Text style={styles.videoTitle} numberOfLines={2}>{videoData.title}</Text>
              <Text style={styles.videoCreator}>@{videoData.author || 'creator'}</Text>
              <Text style={styles.videoDuration}>⏱ {formatDuration(duration)}</Text>
            </View>
          </View>

          <ScrollView style={styles.optionsList} contentContainerStyle={styles.scrollContent}>
            {options.map((opt, idx) => (
              <TouchableOpacity 
                key={idx} 
                style={styles.optionRow} 
                onPress={() => onSelectQuality(opt.label, opt.size)}
              >
                <View style={styles.optionMain}>
                  <Text style={styles.qualityLabel}>{opt.label}</Text>
                  <Text style={styles.qualitySub}>{opt.resolution} • Est. {opt.speed}</Text>
                </View>
                
                <View style={styles.optionRight}>
                  {opt.tag ? (
                    <Text style={[
                      styles.tagText,
                      opt.tag === 'Premium' ? styles.premiumTag : styles.hdTag
                    ]}>
                      {opt.tag}
                    </Text>
                  ) : null}
                  <Text style={styles.sizeText}>{opt.size}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
          
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const getStyles = (colors: any) => StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'flex-end',
  },
  dismissBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    paddingTop: 12,
    paddingHorizontal: Spacing.m,
    paddingBottom: Spacing.l,
    maxHeight: '80%',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.surfaceLight,
    alignSelf: 'center',
    marginBottom: Spacing.m,
  },
  title: {
    color: colors.text,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: Spacing.m,
  },
  videoCard: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceLight,
    borderRadius: 12,
    padding: Spacing.s,
    marginBottom: Spacing.m,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  thumbnailPlaceholder: {
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    color: colors.textMuted,
    fontSize: 9,
  },
  videoInfo: {
    flex: 1,
    marginLeft: Spacing.s,
    justifyContent: 'center',
  },
  videoTitle: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  },
  videoCreator: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },
  videoDuration: {
    color: colors.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  optionsList: {
    marginBottom: Spacing.m,
  },
  scrollContent: {
    gap: 8,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: Spacing.m,
    backgroundColor: colors.surfaceLight,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  optionMain: {
    flex: 1,
  },
  qualityLabel: {
    color: colors.text,
    fontSize: 15,
    fontWeight: 'bold',
  },
  qualitySub: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  optionRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  sizeText: {
    color: colors.secondaryAccent,
    fontSize: 14,
    fontWeight: 'bold',
  },
  tagText: {
    fontSize: 9,
    fontWeight: 'bold',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 4,
  },
  premiumTag: {
    backgroundColor: 'rgba(236, 72, 153, 0.15)',
    color: colors.secondaryAccent,
  },
  hdTag: {
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    color: colors.primary,
  },
  closeBtn: {
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceLight,
    borderRadius: 12,
  },
  closeBtnText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
  },
});

export default QualitySheet;

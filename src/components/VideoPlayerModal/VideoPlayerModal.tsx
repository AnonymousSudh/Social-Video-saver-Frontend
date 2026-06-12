// src/components/VideoPlayerModal/VideoPlayerModal.tsx
import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Share, ActivityIndicator, Platform } from 'react-native';
import Video from 'react-native-video';
import { Colors, Spacing } from '../../utils/theme';

type Props = {
  visible: boolean;
  videoPath: string;
  videoTitle: string;
  onClose: () => void;
};

const VideoPlayerModal: React.FC<Props> = ({ visible, videoPath, videoTitle, onClose }) => {
  const [paused, setPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [loading, setLoading] = useState(true);
  const [resizeMode, setResizeMode] = useState<'contain' | 'cover'>('contain');
  const [progressBarWidth, setProgressBarWidth] = useState(0);

  const playerRef = useRef<any>(null);

  if (!videoPath) return null;

  const togglePlay = () => setPaused(!paused);

  const toggleAspect = () => {
    setResizeMode(prev => prev === 'contain' ? 'cover' : 'contain');
  };

  const handleShare = async () => {
    try {
      await Share.share({
        url: 'file://' + videoPath,
        title: videoTitle || 'Instagram Video',
        message: `Watch this video: ${videoTitle || 'Instagram Video'}`,
      });
    } catch (error) {
      console.log('Error sharing video:', error);
    }
  };

  const handleRewind = () => {
    if (duration === 0) return;
    const target = Math.max(0, currentTime - 10);
    playerRef.current?.seek(target);
    setCurrentTime(target);
  };

  const handleForward = () => {
    if (duration === 0) return;
    const target = Math.min(duration, currentTime + 10);
    playerRef.current?.seek(target);
    setCurrentTime(target);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleProgressBarLayout = (e: any) => {
    setProgressBarWidth(e.nativeEvent.layout.width);
  };

  const handleProgressPress = (e: any) => {
    if (progressBarWidth === 0 || duration === 0) return;
    const clickX = e.nativeEvent.locationX;
    const ratio = Math.max(0, Math.min(1, clickX / progressBarWidth));
    const targetTime = ratio * duration;
    playerRef.current?.seek(targetTime);
    setCurrentTime(targetTime);
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <View style={styles.container}>
        {/* Video stream */}
        <Video
          ref={playerRef}
          source={{ uri: 'file://' + videoPath }}
          style={styles.video}
          paused={paused}
          resizeMode={resizeMode}
          onLoadStart={() => setLoading(true)}
          onLoad={(data) => {
            setDuration(data.duration);
            setLoading(false);
          }}
          onProgress={(data) => {
            setCurrentTime(data.currentTime);
          }}
          onEnd={() => {
            setPaused(true);
            setCurrentTime(0);
            playerRef.current?.seek(0);
          }}
          onError={() => setLoading(false)}
        />

        {loading && (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        )}

        {/* Floating Close Button */}
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>

        {/* Video Title Header */}
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1}>
            {videoTitle || 'InstaSave Pro Player'}
          </Text>
        </View>

        {/* Custom Controls card overlay at bottom */}
        <View style={styles.controlsCard}>
          {/* Progress / Seek bar */}
          <View style={styles.seekbarContainer}>
            <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
            <TouchableOpacity 
              style={styles.seekbarTrack} 
              onLayout={handleProgressBarLayout}
              onPress={handleProgressPress}
              activeOpacity={1}
            >
              <View style={[styles.seekbarFill, { width: `${progressPercent}%` }]} />
              <View style={[styles.seekbarKnob, { left: `${progressPercent}%` }]} />
            </TouchableOpacity>
            <Text style={styles.timeText}>{formatTime(duration)}</Text>
          </View>

          {/* Buttons Layout */}
          <View style={styles.controlsRow}>
            {/* Aspect button */}
            <TouchableOpacity style={styles.aspectBtn} onPress={toggleAspect}>
              <Text style={styles.aspectBtnText}>
                {resizeMode === 'contain' ? '🔍 Zoom' : '📱 Fit'}
              </Text>
            </TouchableOpacity>

            {/* Media seeking core */}
            <View style={styles.mediaCenterControls}>
              <TouchableOpacity style={styles.seekBtn} onPress={handleRewind}>
                <Text style={styles.seekBtnText}>⏪ 10s</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.playBtn} onPress={togglePlay}>
                <Text style={styles.playBtnText}>{paused ? '▶' : '⏸'}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.seekBtn} onPress={handleForward}>
                <Text style={styles.seekBtnText}>10s ⏩</Text>
              </TouchableOpacity>
            </View>

            {/* Share button */}
            <TouchableOpacity style={styles.aspectBtn} onPress={handleShare}>
              <Text style={styles.aspectBtnText}>📤 Share</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  header: {
    position: 'absolute',
    top: 50,
    left: 70,
    right: 20,
    height: 40,
    justifyContent: 'center',
    zIndex: 9,
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  controlsCard: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(26, 29, 36, 0.85)',
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderRadius: 20,
    padding: Spacing.m,
    zIndex: 10,
  },
  seekbarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.m,
    gap: 10,
  },
  timeText: {
    color: Colors.text,
    fontSize: 11,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  seekbarTrack: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    position: 'relative',
    justifyContent: 'center',
  },
  seekbarFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: Colors.primary,
  },
  seekbarKnob: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.text,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 3,
    marginLeft: -7,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  aspectBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  aspectBtnText: {
    color: Colors.text,
    fontSize: 11,
    fontWeight: 'bold',
  },
  mediaCenterControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  seekBtn: {
    padding: 8,
  },
  seekBtnText: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: 'bold',
  },
  playBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
  },
  playBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 2,
  },
});

export default VideoPlayerModal;

// src/screens/Home/HomeScreen.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  AppState,
  Platform,
  Vibration,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Clipboard from '@react-native-clipboard/clipboard';
import { useNavigation } from '@react-navigation/native';
import { Spacing } from '../../utils/theme';
import { useDownloadContext } from '../../context/DownloadContext';
import { useToast } from '../../components/Toast/Toast';
import { useTheme } from '../../context/ThemeContext';
import { apiDownload } from '../../services/api';
import AdBanner from '../../ads/AdBanner';

import ClipboardPopup from '../../components/ClipboardPopup/ClipboardPopup';
import QualitySheet from '../../components/QualitySheet/QualitySheet';
import VideoPlayerModal from '../../components/VideoPlayerModal/VideoPlayerModal';
import AdCountdownModal from '../../components/AdCountdownModal/AdCountdownModal';

const INSTAGRAM_REGEX = /^(https?:\/\/)?(www\.)?instagram\.com\/(reel|p|tv)\/[a-zA-Z0-9_\-]+\/?(\?.*)?$/;

const HomeScreen = () => {
  const navigation = useNavigation<any>();
  const [url, setUrl] = useState('');
  const [fetchingData, setFetchingData] = useState(false);
  const [lastClipboardUrl, setLastClipboardUrl] = useState('');
  
  // Modals Visibility
  const [clipboardPopupVisible, setClipboardPopupVisible] = useState(false);
  const [qualitySheetVisible, setQualitySheetVisible] = useState(false);
  const [playerVisible, setPlayerVisible] = useState(false);
  const [adCountdownVisible, setAdCountdownVisible] = useState(false);
  
  // Video & preview metadata states
  const [loadedVideoData, setLoadedVideoData] = useState<any>(null);
  const [selectedVideoPath, setSelectedVideoPath] = useState('');
  const [selectedVideoTitle, setSelectedVideoTitle] = useState('');
  const [pendingDownloadDetails, setPendingDownloadDetails] = useState<any>(null);

  const { showToast } = useToast();
  const { colors } = useTheme();
  const styles = getStyles(colors);
  
  const { 
    downloads, 
    addToQueue 
  } = useDownloadContext();

  const appState = useRef(AppState.currentState);

  // Monitor Clipboard on start and focus
  useEffect(() => {
    checkClipboard();

    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        checkClipboard();
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [lastClipboardUrl]);

  const checkClipboard = async () => {
    try {
      const text = await Clipboard.getString();
      if (text && INSTAGRAM_REGEX.test(text.trim()) && text.trim() !== lastClipboardUrl) {
        setLastClipboardUrl(text.trim());
        setClipboardPopupVisible(true);
        Vibration.vibrate(80);
      }
    } catch (err) {
      console.log('Error accessing clipboard:', err);
    }
  };

  const handlePasteClipboard = async () => {
    try {
      const text = await Clipboard.getString();
      if (text) {
        setUrl(text.trim());
        showToast('Link pasted from clipboard', 'info');
      } else {
        showToast('Clipboard is empty', 'error');
      }
    } catch (err) {
      showToast('Could not access clipboard', 'error');
    }
  };

  const handleClearInput = () => {
    setUrl('');
    setLoadedVideoData(null);
  };

  const onDownloadPress = async () => {
    const cleanUrl = url.trim();
    if (!cleanUrl) {
      showToast('Please paste a URL first', 'error');
      return;
    }

    if (!INSTAGRAM_REGEX.test(cleanUrl)) {
      showToast('Please enter a valid Instagram URL (reel or post)', 'error');
      return;
    }

    try {
      setFetchingData(true);
      showToast('Analyzing Instagram video...', 'info');
      
      const apiResponse = await apiDownload(cleanUrl);
      
      setLoadedVideoData({
        url: cleanUrl,
        directUrl: apiResponse.downloadUrl,
        title: apiResponse.title,
        thumbnail: apiResponse.thumbnail,
        author: apiResponse.author,
        duration: apiResponse.duration || 15,
      });

      setFetchingData(false);
      showToast('Media details parsed', 'success');
    } catch (e: any) {
      setFetchingData(false);
      showToast(e?.message || 'Failed to fetch video details', 'error');
    }
  };

  const handleChooseQualityBtn = () => {
    setQualitySheetVisible(true);
  };

  const handleSelectQuality = (quality: string, size: string) => {
    setQualitySheetVisible(false);
    
    // Store details for execution after interstitial ad countdown completes
    setPendingDownloadDetails({ quality, size });
    
    // Show interstitial count down modal
    setAdCountdownVisible(true);
  };

  const handleAdCountdownComplete = () => {
    setAdCountdownVisible(false);
    if (!loadedVideoData || !pendingDownloadDetails) return;

    addToQueue(
      loadedVideoData.url,
      loadedVideoData.directUrl,
      loadedVideoData.title,
      loadedVideoData.thumbnail,
      loadedVideoData.author,
      loadedVideoData.duration,
      pendingDownloadDetails.quality,
      pendingDownloadDetails.size
    );

    showToast('Download started in background', 'success');
    
    // Reset view
    setUrl('');
    setLoadedVideoData(null);
    setPendingDownloadDetails(null);

    // Navigate to Downloads tab
    navigation.navigate('Downloads');
  };

  const playVideo = (path: string, title: string) => {
    setSelectedVideoPath(path);
    setSelectedVideoTitle(title);
    setPlayerVisible(true);
  };

  const formatDuration = (secs: number) => {
    if (!secs) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const formatSampleDate = (createdAtStr: string) => {
    return new Date(createdAtStr).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    });
  };

  // Only display actual completed downloads in recent horizontal slider
  const recentDownloadsList = downloads.slice(0, 5);

  return (
    <SafeAreaView style={styles.rootContainer} edges={['top', 'left', 'right']}>
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Top Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>✨ InstaSave Pro</Text>
          <TouchableOpacity style={styles.settingsBtn} onPress={() => navigation.navigate('Settings')}>
            <Text style={styles.settingsIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>

        {/* Hero Card */}
        <View style={styles.heroCard}>
          <Text style={styles.heroTitle}>Download Instagram Videos in Seconds</Text>
          <View style={styles.heroIllustration}>
            <Text style={styles.heroIllustSymbol}>📥</Text>
          </View>
        </View>

        {/* Input Section */}
        <View style={styles.inputCard}>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Paste Instagram Reel or Post URL"
              placeholderTextColor={colors.textSecondary}
              value={url}
              onChangeText={setUrl}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {url ? (
              <TouchableOpacity style={styles.clearBtn} onPress={handleClearInput}>
                <Text style={styles.clearText}>✕</Text>
              </TouchableOpacity>
            ) : null}
          </View>

          <View style={styles.buttonGroup}>
            <TouchableOpacity style={styles.groupActionBtn} onPress={handlePasteClipboard}>
              <Text style={styles.groupActionBtnText}>📋 Paste Link</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.downloadBtn, fetchingData && styles.disabledBtn]}
              onPress={onDownloadPress}
              disabled={fetchingData}
            >
              <Text style={styles.downloadBtnText}>
                {fetchingData ? 'Analyzing...' : 'Search & Fetch'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Video Preview Card (Screen 3) */}
        {loadedVideoData && (
          <View style={styles.previewCard}>
            <Text style={styles.previewLabel}>🎥 Media Preview Detected</Text>
            
            <Image source={{ uri: loadedVideoData.thumbnail }} style={styles.previewImage} />
            
            <View style={styles.creatorProfile}>
              <View style={styles.avatarCircle}>
                <Text style={{ fontSize: 16 }}>👤</Text>
              </View>
              <Text style={styles.profileUsername}>@{loadedVideoData.author || 'instagram_creator'}</Text>
              <View style={styles.verificationBadge}>
                <Text style={styles.verificationText}>✓</Text>
              </View>
            </View>

            <View style={styles.previewDetails}>
              <Text style={styles.previewCaption} numberOfLines={2}>
                {loadedVideoData.title || 'Instagram reel capture'}
              </Text>
              <Text style={styles.previewMeta}>
                ⏱ Length: {formatDuration(loadedVideoData.duration)}  •  📦 Size: ~{(loadedVideoData.duration * 0.27).toFixed(1)} MB
              </Text>
            </View>

            <TouchableOpacity style={styles.chooseQualityBtn} onPress={handleChooseQualityBtn}>
              <Text style={styles.chooseQualityBtnText}>Choose Download Quality</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Recent Downloads Slider (Screen 2) - Only shows when real items exist */}
        {recentDownloadsList.length > 0 && (
          <View style={styles.sliderSection}>
            <Text style={styles.sectionTitle}>Recent Downloads</Text>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={styles.sliderContent}>
              {recentDownloadsList.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.recentSlideCard}
                  onPress={() => playVideo(item.localPath, item.title)}
                >
                  <Image source={{ uri: item.thumbnail }} style={styles.slideThumb} />
                  <View style={styles.slideInfo}>
                    <Text style={styles.slideTitle} numberOfLines={1}>{item.title}</Text>
                    <Text style={styles.slideSubText}>
                      {formatDuration(item.duration)} • {item.fileSize || 'HD'}
                    </Text>
                    <Text style={styles.slideDate}>{formatSampleDate(item.createdAt)}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Sponsored Ad Banner Container */}
        <View style={styles.sponsoredSection}>
          <Text style={styles.sponsoredHeader}>Sponsored</Text>
          <View style={styles.adBannerBox}>
            <AdBanner />
          </View>
        </View>
      </ScrollView>

      {/* Popups & Sheets */}
      <ClipboardPopup
        visible={clipboardPopupVisible}
        url={lastClipboardUrl}
        onPaste={() => {
          setClipboardPopupVisible(false);
          setUrl(lastClipboardUrl);
          showToast('Instagram URL loaded', 'success');
        }}
        onClose={() => setClipboardPopupVisible(false)}
      />

      <QualitySheet
        visible={qualitySheetVisible}
        videoData={loadedVideoData}
        onSelectQuality={handleSelectQuality}
        onClose={() => setQualitySheetVisible(false)}
      />

      <AdCountdownModal
        visible={adCountdownVisible}
        onComplete={handleAdCountdownComplete}
      />

      <VideoPlayerModal
        visible={playerVisible}
        videoPath={selectedVideoPath}
        videoTitle={selectedVideoTitle}
        onClose={() => setPlayerVisible(false)}
      />
    </SafeAreaView>
  );
};

const getStyles = (colors: any) => StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.m,
    paddingBottom: Spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.s,
    marginBottom: Spacing.l,
  },
  logo: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '900',
  },
  settingsBtn: {
    padding: 6,
  },
  settingsIcon: {
    fontSize: 20,
    color: colors.text,
  },
  heroCard: {
    backgroundColor: colors.surface,
    borderColor: colors.glassBorder,
    borderWidth: 1,
    borderRadius: 24,
    padding: Spacing.l,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.l,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  heroTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '900',
    flex: 1.2,
    lineHeight: 24,
  },
  heroIllustration: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 0, 110, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 0.6,
    marginLeft: 10,
  },
  heroIllustSymbol: {
    fontSize: 28,
  },
  inputCard: {
    backgroundColor: colors.surface,
    borderColor: colors.glassBorder,
    borderWidth: 1,
    borderRadius: 24,
    padding: Spacing.m,
    marginBottom: Spacing.l,
  },
  inputRow: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceLight,
    borderColor: colors.glassBorder,
    borderWidth: 1,
    borderRadius: 14,
    alignItems: 'center',
    height: 52,
    paddingHorizontal: Spacing.s,
  },
  input: {
    flex: 1,
    color: colors.text,
    fontSize: 14,
    paddingHorizontal: Spacing.s,
  },
  clearBtn: {
    padding: 10,
  },
  clearText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  buttonGroup: {
    flexDirection: 'row',
    marginTop: Spacing.m,
    gap: 12,
  },
  groupActionBtn: {
    flex: 1,
    backgroundColor: colors.surfaceLight,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 14,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  groupActionBtnText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: 'bold',
  },
  downloadBtn: {
    flex: 1.5,
    backgroundColor: colors.primary,
    borderRadius: 14,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  disabledBtn: {
    backgroundColor: colors.surfaceLight,
  },
  downloadBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  previewCard: {
    backgroundColor: colors.surface,
    borderColor: colors.glassBorder,
    borderWidth: 1,
    borderRadius: 24,
    padding: Spacing.m,
    marginBottom: Spacing.l,
    alignItems: 'center',
  },
  previewLabel: {
    color: colors.secondaryAccent,
    fontSize: 12,
    fontWeight: '900',
    marginBottom: Spacing.m,
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    resizeMode: 'cover',
    marginBottom: Spacing.m,
  },
  creatorProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: Spacing.s,
  },
  avatarCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileUsername: {
    color: colors.text,
    fontSize: 14,
    fontWeight: 'bold',
  },
  verificationBadge: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#1d9bf0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  verificationText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: 'bold',
  },
  previewDetails: {
    alignItems: 'center',
    paddingHorizontal: Spacing.s,
    marginBottom: Spacing.m,
  },
  previewCaption: {
    color: colors.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
  previewMeta: {
    color: colors.textMuted,
    fontSize: 11,
    marginTop: 6,
  },
  chooseQualityBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 14,
    width: '100%',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  chooseQualityBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '900',
  },
  sliderSection: {
    marginBottom: Spacing.l,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: Spacing.m,
  },
  sliderContent: {
    gap: 12,
  },
  recentSlideCard: {
    width: 140,
    backgroundColor: colors.surface,
    borderColor: colors.glassBorder,
    borderWidth: 1,
    borderRadius: 20,
    overflow: 'hidden',
  },
  slideThumb: {
    width: '100%',
    height: 90,
    resizeMode: 'cover',
  },
  slideInfo: {
    padding: Spacing.s,
  },
  slideTitle: {
    color: colors.text,
    fontSize: 11,
    fontWeight: 'bold',
  },
  slideSubText: {
    color: colors.textSecondary,
    fontSize: 9,
    marginTop: 2,
  },
  slideDate: {
    color: colors.textMuted,
    fontSize: 9,
    marginTop: 4,
  },
  sponsoredSection: {
    marginBottom: Spacing.m,
  },
  sponsoredHeader: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.s,
  },
  adBannerBox: {
    borderRadius: 16,
    overflow: 'hidden',
  },
});

export default HomeScreen;

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, ScrollView, Switch, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Spacing } from '../../utils/theme';
import { useDownloadContext } from '../../context/DownloadContext';
import { useToast } from '../../components/Toast/Toast';
import { useTheme } from '../../context/ThemeContext';
import { useCustomAlert } from '../../components/CustomAlert/CustomAlert';
import PremiumModal from '../../components/PremiumModal/PremiumModal';
import AdBanner from '../../ads/AdBanner';

const SettingsScreen = () => {
  const { clearDownloads } = useDownloadContext();
  const { showToast } = useToast();
  const { colors, isDarkMode, toggleDarkMode } = useTheme();
  const { showAlert } = useCustomAlert();
  const styles = getStyles(colors);

  const [wifiOnly, setWifiOnly] = useState(false);
  const [autoPaste, setAutoPaste] = useState(true);
  const [notifications, setNotifications] = useState(true);
  
  // Premium Upgrade Modal visibility
  const [premiumVisible, setPremiumVisible] = useState(false);

  const onRateApp = () => {
    const url = 'https://play.google.com/store/apps/details?id=com.socialsaver';
    Linking.openURL(url).catch(() => showToast('Cannot open Play Store link', 'error'));
  };

  const onClearCache = () => {
    showToast('Cache cleared successfully', 'success');
  };

  const onClearHistory = () => {
    showAlert({
      title: 'Delete History', 
      message: 'Are you sure you want to delete all downloaded files and clear history? This action is permanent.', 
      buttons: [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            await clearDownloads();
            showToast('Download list and files cleared', 'success');
          },
        },
      ]
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Premium Upgrade Banner */}
        <TouchableOpacity style={styles.premiumBanner} onPress={() => setPremiumVisible(true)}>
          <View>
            <Text style={styles.premiumBannerTitle}>💎 Go Premium</Text>
            <Text style={styles.premiumBannerSubtitle}>Get Ad-Free downloads, fast speeds, & more!</Text>
          </View>
          <Text style={styles.premiumBannerArrow}>▶</Text>
        </TouchableOpacity>

        {/* Group 1: Downloads */}
        <Text style={styles.groupTitle}>Downloads</Text>
        <View style={styles.groupCard}>
          <View style={styles.itemRow}>
            <View>
              <Text style={styles.itemText}>WiFi Only</Text>
              <Text style={styles.itemSubText}>Download media only when connected to WiFi</Text>
            </View>
            <Switch
              value={wifiOnly}
              onValueChange={setWifiOnly}
              trackColor={{ false: '#252932', true: colors.primary }}
              thumbColor={Platform.OS === 'android' ? '#ffffff' : undefined}
            />
          </View>
          <TouchableOpacity style={styles.itemRowBtn}>
            <View>
              <Text style={styles.itemText}>Download Location</Text>
              <Text style={styles.itemSubText}>/storage/emulated/0/Downloads/SocialSaver</Text>
            </View>
            <Text style={styles.itemArrow}>▶</Text>
          </TouchableOpacity>
        </View>

        {/* Group 2: App */}
        <Text style={styles.groupTitle}>App</Text>
        <View style={styles.groupCard}>
          <View style={styles.itemRow}>
            <View>
              <Text style={styles.itemText}>Dark Mode</Text>
              <Text style={styles.itemSubText}>Amoled dark interface design</Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={toggleDarkMode}
              trackColor={{ false: '#252932', true: colors.primary }}
              thumbColor={Platform.OS === 'android' ? '#ffffff' : undefined}
            />
          </View>
          <View style={styles.itemRow}>
            <View>
              <Text style={styles.itemText}>Auto Paste</Text>
              <Text style={styles.itemSubText}>Auto paste Instagram link on focus</Text>
            </View>
            <Switch
              value={autoPaste}
              onValueChange={setAutoPaste}
              trackColor={{ false: '#252932', true: colors.primary }}
              thumbColor={Platform.OS === 'android' ? '#ffffff' : undefined}
            />
          </View>
          <View style={styles.itemRow}>
            <View>
              <Text style={styles.itemText}>Notifications</Text>
              <Text style={styles.itemSubText}>Get download status notification updates</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: '#252932', true: colors.primary }}
              thumbColor={Platform.OS === 'android' ? '#ffffff' : undefined}
            />
          </View>
        </View>

        {/* Group 3: Storage */}
        <Text style={styles.groupTitle}>Storage</Text>
        <View style={styles.groupCard}>
          <TouchableOpacity style={styles.itemRowBtn} onPress={onClearCache}>
            <View>
              <Text style={styles.itemText}>Clear Cache</Text>
              <Text style={styles.itemSubText}>Clear temporary video thumbnails and preview cache</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.itemRowBtn} onPress={onClearHistory}>
            <View>
              <Text style={[styles.itemText, { color: colors.error }]}>Delete History</Text>
              <Text style={styles.itemSubText}>Delete download records and saved files</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Group 4: Support */}
        <Text style={styles.groupTitle}>Support</Text>
        <View style={styles.groupCard}>
          <TouchableOpacity style={styles.itemRowBtn} onPress={onRateApp}>
            <Text style={styles.itemText}>⭐ Rate App</Text>
            <Text style={styles.itemArrow}>▶</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.itemRowBtn} onPress={() => showAlert({ title: 'Privacy Policy', message: 'Standard local data processing privacy policies apply.' })}>
            <Text style={styles.itemText}>📄 Privacy Policy</Text>
            <Text style={styles.itemArrow}>▶</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.itemRowBtn} onPress={() => showAlert({ title: 'Contact Us', message: 'Reach us at: support@instasavepro.com' })}>
            <Text style={styles.itemText}>📧 Contact Us</Text>
            <Text style={styles.itemArrow}>▶</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Premium Upgrade Modal */}
      <PremiumModal
        visible={premiumVisible}
        onClose={() => setPremiumVisible(false)}
      />

      {/* Ad Banner */}
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
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.m,
  },
  premiumBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(131, 56, 236, 0.15)',
    borderColor: colors.secondaryAccent,
    borderWidth: 1,
    borderRadius: 16,
    padding: Spacing.m,
    marginBottom: Spacing.l,
  },
  premiumBannerTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  premiumBannerSubtitle: {
    color: colors.textSecondary,
    fontSize: 11,
    marginTop: 2,
  },
  premiumBannerArrow: {
    color: colors.text,
    fontSize: 14,
  },
  groupTitle: {
    color: colors.secondaryAccent,
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.s,
    marginLeft: 4,
  },
  groupCard: {
    backgroundColor: colors.surface,
    borderColor: colors.glassBorder,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: Spacing.m,
    marginBottom: Spacing.l,
    overflow: 'hidden',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  itemRowBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  itemText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  itemSubText: {
    color: colors.textSecondary,
    fontSize: 10,
    marginTop: 2,
  },
  itemArrow: {
    color: colors.textMuted,
    fontSize: 12,
  },
});

export default SettingsScreen;

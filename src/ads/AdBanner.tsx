// src/ads/AdBanner.tsx
import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import { useTheme } from '../context/ThemeContext';
import { SHOW_ADS } from '../services/ads';

const adUnitId = __DEV__ ? TestIds.BANNER : 'ca-app-pub-3940256099942544/6300978111';

const AdBanner = () => {
  const [hasError, setHasError] = useState(false);
  const { colors } = useTheme();
  const styles = getStyles(colors);

  if (!SHOW_ADS) {
    return null;
  }

  if (hasError) {
    return (
      <View style={styles.placeholder}>
        <Text style={styles.placeholderText}>Support our free app by enabling internet connection</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <BannerAd
        unitId={adUnitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{ requestNonPersonalizedAdsOnly: true }}
        onAdFailedToLoad={(error) => {
          console.log('Ad failed to load:', error);
          setHasError(true);
        }}
      />
    </View>
  );
};

const getStyles = (colors: any) => StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    paddingVertical: 4,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    minHeight: 50,
  },
  placeholder: {
    height: 50,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    width: '100%',
  },
  placeholderText: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '500',
  },
});

export default AdBanner;

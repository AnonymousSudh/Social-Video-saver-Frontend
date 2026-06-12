// src/ads/AdBanner.tsx
import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import { Colors } from '../utils/theme';

const adUnitId = __DEV__ ? TestIds.BANNER : 'ca-app-pub-3940256099942544/6300978111';

const AdBanner = () => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <View style={styles.placeholder}>
        <Text style={styles.placeholderText}>Support the App - Upgrade to Premium</Text>
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

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
    paddingVertical: 4,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    minHeight: 50,
  },
  placeholder: {
    height: 50,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    width: '100%',
  },
  placeholderText: {
    color: Colors.textMuted,
    fontSize: 12,
    fontWeight: '500',
  },
});

export default AdBanner;

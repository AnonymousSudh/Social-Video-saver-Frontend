import React, { useEffect, useState, useRef } from 'react';
import { StatusBar, View, Text, StyleSheet, Animated, ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from './src/navigation/RootNavigator';
import { DownloadProvider } from './src/context/DownloadContext';
import { ToastProvider } from './src/components/Toast/Toast';
import { ThemeProvider } from './src/context/ThemeContext';
import { initAds } from './src/services/ads';

const App = () => {
  const [showSplash, setShowSplash] = useState(true);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    initAds();

    // Animate scale in
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 5,
      useNativeDriver: true,
    }).start();

    // Fade out splash
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 350,
        useNativeDriver: true,
      }).start(() => {
        setShowSplash(false);
      });
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return (
      <Animated.View style={[styles.splashContainer, { opacity: fadeAnim }]}>
        <StatusBar barStyle="light-content" backgroundColor="#FF006E" />
        
        <Animated.View style={[styles.splashInner, { transform: [{ scale: scaleAnim }] }]}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoSymbol}>📥</Text>
          </View>
          <Text style={styles.splashTitle}>InstaSave Pro</Text>
          <Text style={styles.splashTagline}>Download Reels & Videos Instantly</Text>
          <ActivityIndicator size="small" color="#FFFFFF" style={styles.loader} />
        </Animated.View>
      </Animated.View>
    );
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <ToastProvider>
          <DownloadProvider>
            <RootNavigator />
          </DownloadProvider>
        </ToastProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: '#FF006E', // Main brand color
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderColor: '#FFFFFF',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  logoSymbol: {
    fontSize: 48,
  },
  splashTitle: {
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  splashTagline: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
  loader: {
    marginTop: 40,
  },
});

export default App;

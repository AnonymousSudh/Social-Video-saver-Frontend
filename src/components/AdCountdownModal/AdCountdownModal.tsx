// src/components/AdCountdownModal/AdCountdownModal.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Colors, Spacing } from '../../utils/theme';

type Props = {
  visible: boolean;
  onComplete: () => void;
};

const AdCountdownModal: React.FC<Props> = ({ visible, onComplete }) => {
  const [seconds, setSeconds] = useState(3);

  useEffect(() => {
    if (!visible) {
      setSeconds(3); // Reset
      return;
    }

    if (seconds > 0) {
      const timer = setTimeout(() => {
        setSeconds(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [visible, seconds]);

  const handleContinue = () => {
    if (seconds === 0) {
      onComplete();
    }
  };

  return (
    <Modal
      transparent={false}
      visible={visible}
      animationType="fade"
      statusBarTranslucent={true}
    >
      <View style={styles.container}>
        <Text style={styles.sponsoredLabel}>Sponsored Advertisement</Text>

        <View style={styles.rewardContainer}>
          <Text style={styles.rewardIcon}>🎁</Text>
          <Text style={styles.preparingText}>Preparing your download...</Text>
        </View>

        {/* Mock Ad Visual representation */}
        <View style={styles.adPlaceholder}>
          <View style={styles.adMediaBox}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.playSymbol}>▶</Text>
          </View>
          <Text style={styles.adText}>AdMob Interstitial Video</Text>
          <Text style={styles.adSubText}>Monetization Slot: Earn revenue on every download request</Text>
        </View>

        {/* Countdown footer */}
        <View style={styles.footer}>
          {seconds > 0 ? (
            <View style={styles.counterCircle}>
              <Text style={styles.counterNumber}>{seconds}</Text>
            </View>
          ) : (
            <Text style={styles.completeText}>✓ Ready to download</Text>
          )}

          <TouchableOpacity
            style={[
              styles.continueBtn, 
              seconds > 0 ? styles.disabledBtn : styles.glowingBtn
            ]}
            onPress={handleContinue}
            disabled={seconds > 0}
          >
            <Text style={styles.continueBtnText}>
              {seconds > 0 ? `Skip Ad in ${seconds}s...` : 'Continue Download'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: Spacing.l,
  },
  sponsoredLabel: {
    color: Colors.textMuted,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  rewardContainer: {
    alignItems: 'center',
    marginVertical: Spacing.m,
  },
  rewardIcon: {
    fontSize: 48,
    marginBottom: Spacing.s,
  },
  preparingText: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: '900',
    textAlign: 'center',
  },
  adPlaceholder: {
    backgroundColor: Colors.surface,
    borderColor: Colors.glassBorder,
    borderWidth: 1,
    borderRadius: 20,
    padding: Spacing.m,
    height: 320,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  adMediaBox: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: Colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.m,
    position: 'relative',
  },
  playSymbol: {
    position: 'absolute',
    color: Colors.textMuted,
    fontSize: 18,
    opacity: 0.5,
  },
  adText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  adSubText: {
    color: Colors.textSecondary,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: Spacing.m,
  },
  footer: {
    alignItems: 'center',
    gap: 16,
    width: '100%',
  },
  counterCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderColor: Colors.border,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterNumber: {
    color: Colors.primary,
    fontSize: 18,
    fontWeight: '900',
  },
  completeText: {
    color: Colors.success,
    fontSize: 14,
    fontWeight: 'bold',
  },
  continueBtn: {
    width: '100%',
    paddingVertical: 15,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledBtn: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderWidth: 1,
  },
  glowingBtn: {
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 4,
  },
  continueBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default AdCountdownModal;

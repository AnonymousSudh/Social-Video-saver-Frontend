// src/components/AdCountdownModal/AdCountdownModal.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Spacing } from '../../utils/theme';
import { useTheme } from '../../context/ThemeContext';

type Props = {
  visible: boolean;
  onComplete: () => void;
};

const AdCountdownModal: React.FC<Props> = ({ visible, onComplete }) => {
  const [seconds, setSeconds] = useState(3);
  const { colors } = useTheme();
  const styles = getStyles(colors);

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
        <Text style={styles.sponsoredLabel}>Sponsored Upgrade</Text>

        <View style={styles.rewardContainer}>
          <Text style={styles.rewardIcon}>🎁</Text>
          <Text style={styles.preparingText}>Preparing your download...</Text>
        </View>

        {/* Clean Pro Promo instead of ugly developer mock ad */}
        <View style={styles.adPlaceholder}>
          <View style={styles.adHeaderRow}>
            <Text style={styles.adBadge}>💎 Premium Special</Text>
            <Text style={styles.adSubtextMuted}>Ad-free experience</Text>
          </View>
          
          <Text style={styles.adPromoTitle}>Unlock InstaSave Pro Premium</Text>
          
          <View style={styles.adPromoBenefits}>
            <Text style={styles.adBenefitItem}>⚡ Hyper-Fast Speeds (No limits)</Text>
            <Text style={styles.adBenefitItem}>🚫 Zero Ads & Interrupted Screens</Text>
            <Text style={styles.adBenefitItem}>📂 Batch & Background downloads</Text>
            <Text style={styles.adBenefitItem}>🌟 Priority support & HD resolutions</Text>
          </View>

          <View style={styles.adMediaBox}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={styles.analyzingText}>Analyzing video stream...</Text>
          </View>
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

const getStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: Spacing.l,
  },
  sponsoredLabel: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  rewardContainer: {
    alignItems: 'center',
    marginVertical: Spacing.s,
  },
  rewardIcon: {
    fontSize: 40,
    marginBottom: Spacing.xs,
  },
  preparingText: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '900',
    textAlign: 'center',
  },
  adPlaceholder: {
    backgroundColor: colors.surface,
    borderColor: colors.glassBorder,
    borderWidth: 1,
    borderRadius: 24,
    padding: Spacing.m,
    height: 300,
    justifyContent: 'center',
    width: '100%',
  },
  adHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.s,
  },
  adBadge: {
    backgroundColor: 'rgba(255, 0, 110, 0.12)',
    color: colors.primary,
    fontSize: 10,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    overflow: 'hidden',
  },
  adSubtextMuted: {
    color: colors.textMuted,
    fontSize: 11,
  },
  adPromoTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '900',
    marginBottom: Spacing.m,
  },
  adPromoBenefits: {
    gap: 8,
    marginBottom: Spacing.m,
  },
  adBenefitItem: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '500',
  },
  adMediaBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.surfaceLight,
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    marginTop: Spacing.s,
  },
  analyzingText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
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
    borderColor: colors.border,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterNumber: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: '900',
  },
  completeText: {
    color: colors.success,
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
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
  },
  glowingBtn: {
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
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

// src/components/PremiumModal/PremiumModal.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { Spacing } from '../../utils/theme';
import { useTheme } from '../../context/ThemeContext';

type Props = {
  visible: boolean;
  onClose: () => void;
};

const PremiumModal: React.FC<Props> = ({ visible, onClose }) => {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly' | 'lifetime'>('yearly');
  const { colors } = useTheme();
  const styles = getStyles(colors);

  const plans = [
    { id: 'monthly', title: 'Monthly Plan', price: '$2.99', duration: 'mo', detail: 'Cancel anytime' },
    { id: 'yearly', title: 'Yearly Plan', price: '$19.99', duration: 'yr', detail: 'Save 45%', badge: 'Most Popular' },
    { id: 'lifetime', title: 'Lifetime Access', price: '$29.99', duration: 'once', detail: 'One-time payment', badge: 'Best Value' },
  ];

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
 
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <Text style={styles.badge}>💎 PRO UPGRADE</Text>
            <Text style={styles.title}>Go Premium</Text>
            <Text style={styles.subtitle}>Unlock the full power of InstaVideo Saver</Text>
 
            {/* Benefits */}
            <View style={styles.benefitsContainer}>
              <View style={styles.benefitRow}>
                <Text style={styles.checkIcon}>✓</Text>
                <Text style={styles.benefitText}>No Advertisements (Ad-Free App)</Text>
              </View>
              <View style={styles.benefitRow}>
                <Text style={styles.checkIcon}>✓</Text>
                <Text style={styles.benefitText}>Hyper-Fast Speeds (Unlimited Server Speed)</Text>
              </View>
              <View style={styles.benefitRow}>
                <Text style={styles.checkIcon}>✓</Text>
                <Text style={styles.benefitText}>Unlimited HD Downloads & Carousels</Text>
              </View>
              <View style={styles.benefitRow}>
                <Text style={styles.checkIcon}>✓</Text>
                <Text style={styles.benefitText}>Priority Processing & Background Queues</Text>
              </View>
            </View>
 
            {/* Plans List */}
            <View style={styles.plansContainer}>
              {plans.map((plan) => (
                <TouchableOpacity
                  key={plan.id}
                  style={[
                    styles.planCard,
                    selectedPlan === plan.id && styles.selectedPlanCard,
                  ]}
                  onPress={() => setSelectedPlan(plan.id as any)}
                >
                  {plan.badge && (
                    <Text style={[
                      styles.planBadge,
                      plan.id === 'lifetime' ? styles.lifetimeBadge : styles.popularBadge
                    ]}>
                      {plan.badge}
                    </Text>
                  )}
                  <View style={styles.planMain}>
                    <Text style={styles.planTitle}>{plan.title}</Text>
                    <Text style={styles.planDetail}>{plan.detail}</Text>
                  </View>
                  <View style={styles.planRight}>
                    <Text style={styles.planPrice}>{plan.price}</Text>
                    <Text style={styles.planDuration}>/{plan.duration}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
 
            {/* Purchase CTA */}
            <TouchableOpacity style={styles.purchaseBtn} onPress={onClose}>
              <Text style={styles.purchaseBtnText}>Upgrade Now</Text>
            </TouchableOpacity>
 
            <Text style={styles.footerText}>Secure payment processing. Restore anytime.</Text>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const getStyles = (colors: any) => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'flex-end',
  },
  card: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    maxHeight: '90%',
    paddingTop: 20,
    paddingHorizontal: Spacing.m,
    paddingBottom: Spacing.xl,
  },
  closeBtn: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  closeText: {
    color: colors.text,
    fontSize: 14,
  },
  scrollContent: {
    alignItems: 'center',
    paddingTop: 10,
  },
  badge: {
    color: colors.secondaryAccent,
    backgroundColor: 'rgba(131, 56, 236, 0.15)',
    fontSize: 11,
    fontWeight: '900',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: Spacing.s,
  },
  title: {
    color: colors.text,
    fontSize: 26,
    fontWeight: '900',
    textAlign: 'center',
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: Spacing.l,
  },
  benefitsContainer: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: Spacing.m,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    marginBottom: Spacing.l,
    gap: 12,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  checkIcon: {
    color: colors.success,
    fontSize: 16,
    fontWeight: 'bold',
  },
  benefitText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '500',
  },
  plansContainer: {
    width: '100%',
    gap: 10,
    marginBottom: Spacing.l,
  },
  planCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: Spacing.m,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    position: 'relative',
  },
  selectedPlanCard: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(255, 0, 110, 0.04)',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  planBadge: {
    position: 'absolute',
    top: -9,
    left: 12,
    fontSize: 9,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    overflow: 'hidden',
  },
  popularBadge: {
    backgroundColor: colors.primary,
    color: '#ffffff',
  },
  lifetimeBadge: {
    backgroundColor: colors.secondaryAccent,
    color: '#ffffff',
  },
  planMain: {
    flex: 1,
  },
  planTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: 'bold',
  },
  planDetail: {
    color: colors.textSecondary,
    fontSize: 11,
    marginTop: 2,
  },
  planRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  planPrice: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '900',
  },
  planDuration: {
    color: colors.textSecondary,
    fontSize: 11,
  },
  purchaseBtn: {
    backgroundColor: colors.primary,
    width: '100%',
    paddingVertical: 15,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 5,
    marginBottom: Spacing.m,
  },
  purchaseBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '900',
  },
  footerText: {
    color: colors.textMuted,
    fontSize: 10,
    textAlign: 'center',
  },
});

export default PremiumModal;

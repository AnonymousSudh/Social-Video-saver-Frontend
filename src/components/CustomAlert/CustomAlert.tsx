// src/components/CustomAlert/CustomAlert.tsx
import React, { createContext, useContext, useState, useRef, ReactNode } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Animated, Platform } from 'react-native';
import { Spacing } from '../../utils/theme';
import { useTheme } from '../../context/ThemeContext';

export type AlertButton = {
  text: string;
  onPress?: () => void | Promise<void>;
  style?: 'default' | 'cancel' | 'destructive';
};

export type AlertConfig = {
  title: string;
  message: string;
  buttons?: AlertButton[];
};

type CustomAlertContextType = {
  showAlert: (config: AlertConfig) => void;
  hideAlert: () => void;
};

const CustomAlertContext = createContext<CustomAlertContextType | undefined>(undefined);

export const CustomAlertProvider = ({ children }: { children: ReactNode }) => {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  const [visible, setVisible] = useState(false);
  const [config, setConfig] = useState<AlertConfig | null>(null);

  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const showAlert = (alertConfig: AlertConfig) => {
    setConfig(alertConfig);
    setVisible(true);

    // Reset animations
    scaleAnim.setValue(0.9);
    fadeAnim.setValue(0);

    // Animate in
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const hideAlert = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setVisible(false);
      setConfig(null);
    });
  };

  const handleButtonPress = async (btn: AlertButton) => {
    hideAlert();
    // Allow animation to clean up before invoking callback
    setTimeout(() => {
      if (btn.onPress) {
        btn.onPress();
      }
    }, 150);
  };

  const renderButtons = () => {
    if (!config?.buttons || config.buttons.length === 0) {
      // Default OK button
      return (
        <TouchableOpacity style={styles.okBtn} onPress={hideAlert}>
          <Text style={styles.okBtnText}>OK</Text>
        </TouchableOpacity>
      );
    }

    return (
      <View style={styles.btnRow}>
        {config.buttons.map((btn, index) => {
          let btnStyle = styles.defaultBtn;
          let textStyle = styles.defaultBtnText;

          if (btn.style === 'cancel') {
            btnStyle = styles.cancelBtn;
            textStyle = styles.cancelBtnText;
          } else if (btn.style === 'destructive') {
            btnStyle = styles.destructiveBtn;
            textStyle = styles.destructiveBtnText;
          }

          return (
            <TouchableOpacity
              key={index}
              style={[styles.btnItem, btnStyle]}
              onPress={() => handleButtonPress(btn)}
            >
              <Text style={textStyle}>{btn.text}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  return (
    <CustomAlertContext.Provider value={{ showAlert, hideAlert }}>
      {children}
      <Modal
        transparent={true}
        visible={visible}
        animationType="none"
        onRequestClose={hideAlert}
      >
        <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
          <Animated.View style={[styles.card, { transform: [{ scale: scaleAnim }] }]}>
            {config?.title ? <Text style={styles.title}>{config.title}</Text> : null}
            {config?.message ? <Text style={styles.message}>{config.message}</Text> : null}
            <View style={styles.footer}>{renderButtons()}</View>
          </Animated.View>
        </Animated.View>
      </Modal>
    </CustomAlertContext.Provider>
  );
};

export const useCustomAlert = () => {
  const ctx = useContext(CustomAlertContext);
  if (!ctx) {
    throw new Error('useCustomAlert must be used within CustomAlertProvider');
  }
  return ctx;
};

const getStyles = (colors: any) => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.l,
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.glassBorder,
    borderWidth: 1,
    borderRadius: 24,
    padding: Spacing.l,
    width: '100%',
    maxWidth: 320,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  title: {
    color: colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: Spacing.s,
  },
  message: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: Spacing.l,
  },
  footer: {
    width: '100%',
  },
  okBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  okBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  btnRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  btnItem: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  defaultBtn: {
    backgroundColor: colors.primary,
  },
  defaultBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  cancelBtn: {
    backgroundColor: colors.surfaceLight,
    borderColor: colors.border,
    borderWidth: 1,
  },
  cancelBtnText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: 'bold',
  },
  destructiveBtn: {
    backgroundColor: 'rgba(255, 77, 109, 0.1)',
  },
  destructiveBtnText: {
    color: colors.error,
    fontSize: 14,
    fontWeight: 'bold',
  },
});

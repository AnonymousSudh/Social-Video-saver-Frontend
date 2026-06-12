// src/components/Toast/Toast.tsx
import React, { createContext, useContext, useState, useRef, ReactNode } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Colors } from '../../utils/theme';

type ToastType = 'success' | 'error' | 'info';

type ToastContextType = {
  showToast: (message: string, type?: ToastType) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [message, setMessage] = useState('');
  const [type, setType] = useState<ToastType>('success');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-100)).current;

  const showToast = (msg: string, toastType: ToastType = 'success') => {
    setMessage(msg);
    setType(toastType);

    // Reset animations
    fadeAnim.setValue(0);
    slideAnim.setValue(-100);

    // Animate in
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 50,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto dismiss after 2500ms
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: -100,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Clear message to clean up layout tree once anim is complete
        setMessage('');
      });
    }, 2500);
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return Colors.success;
      case 'error':
        return Colors.error;
      case 'info':
      default:
        return Colors.primary;
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {message ? (
        <Animated.View
          style={[
            styles.toastContainer,
            {
              backgroundColor: getBackgroundColor(),
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.toastText}>{message}</Text>
        </Animated.View>
      ) : null}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return ctx;
};

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    top: 0,
    left: 20,
    right: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    zIndex: 9999,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  toastText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});

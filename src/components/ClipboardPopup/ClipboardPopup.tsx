// src/components/ClipboardPopup/ClipboardPopup.tsx
import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Spacing } from '../../utils/theme';
import { useTheme } from '../../context/ThemeContext';

type Props = {
  visible: boolean;
  url: string;
  onPaste: () => void;
  onClose: () => void;
};

const ClipboardPopup: React.FC<Props> = ({ visible, url, onPaste, onClose }) => {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.badge}>📎 Clipboard Link</Text>
          <Text style={styles.title}>Instagram Link Detected</Text>
          <Text style={styles.urlText} numberOfLines={2}>
            {url}
          </Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelText}>Dismiss</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.pasteBtn} onPress={onPaste}>
              <Text style={styles.pasteText}>Paste Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const getStyles = (colors: any) => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.l,
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.glassBorder,
    borderWidth: 1,
    borderRadius: 16,
    padding: Spacing.l,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 10,
  },
  badge: {
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    color: colors.primary,
    fontSize: 11,
    fontWeight: 'bold',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: Spacing.s,
  },
  title: {
    color: colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: Spacing.s,
  },
  urlText: {
    color: colors.textMuted,
    fontSize: 13,
    textAlign: 'center',
    marginBottom: Spacing.l,
    paddingHorizontal: Spacing.s,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: colors.surfaceLight,
    alignItems: 'center',
  },
  cancelText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  pasteBtn: {
    flex: 1.5,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: 'center',
  },
  pasteText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default ClipboardPopup;

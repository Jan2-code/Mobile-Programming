import React, { useEffect, useRef } from 'react';
import {
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
  Animated,
  Modal,
} from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from './responsive';

// Inline loader (inside a screen)
export const InlineLoader = ({ message = 'Loading...' }) => {
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 0.6, duration: 800, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.inlineContainer}>
      <Animated.View style={{ opacity: pulse }}>
        <Text style={styles.emoji}>🍱</Text>
      </Animated.View>
      <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: SPACING.md }} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

// Full screen overlay loader
const Loader = ({ visible = false, message = 'Please wait...' }) => {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={[styles.box, SHADOWS.large]}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.overlayMessage}>{message}</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  inlineContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
    backgroundColor: COLORS.background,
  },
  emoji: {
    fontSize: 48,
  },
  message: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    marginTop: SPACING.md,
    textAlign: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    minWidth: 160,
  },
  overlayMessage: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.md,
    textAlign: 'center',
  },
});

export default Loader;
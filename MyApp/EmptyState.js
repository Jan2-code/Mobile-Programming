import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ButtonPrimary from './ButtonPrrimary';
import { COLORS, FONTS, SPACING } from './responsive';

const EmptyState = ({
  emoji = '🍱',
  title = 'Nothing here yet',
  subtitle = 'Check back later for new donations.',
  actionLabel,
  onAction,
  icon,
}) => {
  return (
    <View style={styles.container}>
      {icon ? (
        <Ionicons name={icon} size={64} color={COLORS.border} style={styles.icon} />
      ) : (
        <Text style={styles.emoji}>{emoji}</Text>
      )}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
      {actionLabel && onAction ? (
        <ButtonPrimary
          title={actionLabel}
          onPress={onAction}
          fullWidth={false}
          style={styles.actionBtn}
          size="md"
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.xxl,
    backgroundColor: COLORS.background,
  },
  emoji: {
    fontSize: 64,
    marginBottom: SPACING.md,
  },
  icon: {
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: SPACING.xl,
  },
  actionBtn: {
    paddingHorizontal: SPACING.xl,
  },
});

export default EmptyState;
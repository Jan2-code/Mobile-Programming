import React from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from './responsive';

const ButtonPrimary = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost'
  icon,
  iconPosition = 'left',
  fullWidth = true,
  size = 'md', // 'sm' | 'md' | 'lg'
  style,
}) => {
  const isDisabled = disabled || loading;

  const variantStyles = {
    primary: {
      container: { backgroundColor: COLORS.primary },
      text: { color: COLORS.surface },
      loader: COLORS.surface,
    },
    secondary: {
      container: { backgroundColor: COLORS.secondary },
      text: { color: COLORS.surface },
      loader: COLORS.surface,
    },
    outline: {
      container: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: COLORS.primary,
      },
      text: { color: COLORS.primary },
      loader: COLORS.primary,
    },
    danger: {
      container: { backgroundColor: COLORS.danger },
      text: { color: COLORS.surface },
      loader: COLORS.surface,
    },
    ghost: {
      container: { backgroundColor: COLORS.surfaceAlt },
      text: { color: COLORS.primary },
      loader: COLORS.primary,
    },
    success: {
      container: { backgroundColor: COLORS.success },
      text: { color: COLORS.surface },
      loader: COLORS.surface,
    },
  };

  const sizeStyles = {
    sm: { paddingVertical: SPACING.xs + 2, paddingHorizontal: SPACING.md, borderRadius: RADIUS.sm },
    md: { paddingVertical: SPACING.sm + 4, paddingHorizontal: SPACING.lg, borderRadius: RADIUS.md },
    lg: { paddingVertical: SPACING.md, paddingHorizontal: SPACING.xl, borderRadius: RADIUS.md },
  };

  const textSizes = {
    sm: FONTS.sizes.sm,
    md: FONTS.sizes.md,
    lg: FONTS.sizes.lg,
  };

  const current = variantStyles[variant] || variantStyles.primary;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.82}
      style={[
        styles.base,
        current.container,
        sizeStyles[size],
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        variant === 'primary' && !isDisabled && SHADOWS.medium,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={current.loader} size="small" />
      ) : (
        <View style={styles.content}>
          {icon && iconPosition === 'left' && (
            <Ionicons
              name={icon}
              size={size === 'sm' ? 16 : size === 'lg' ? 22 : 18}
              color={current.text.color}
              style={styles.iconLeft}
            />
          )}
          <Text style={[styles.text, current.text, { fontSize: textSizes[size] }]}>
            {title}
          </Text>
          {icon && iconPosition === 'right' && (
            <Ionicons
              name={icon}
              size={size === 'sm' ? 16 : size === 'lg' ? 22 : 18}
              color={current.text.color}
              style={styles.iconRight}
            />
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  iconLeft: {
    marginRight: SPACING.sm,
  },
  iconRight: {
    marginLeft: SPACING.sm,
  },
});

export default ButtonPrimary;
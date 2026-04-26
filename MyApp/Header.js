import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, SHADOWS } from './responsive';

const Header = ({
  title,
  subtitle,
  showBack = false,
  showMenu = false,
  onBack,
  onMenuPress,
  rightComponent,
  transparent = false,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top + SPACING.sm },
        transparent && styles.transparent,
        !transparent && SHADOWS.medium,
      ]}
    >
      <View style={styles.row}>
        {/* Left Section */}
        <View style={styles.left}>
          {showBack && (
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={onBack}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={22} color={COLORS.surface} />
            </TouchableOpacity>
          )}
          {!showBack && (
            <View style={styles.logoContainer}>
              <Text style={styles.logoEmoji}>🍱</Text>
            </View>
          )}
        </View>

        {/* Center Title */}
        <View style={styles.center}>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text> : null}
        </View>

        {/* Right Section */}
        <View style={styles.right}>
          {rightComponent ? (
            rightComponent
          ) : showMenu ? (
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={onMenuPress}
              activeOpacity={0.7}
            >
              <Ionicons name="ellipsis-vertical" size={20} color={COLORS.surface} />
            </TouchableOpacity>
          ) : (
            <View style={styles.placeholder} />
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.md,
  },
  transparent: {
    backgroundColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: SPACING.sm,
  },
  left: {
    width: 40,
    alignItems: 'flex-start',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
  },
  right: {
    width: 40,
    alignItems: 'flex-end',
  },
  logoContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoEmoji: {
    fontSize: 20,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    color: COLORS.surface,
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: FONTS.sizes.xs,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 1,
  },
  placeholder: {
    width: 36,
    height: 36,
  },
});

export default Header;
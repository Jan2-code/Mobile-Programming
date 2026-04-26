import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS, scaleWidth } from './responsive';

const DonationCard = ({ donation, onPress, style }) => {
  const isAvailable = donation.status === 'Available';

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <TouchableOpacity
      style={[styles.card, SHADOWS.medium, style]}
      onPress={onPress}
      activeOpacity={0.92}
    >
      {/* Image */}
      <View style={styles.imageContainer}>
        {donation.imageUrl ? (
          <Image
            source={{ uri: donation.imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.placeholderEmoji}>🍱</Text>
          </View>
        )}
        {/* Status Badge */}
        <View style={[styles.badge, isAvailable ? styles.badgeAvailable : styles.badgeClaimed]}>
          <View style={[styles.dot, isAvailable ? styles.dotAvailable : styles.dotClaimed]} />
          <Text style={[styles.badgeText, isAvailable ? styles.badgeTextAvailable : styles.badgeTextClaimed]}>
            {donation.status}
          </Text>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>{donation.title}</Text>
        <Text style={styles.description} numberOfLines={2}>{donation.description}</Text>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.metaRow}>
            <Ionicons name="location-outline" size={13} color={COLORS.primary} />
            <Text style={styles.metaText} numberOfLines={1}>{donation.location}</Text>
          </View>
          <View style={styles.metaRow}>
            <Ionicons name="time-outline" size={13} color={COLORS.textLight} />
            <Text style={styles.timeText}>{formatDate(donation.createdAt)}</Text>
          </View>
        </View>
      </View>

      {/* Arrow */}
      <View style={styles.arrowContainer}>
        <Ionicons name="chevron-forward" size={16} color={COLORS.primary} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: RADIUS.lg,
    marginHorizontal: SPACING.md,
    marginVertical: SPACING.sm,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: scaleWidth(100),
    height: scaleWidth(100),
    borderTopLeftRadius: RADIUS.lg,
    borderBottomLeftRadius: RADIUS.lg,
  },
  imagePlaceholder: {
    width: scaleWidth(100),
    height: scaleWidth(100),
    backgroundColor: COLORS.surfaceAlt,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: RADIUS.lg,
    borderBottomLeftRadius: RADIUS.lg,
  },
  placeholderEmoji: {
    fontSize: 36,
  },
  badge: {
    position: 'absolute',
    top: SPACING.sm,
    left: SPACING.sm,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
  },
  badgeAvailable: {
    backgroundColor: COLORS.tagAvailable,
  },
  badgeClaimed: {
    backgroundColor: COLORS.tagClaimed,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  dotAvailable: {
    backgroundColor: COLORS.tagAvailableText,
  },
  dotClaimed: {
    backgroundColor: COLORS.primary,
  },
  badgeText: {
    fontSize: FONTS.sizes.xs,
    fontWeight: '700',
  },
  badgeTextAvailable: {
    color: COLORS.tagAvailableText,
  },
  badgeTextClaimed: {
    color: COLORS.primary,
  },
  content: {
    flex: 1,
    padding: SPACING.md,
    paddingRight: SPACING.xs,
  },
  title: {
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  description: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginBottom: SPACING.sm,
  },
  footer: {
    gap: 3,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.primary,
    fontWeight: '600',
    flex: 1,
  },
  timeText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textLight,
  },
  arrowContainer: {
    paddingRight: SPACING.md,
  },
});

export default DonationCard;
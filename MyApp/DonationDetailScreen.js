import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { auth } from '../firebase';
import ButtonPrimary from './ButtonPrrimary';
import Loader, { InlineLoader } from './Loader';
import { getDonation, claimDonation, deleteDonation, markAvailable } from './donationService';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS, W } from './responsive';

const DonationDetailScreen = ({ route, navigation }) => {
  const { donationId } = route.params;
  const [donation, setDonation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const user = auth.currentUser;

  useEffect(() => {
    fetchDonation();
  }, []);

  const fetchDonation = async () => {
    try {
      const data = await getDonation(donationId);
      setDonation(data);
    } catch (error) {
      Alert.alert('Error', 'Could not load donation details.');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleClaim = () => {
    if (donation.status !== 'Available') return;

    Alert.alert(
      'Claim Donation',
      `Are you sure you want to claim "${donation.title}"? The donor will see that you've claimed it.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Claim It!',
          onPress: async () => {
            setActionLoading(true);
            try {
              await claimDonation(donationId, user.uid, user.displayName || 'Anonymous');
              await fetchDonation();
              Alert.alert('🎉 Claimed!', 'You have successfully claimed this donation. Please pick it up from the location mentioned.');
            } catch (error) {
              Alert.alert('Error', 'Could not claim donation. Try again.');
            } finally {
              setActionLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Donation',
      'Are you sure you want to delete this donation? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setActionLoading(true);
            try {
              await deleteDonation(donationId);
              navigation.goBack();
            } catch (error) {
              Alert.alert('Error', 'Could not delete donation.');
              setActionLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleMarkAvailable = () => {
    Alert.alert(
      'Mark as Available',
      'This will reset the donation status back to Available.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: async () => {
            setActionLoading(true);
            try {
              await markAvailable(donationId);
              await fetchDonation();
            } catch (error) {
              Alert.alert('Error', 'Could not update status.');
            } finally {
              setActionLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this food donation: "${donation.title}" at ${donation.location}. Download FoodShare to claim it!`,
        title: donation.title,
      });
    } catch (error) {}
  };

  if (loading) return <InlineLoader message="Loading details..." />;
  if (!donation) return null;

  const isOwner = donation.userId === user?.uid;
  const isAvailable = donation.status === 'Available';
  const isClaimed = donation.status === 'Claimed';
  const canClaim = !isOwner && isAvailable;

  return (
    <View style={styles.container}>
      <Loader visible={actionLoading} message="Processing..." />

      <ScrollView showsVerticalScrollIndicator={false} bounces={true}>
        {/* Hero Image */}
        <View style={styles.heroContainer}>
          {donation.imageUrl ? (
            <Image
              source={{ uri: donation.imageUrl }}
              style={styles.heroImage}
              resizeMode="cover"
            />
          ) : (
            <LinearGradient
              colors={[COLORS.surfaceAlt, COLORS.border]}
              style={styles.heroPlaceholder}
            >
              <Text style={styles.placeholderEmoji}>🍱</Text>
            </LinearGradient>
          )}

          {/* Overlay gradient */}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.7)']}
            style={styles.heroOverlay}
          />

          {/* Back + Share buttons */}
          <SafeAreaView style={styles.topButtons} edges={['top']}>
            <TouchableOpacity
              style={styles.circleBtn}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={20} color={COLORS.text} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.circleBtn} onPress={handleShare}>
              <Ionicons name="share-social-outline" size={20} color={COLORS.text} />
            </TouchableOpacity>
          </SafeAreaView>

          {/* Status badge on hero */}
          <View style={[styles.heroBadge, isAvailable ? styles.badgeGreen : styles.badgeOrange]}>
            <View style={[styles.badgeDot, isAvailable ? styles.dotGreen : styles.dotOrange]} />
            <Text style={[styles.badgeText, isAvailable ? styles.badgeTextGreen : styles.badgeTextOrange]}>
              {donation.status}
            </Text>
          </View>
        </View>

        {/* Content Card */}
        <View style={styles.contentCard}>
          <Text style={styles.title}>{donation.title}</Text>

          {/* Donor Info */}
          <View style={styles.donorRow}>
            <View style={styles.donorAvatar}>
              <Text style={styles.donorInitial}>
                {(donation.userName || 'A').charAt(0).toUpperCase()}
              </Text>
            </View>
            <View>
              <Text style={styles.donorName}>{donation.userName || 'Anonymous'}</Text>
              <Text style={styles.donorLabel}>Food Donor</Text>
            </View>
            {isOwner && (
              <View style={styles.ownerBadge}>
                <Text style={styles.ownerBadgeText}>Your Donation</Text>
              </View>
            )}
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Details */}
          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <View style={[styles.detailIcon, { backgroundColor: '#FFF0E8' }]}>
                <Ionicons name="location" size={18} color={COLORS.primary} />
              </View>
              <View style={styles.detailText}>
                <Text style={styles.detailLabel}>Pickup Location</Text>
                <Text style={styles.detailValue}>{donation.location}</Text>
              </View>
            </View>

            <View style={styles.detailItem}>
              <View style={[styles.detailIcon, { backgroundColor: '#E8FFF5' }]}>
                <Ionicons name="time" size={18} color={COLORS.success} />
              </View>
              <View style={styles.detailText}>
                <Text style={styles.detailLabel}>Posted On</Text>
                <Text style={styles.detailValue}>{formatDate(donation.createdAt)}</Text>
              </View>
            </View>

            {isClaimed && donation.claimedByName && (
              <View style={styles.detailItem}>
                <View style={[styles.detailIcon, { backgroundColor: '#FFF8E8' }]}>
                  <Ionicons name="person-circle" size={18} color={COLORS.accent} />
                </View>
                <View style={styles.detailText}>
                  <Text style={styles.detailLabel}>Claimed By</Text>
                  <Text style={styles.detailValue}>{donation.claimedByName}</Text>
                </View>
              </View>
            )}
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About this Donation</Text>
            <Text style={styles.descriptionText}>{donation.description}</Text>
          </View>

          {/* Safety Note */}
          <View style={styles.safetyBox}>
            <Ionicons name="shield-checkmark" size={18} color={COLORS.secondary} />
            <Text style={styles.safetyText}>
              Please ensure food is safe and fresh before consuming. Check with the donor if in doubt.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Area */}
      <View style={[styles.actionArea, SHADOWS.large]}>
        {canClaim && (
          <ButtonPrimary
            title="Claim This Donation"
            onPress={handleClaim}
            icon="hand-left"
            iconPosition="left"
            size="lg"
          />
        )}

        {isClaimed && !isOwner && donation.claimedBy === user?.uid && (
          <View style={styles.claimedByYou}>
            <Ionicons name="checkmark-circle" size={24} color={COLORS.success} />
            <Text style={styles.claimedByYouText}>You claimed this donation</Text>
          </View>
        )}

        {isClaimed && !isOwner && donation.claimedBy !== user?.uid && (
          <View style={styles.claimedByOther}>
            <Ionicons name="close-circle" size={24} color={COLORS.danger} />
            <Text style={styles.claimedByOtherText}>This donation has been claimed</Text>
          </View>
        )}

        {isOwner && (
          <View style={styles.ownerActions}>
            {isClaimed && (
              <ButtonPrimary
                title="Mark Available Again"
                onPress={handleMarkAvailable}
                variant="outline"
                size="md"
                icon="refresh"
                style={styles.ownerBtn}
              />
            )}
            <ButtonPrimary
              title="Delete Donation"
              onPress={handleDelete}
              variant="danger"
              size="md"
              icon="trash-outline"
              style={styles.ownerBtn}
            />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  heroContainer: {
    position: 'relative',
    height: W * 0.7,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderEmoji: {
    fontSize: 80,
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
  },
  topButtons: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
  },
  circleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.small,
  },
  heroBadge: {
    position: 'absolute',
    bottom: SPACING.md,
    right: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    gap: 6,
  },
  badgeGreen: { backgroundColor: COLORS.tagAvailable },
  badgeOrange: { backgroundColor: COLORS.tagClaimed },
  badgeDot: { width: 8, height: 8, borderRadius: 4 },
  dotGreen: { backgroundColor: COLORS.tagAvailableText },
  dotOrange: { backgroundColor: COLORS.primary },
  badgeText: { fontSize: FONTS.sizes.sm, fontWeight: '700' },
  badgeTextGreen: { color: COLORS.tagAvailableText },
  badgeTextOrange: { color: COLORS.primary },
  contentCard: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    marginTop: -RADIUS.xl,
    padding: SPACING.xl,
    paddingBottom: 120,
  },
  title: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: '900',
    color: COLORS.text,
    marginBottom: SPACING.md,
    lineHeight: 30,
  },
  donorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  donorAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  donorInitial: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '800',
    color: COLORS.surface,
  },
  donorName: {
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
    color: COLORS.text,
  },
  donorLabel: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textSecondary,
  },
  ownerBadge: {
    marginLeft: 'auto',
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  ownerBadgeText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.primary,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginBottom: SPACING.lg,
  },
  detailsGrid: {
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.md,
  },
  detailIcon: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  detailText: {
    flex: 1,
  },
  detailLabel: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textLight,
    fontWeight: '600',
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  detailValue: {
    fontSize: FONTS.sizes.md,
    color: COLORS.text,
    fontWeight: '500',
    lineHeight: 20,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  descriptionText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    lineHeight: 24,
  },
  safetyBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#E8FFFE',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    gap: SPACING.sm,
    borderWidth: 1,
    borderColor: '#B2F0EC',
  },
  safetyText: {
    flex: 1,
    fontSize: FONTS.sizes.sm,
    color: COLORS.secondary,
    lineHeight: 18,
  },
  actionArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    paddingBottom: SPACING.xl,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  claimedByYou: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    padding: SPACING.md,
    backgroundColor: '#E8FFF5',
    borderRadius: RADIUS.lg,
  },
  claimedByYouText: {
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
    color: COLORS.success,
  },
  claimedByOther: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    padding: SPACING.md,
    backgroundColor: '#FFF0F3',
    borderRadius: RADIUS.lg,
  },
  claimedByOtherText: {
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
    color: COLORS.danger,
  },
  ownerActions: {
    gap: SPACING.sm,
  },
  ownerBtn: {
    borderRadius: RADIUS.md,
  },
});

export default DonationDetailScreen;
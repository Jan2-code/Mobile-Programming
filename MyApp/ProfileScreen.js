import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../firebase';
import DonationCard from './Donationcard';
import ButtonPrimary from './ButtonPrrimary';
import EmptyState from './EmptyState';
import { InlineLoader } from './Loader';
import { logOut } from './authService';
import { subscribeToUserDonations } from './donationService';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from './responsive';

const StatCard = ({ value, label, icon, color }) => (
  <View style={[styles.statCard, SHADOWS.small]}>
    <View style={[styles.statIconBg, { backgroundColor: color + '20' }]}>
      <Ionicons name={icon} size={20} color={color} />
    </View>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const ProfileScreen = ({ navigation }) => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;
    const unsubscribe = subscribeToUserDonations(user.uid, (data) => {
      setDonations(data);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            setLoggingOut(true);
            try {
              await logOut();
            } catch (error) {
              Alert.alert('Error', 'Could not sign out. Try again.');
              setLoggingOut(false);
            }
          },
        },
      ]
    );
  };

  const availableCount = donations.filter((d) => d.status === 'Available').length;
  const claimedCount = donations.filter((d) => d.status === 'Claimed').length;

  const getAvatarColor = () => {
    const colors = [COLORS.primary, COLORS.secondary, COLORS.accent, '#8B5CF6', '#EC4899'];
    const index = (user?.displayName?.charCodeAt(0) || 0) % colors.length;
    return colors[index];
  };

  const renderHeader = () => (
    <View>
      {/* Profile Header */}
      <LinearGradient
        colors={[COLORS.primary, COLORS.primaryDark]}
        style={styles.profileHeader}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <SafeAreaView edges={['top']}>
          <View style={styles.headerTop}>
            <Text style={styles.headerTitle}>My Profile</Text>
            <TouchableOpacity
              style={styles.logoutBtn}
              onPress={handleLogout}
              disabled={loggingOut}
            >
              <Ionicons name="log-out-outline" size={22} color={COLORS.surface} />
            </TouchableOpacity>
          </View>

          {/* Avatar */}
          <View style={styles.avatarSection}>
            <View style={[styles.avatar, { backgroundColor: getAvatarColor() }]}>
              <Text style={styles.avatarText}>
                {(user?.displayName || 'U').charAt(0).toUpperCase()}
              </Text>
            </View>
            <Text style={styles.userName}>{user?.displayName || 'Anonymous User'}</Text>
            <Text style={styles.userEmail}>{user?.email}</Text>

            <View style={styles.memberBadge}>
              <Ionicons name="leaf" size={12} color={COLORS.success} />
              <Text style={styles.memberBadgeText}>Community Member</Text>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <StatCard
          value={donations.length}
          label="Total Shared"
          icon="restaurant"
          color={COLORS.primary}
        />
        <StatCard
          value={availableCount}
          label="Available"
          icon="checkmark-circle"
          color={COLORS.success}
        />
        <StatCard
          value={claimedCount}
          label="Claimed"
          icon="heart"
          color={COLORS.secondary}
        />
      </View>

      {/* Impact Card */}
      <View style={[styles.impactCard, SHADOWS.medium]}>
        <LinearGradient
          colors={['#FF6B35', '#FF8C61']}
          style={styles.impactGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.impactContent}>
            <View>
              <Text style={styles.impactTitle}>Your Impact 🌍</Text>
              <Text style={styles.impactSubtitle}>
                You've helped {claimedCount} people by sharing food!
              </Text>
            </View>
            <Text style={styles.impactEmoji}>🏆</Text>
          </View>
        </LinearGradient>
      </View>

      {/* My Donations Title */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>My Donations</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate('AddDonation')}
        >
          <Ionicons name="add" size={18} color={COLORS.surface} />
          <Text style={styles.addBtnText}>Add New</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) return <InlineLoader message="Loading your profile..." />;

  return (
    <View style={styles.container}>
      <FlatList
        data={donations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <DonationCard
            donation={item}
            onPress={() => navigation.navigate('DonationDetail', { donationId: item.id })}
          />
        )}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <EmptyState
            emoji="🍽️"
            title="No donations yet"
            subtitle="Start sharing food with your community!"
            actionLabel="Add Your First Donation"
            onAction={() => navigation.navigate('AddDonation')}
          />
        }
        contentContainerStyle={[
          styles.listContent,
          donations.length === 0 && styles.emptyList,
        ]}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  profileHeader: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.xl + SPACING.md,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: SPACING.md,
    marginBottom: SPACING.lg,
  },
  headerTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '800',
    color: COLORS.surface,
  },
  logoutBtn: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.sm,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarSection: {
    alignItems: 'center',
    paddingBottom: SPACING.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  avatarText: {
    fontSize: FONTS.sizes.xxxl,
    fontWeight: '900',
    color: COLORS.surface,
  },
  userName: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: '800',
    color: COLORS.surface,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: FONTS.sizes.sm,
    color: 'rgba(255,255,255,0.75)',
    marginBottom: SPACING.sm,
  },
  memberBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(6,214,160,0.2)',
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(6,214,160,0.4)',
  },
  memberBadgeText: {
    fontSize: FONTS.sizes.xs,
    color: '#00FFC6',
    fontWeight: '700',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.md,
    marginTop: -(SPACING.lg),
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    alignItems: 'center',
    gap: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statIconBg: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statValue: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '900',
    color: COLORS.text,
  },
  statLabel: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textSecondary,
    fontWeight: '600',
    textAlign: 'center',
  },
  impactCard: {
    marginHorizontal: SPACING.md,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    marginBottom: SPACING.lg,
  },
  impactGradient: {
    padding: SPACING.lg,
  },
  impactContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  impactTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '800',
    color: COLORS.surface,
    marginBottom: 4,
  },
  impactSubtitle: {
    fontSize: FONTS.sizes.sm,
    color: 'rgba(255,255,255,0.85)',
    maxWidth: 220,
    lineHeight: 18,
  },
  impactEmoji: {
    fontSize: 48,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.xs,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '800',
    color: COLORS.text,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    gap: 4,
  },
  addBtnText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '700',
    color: COLORS.surface,
  },
  listContent: {
    paddingBottom: 100,
  },
  emptyList: {
    flexGrow: 1,
  },
});

export default ProfileScreen;
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  TextInput,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { auth } from '../firebase';
import DonationCard from './Donationcard';
import EmptyState from './EmptyState';
import { InlineLoader } from './Loader';
import { subscribeToAllDonations } from './donationService';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from './responsive';

const FILTER_OPTIONS = ['All', 'Available', 'Claimed'];

const HomeScreen = ({ navigation }) => {
  const [donations, setDonations] = useState([]);
  const [filteredDonations, setFilteredDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const user = auth.currentUser;

  useEffect(() => {
    // Real-time Firestore listener
    const unsubscribe = subscribeToAllDonations((data) => {
      setDonations(data);
      setLoading(false);
      setRefreshing(false);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    let result = donations;

    // Filter by status
    if (activeFilter !== 'All') {
      result = result.filter((d) => d.status === activeFilter);
    }

    // Filter by search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (d) =>
          d.title?.toLowerCase().includes(q) ||
          d.description?.toLowerCase().includes(q) ||
          d.location?.toLowerCase().includes(q)
      );
    }

    setFilteredDonations(result);
  }, [donations, activeFilter, searchQuery]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Refresh is handled by onSnapshot; just set a timeout to clear
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  if (loading) {
    return <InlineLoader message="Loading donations..." />;
  }

  const renderHeader = () => (
    <View>
      {/* Gradient Header */}
      <LinearGradient
        colors={[COLORS.primary, COLORS.primaryDark]}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <SafeAreaView edges={['top']}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>{greeting()} 👋</Text>
              <Text style={styles.userName}>{user?.displayName || 'Friend'}</Text>
            </View>
            <View style={styles.headerRight}>
              <TouchableOpacity
                style={styles.notifBtn}
                onPress={() => navigation.navigate('Profile')}
              >
                <Text style={styles.avatarEmoji}>
                  {(user?.displayName || 'U').charAt(0).toUpperCase()}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNum}>{donations.filter((d) => d.status === 'Available').length}</Text>
              <Text style={styles.statLabel}>Available</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNum}>{donations.filter((d) => d.status === 'Claimed').length}</Text>
              <Text style={styles.statLabel}>Claimed</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNum}>{donations.length}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, SHADOWS.small]}>
          <Ionicons name="search-outline" size={18} color={COLORS.textLight} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search donations..."
            placeholderTextColor={COLORS.textLight}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={COLORS.textLight} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        {FILTER_OPTIONS.map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[styles.filterTab, activeFilter === filter && styles.filterTabActive]}
            onPress={() => setActiveFilter(filter)}
            activeOpacity={0.7}
          >
            <Text style={[styles.filterText, activeFilter === filter && styles.filterTextActive]}>
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Section Title */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          {activeFilter === 'All' ? 'All Donations' : `${activeFilter} Donations`}
        </Text>
        <Text style={styles.sectionCount}>{filteredDonations.length} items</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredDonations}
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
            emoji="🍱"
            title="No donations found"
            subtitle={
              searchQuery
                ? `No results for "${searchQuery}"`
                : 'Be the first to share food in your community!'
            }
            actionLabel={!searchQuery ? 'Add Donation' : undefined}
            onAction={!searchQuery ? () => navigation.navigate('AddDonation') : undefined}
          />
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
        contentContainerStyle={[
          styles.listContent,
          filteredDonations.length === 0 && styles.emptyList,
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
  headerGradient: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.xl + SPACING.md,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: SPACING.md,
    marginBottom: SPACING.lg,
  },
  greeting: {
    fontSize: FONTS.sizes.sm,
    color: 'rgba(255,255,255,0.8)',
  },
  userName: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '800',
    color: COLORS.surface,
    marginTop: 2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  notifBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  avatarEmoji: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '800',
    color: COLORS.surface,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNum: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: '800',
    color: COLORS.surface,
  },
  statLabel: {
    fontSize: FONTS.sizes.xs,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 2,
    fontWeight: '600',
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginVertical: 4,
  },
  searchContainer: {
    paddingHorizontal: SPACING.md,
    marginTop: -(SPACING.lg),
    marginBottom: SPACING.md,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.md,
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchIcon: {
    marginRight: SPACING.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: FONTS.sizes.md,
    color: COLORS.text,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.md,
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  filterTab: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  filterTabActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  filterTextActive: {
    color: COLORS.surface,
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
  sectionCount: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: 100, // tab bar space
  },
  emptyList: {
    flexGrow: 1,
  },
});

export default HomeScreen;
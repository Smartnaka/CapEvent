import React, { useCallback, useEffect, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { buildDailySummary, loadMoments } from '../storage/localDb';
import { DailySummary, Moment } from '../types/moment';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { MomentItem } from '../components/MomentItem';
import { Colors, Gradients, Radius, Shadow, Spacing, Typography } from '../design/tokens';

interface HomeDashboardScreenProps {
  onNavigateCapture?: () => void;
  onNavigateSummary?: () => void;
}

function useScreenEntrance(delay = 0) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(10);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 400 }));
    translateY.value = withDelay(delay, withSpring(0, { damping: 20, stiffness: 180 }));
    // delay is a mount-time constant — intentionally excluded from deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function HomeDashboardScreen({
  onNavigateCapture,
  onNavigateSummary,
}: HomeDashboardScreenProps) {
  const insets = useSafeAreaInsets();
  const [summary, setSummary] = useState<DailySummary | null>(null);
  const [moments, setMoments] = useState<Moment[]>([]);

  const headerAnim = useScreenEntrance(0);
  const heroAnim = useScreenEntrance(80);
  const statsAnim = useScreenEntrance(140);
  const listAnim = useScreenEntrance(200);

  const fabScale = useSharedValue(1);
  const fabPulse = useSharedValue(1);

  useEffect(() => {
    fabPulse.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 1200 }),
        withTiming(1, { duration: 1200 }),
      ),
      -1,
      false,
    );
  }, []);

  const fabAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: fabScale.value }],
  }));

  const fabPulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: fabPulse.value }],
    opacity: (fabPulse.value - 1) * -3 + 0.25,
  }));

  const handleFabPressIn = () => {
    fabScale.value = withSpring(0.9, { damping: 15, stiffness: 350 });
  };

  const handleFabPressOut = () => {
    fabScale.value = withSpring(1, { damping: 15, stiffness: 350 });
  };

  const hydrate = useCallback(async () => {
    const [sum, moms] = await Promise.all([buildDailySummary(), loadMoments()]);
    setSummary(sum);
    setMoments(moms.slice(0, 5));
  }, []);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Ambient background glow */}
      <View style={styles.ambientGlow} pointerEvents="none" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 110 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View style={[styles.header, headerAnim]}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>Good morning ✦</Text>
              <Text style={styles.appTitle}>CapEvent AI</Text>
            </View>
            <View style={styles.avatarBadge}>
              <LinearGradient
                colors={Gradients.primary}
                style={styles.avatar}
              >
                <Text style={styles.avatarText}>C</Text>
              </LinearGradient>
            </View>
          </View>
          <Text style={styles.dateText}>{today}</Text>
        </Animated.View>

        {/* Stats Row */}
        <Animated.View style={[styles.statsRow, statsAnim]}>
          <View style={[styles.statCard, Shadow.soft]}>
            <Text style={styles.statValue}>{moments.length}</Text>
            <Text style={styles.statLabel}>Moments</Text>
          </View>
          <View style={[styles.statCard, styles.statCardAccent, Shadow.soft]}>
            <Text style={[styles.statValue, { color: Colors.accent }]}>AI</Text>
            <Text style={styles.statLabel}>Summary</Text>
          </View>
          <View style={[styles.statCard, Shadow.soft]}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Shared</Text>
          </View>
        </Animated.View>

        {/* Hero — AI Summary Card */}
        <Animated.View style={heroAnim}>
          <LinearGradient
            colors={['rgba(99,102,241,0.18)', 'rgba(139,92,246,0.08)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.heroCard, Shadow.medium]}
          >
            <View style={styles.heroMeta}>
              <View style={styles.heroTag}>
                <Text style={styles.heroTagDot}>✦</Text>
                <Text style={styles.heroTagText}>AI Summary</Text>
              </View>
            </View>
            <Text style={styles.heroSummary}>
              {summary?.summaryText ?? 'Generating your daily AI summary…'}
            </Text>
            <Button
              label="View Full Summary →"
              onPress={onNavigateSummary ?? (() => {})}
              style={styles.heroButton}
            />
          </LinearGradient>
        </Animated.View>

        {/* Recent Moments */}
        <Animated.View style={[styles.section, listAnim]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Moments</Text>
            <View style={styles.sectionCountBadge}>
              <Text style={styles.sectionCount}>{moments.length}</Text>
            </View>
          </View>

          {moments.length === 0 ? (
            <Card style={styles.emptyCard}>
              <Text style={styles.emptyIcon}>✦</Text>
              <Text style={styles.emptyTitle}>No moments yet</Text>
              <Text style={styles.emptySubtitle}>
                Tap + to capture your first event moment
              </Text>
            </Card>
          ) : (
            <View style={styles.momentList}>
              {moments.map((moment, index) => (
                <StaggerItem key={moment.id} index={index}>
                  <MomentItem moment={moment} index={index} />
                </StaggerItem>
              ))}
            </View>
          )}
        </Animated.View>
      </ScrollView>

      {/* Floating Action Button */}
      <View style={[styles.fabContainer, { bottom: insets.bottom + 28 }]}>
        <Animated.View style={[styles.fabPulseRing, fabPulseStyle]} />
        <AnimatedPressable
          style={[styles.fabOuter, fabAnimatedStyle, Shadow.glow]}
          onPress={onNavigateCapture}
          onPressIn={handleFabPressIn}
          onPressOut={handleFabPressOut}
        >
          <LinearGradient
            colors={Gradients.primary}
            style={styles.fab}
          >
            <Text style={styles.fabIcon}>+</Text>
          </LinearGradient>
        </AnimatedPressable>
      </View>
    </View>
  );
}

interface StaggerItemProps {
  children: React.ReactNode;
  index: number;
}

function StaggerItem({ children, index }: StaggerItemProps) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(16);

  useEffect(() => {
    const delay = index * 60;
    opacity.value = withDelay(delay, withTiming(1, { duration: 350 }));
    translateY.value = withDelay(delay, withSpring(0, { damping: 20, stiffness: 180 }));
    // index is stable at mount time — intentionally excluded from deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const anim = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return <Animated.View style={anim}>{children}</Animated.View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  ambientGlow: {
    position: 'absolute',
    top: -120,
    left: -80,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: Colors.primaryGlow,
    opacity: 0.25,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    gap: Spacing.lg,
  },
  header: {
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xs,
    gap: Spacing.xs,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  greeting: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.accent,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  appTitle: {
    ...Typography.largeTitle,
  },
  avatarBadge: {
    ...Shadow.medium,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  dateText: {
    ...Typography.caption,
    fontWeight: '500',
    color: Colors.mutedText,
    letterSpacing: 0.3,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Radius.xl,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 3,
  },
  statCardAccent: {
    borderColor: Colors.borderGlow,
    backgroundColor: Colors.primaryLight,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text,
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: Colors.mutedText,
    letterSpacing: 0.4,
  },
  heroCard: {
    borderRadius: Radius.xxl,
    padding: Spacing.lg,
    gap: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderGlow,
  },
  heroMeta: {
    flexDirection: 'row',
  },
  heroTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.borderGlow,
  },
  heroTagDot: {
    fontSize: 10,
    color: Colors.accent,
  },
  heroTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.accent,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  heroSummary: {
    ...Typography.body,
    lineHeight: 26,
    color: Colors.text,
  },
  heroButton: {
    marginTop: 4,
  },
  section: {
    gap: Spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    ...Typography.headline,
    fontSize: 18,
  },
  sectionCountBadge: {
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  sectionCount: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.accent,
  },
  momentList: {
    gap: Spacing.md,
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: 44,
    gap: Spacing.sm,
  },
  emptyIcon: {
    fontSize: 32,
    color: Colors.accent,
  },
  emptyTitle: {
    ...Typography.headline,
    fontSize: 17,
  },
  emptySubtitle: {
    ...Typography.caption,
    textAlign: 'center',
    lineHeight: 20,
  },
  fabContainer: {
    position: 'absolute',
    right: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabPulseRing: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
  },
  fabOuter: {
    borderRadius: 30,
    overflow: 'hidden',
  },
  fab: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabIcon: {
    fontSize: 28,
    color: Colors.text,
    fontWeight: '300',
    lineHeight: 32,
  },
});

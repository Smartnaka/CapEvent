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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { buildDailySummary, loadMoments } from '../storage/localDb';
import { DailySummary, Moment } from '../types/moment';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { MomentItem } from '../components/MomentItem';
import { Colors, Radius, Shadow, Spacing, Typography } from '../design/tokens';

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
  const listAnim = useScreenEntrance(160);

  const fabScale = useSharedValue(1);
  const fabPulse = useSharedValue(1);

  useEffect(() => {
    fabPulse.value = withRepeat(
      withSequence(
        withTiming(1.08, { duration: 1000 }),
        withTiming(1, { duration: 1000 }),
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
    opacity: (fabPulse.value - 1) * -4 + 0.3,
  }));

  const handleFabPressIn = () => {
    fabScale.value = withSpring(0.92, { damping: 15, stiffness: 350 });
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
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View style={[styles.header, headerAnim]}>
          <Text style={styles.appTitle}>CapEvent AI</Text>
          <Text style={styles.appSubtitle}>Your event memory assistant</Text>
          <Text style={styles.dateText}>{today}</Text>
        </Animated.View>

        {/* Hero — Daily Summary Card */}
        <Animated.View style={heroAnim}>
          <Card style={styles.heroCard}>
            <View style={styles.heroMeta}>
              <View style={styles.heroTag}>
                <Text style={styles.heroTagText}>✦ AI Summary</Text>
              </View>
            </View>
            <Text style={styles.heroSummary}>
              {summary?.summaryText ?? 'Generating your daily AI summary…'}
            </Text>
            <Button
              label="View Daily Summary"
              onPress={onNavigateSummary ?? (() => {})}
              style={styles.heroButton}
            />
          </Card>
        </Animated.View>

        {/* Recent Moments */}
        <Animated.View style={[styles.section, listAnim]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Moments</Text>
            <Text style={styles.sectionCount}>{moments.length}</Text>
          </View>

          {moments.length === 0 ? (
            <Card style={styles.emptyCard}>
              <Text style={styles.emptyIcon}>📝</Text>
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
      <View style={[styles.fabContainer, { bottom: insets.bottom + 24 }]}>
        <Animated.View style={[styles.fabPulseRing, fabPulseStyle]} />
        <AnimatedPressable
          style={[styles.fab, fabAnimatedStyle, Shadow.medium]}
          onPress={onNavigateCapture}
          onPressIn={handleFabPressIn}
          onPressOut={handleFabPressOut}
        >
          <Text style={styles.fabIcon}>+</Text>
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
  scroll: {
    flex: 1,
  },
  content: {
    padding: Spacing.md,
    gap: Spacing.lg,
  },
  header: {
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  appTitle: {
    ...Typography.largeTitle,
    marginBottom: 4,
  },
  appSubtitle: {
    ...Typography.body,
    color: Colors.secondaryText,
    marginBottom: 6,
  },
  dateText: {
    ...Typography.caption,
    fontWeight: '500',
    color: Colors.secondaryText,
  },
  heroCard: {
    gap: Spacing.md,
    ...Shadow.medium,
  },
  heroMeta: {
    flexDirection: 'row',
  },
  heroTag: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  heroTagText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
  },
  heroSummary: {
    ...Typography.body,
    lineHeight: 26,
    color: Colors.text,
  },
  heroButton: {
    marginTop: Spacing.sm,
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
  sectionCount: {
    ...Typography.caption,
    backgroundColor: Colors.border,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
    overflow: 'hidden',
    color: Colors.secondaryText,
    fontWeight: '600',
  },
  momentList: {
    gap: Spacing.md,
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: 36,
    gap: Spacing.sm,
  },
  emptyIcon: {
    fontSize: 36,
  },
  emptyTitle: {
    ...Typography.headline,
    fontSize: 17,
  },
  emptySubtitle: {
    ...Typography.caption,
    textAlign: 'center',
  },
  fabContainer: {
    position: 'absolute',
    right: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabPulseRing: {
    position: 'absolute',
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.primary,
  },
  fab: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabIcon: {
    fontSize: 30,
    color: Colors.surface,
    fontWeight: '300',
    lineHeight: 34,
  },
});

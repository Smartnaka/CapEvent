import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { buildDailySummary, loadMoments } from '../storage/localDb';
import { DailySummary } from '../types/moment';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Colors, Radius, Shadow, Spacing, Typography } from '../design/tokens';

function useScreenEntrance(delay = 0) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(12);

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

interface StaggerItemProps {
  children: React.ReactNode;
  index: number;
}

function StaggerItem({ children, index }: StaggerItemProps) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(16);

  useEffect(() => {
    const delay = 200 + index * 60;
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

export function DailySummaryScreen() {
  const insets = useSafeAreaInsets();
  const [summary, setSummary] = useState<DailySummary | null>(null);

  const headerAnim = useScreenEntrance(0);
  const heroAnim = useScreenEntrance(80);
  const insightsAnim = useScreenEntrance(240);

  const hydrateSummary = useCallback(async () => {
    const next = await buildDailySummary();
    setSummary(next);
  }, []);

  useEffect(() => {
    void hydrateSummary();
  }, [hydrateSummary]);

  const onShare = async () => {
    if (!summary) return;
    await Share.share({
      message: `CapEvent AI Daily Summary (${summary.date})\n\n${summary.summaryText}`,
    });
  };

  const onViewDetailedMoments = async () => {
    const moments = await loadMoments();
    Alert.alert('Detailed Moments', `You have ${moments.length} saved moments.`);
  };

  if (!summary) {
    return (
      <View style={[styles.container, styles.loadingContainer, { paddingTop: insets.top }]}>
        <Text style={styles.loadingText}>Generating summary…</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View style={[styles.header, headerAnim]}>
          <Text style={styles.title}>Daily Summary</Text>
          <Text style={styles.dateText}>{summary.date}</Text>
        </Animated.View>

        {/* Hero Summary Card */}
        <Animated.View style={heroAnim}>
          <Card style={styles.heroCard}>
            <View style={styles.heroMeta}>
              <View style={styles.heroTag}>
                <Text style={styles.heroTagText}>✦ AI Generated</Text>
              </View>
            </View>
            <Text style={styles.summaryText}>{summary.summaryText}</Text>
          </Card>
        </Animated.View>

        {/* Key Moments */}
        {summary.keyMoments.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Key Moments</Text>
            <View style={styles.momentList}>
              {summary.keyMoments.map((moment, i) => (
                <StaggerItem key={`moment-${i}`} index={i}>
                  <View style={[styles.momentCard, Shadow.soft]}>
                    <Text style={styles.momentIndex}>{i + 1}</Text>
                    <Text style={styles.momentText} numberOfLines={3}>{moment}</Text>
                  </View>
                </StaggerItem>
              ))}
            </View>
          </View>
        )}

        {/* Insights */}
        <Animated.View style={[styles.section, insightsAnim]}>
          <Text style={styles.sectionTitle}>Actionable Insights</Text>
          <Card tinted style={styles.insightsCard}>
            {summary.actionableInsights.map((insight, i) => (
              <View key={`insight-${i}`} style={styles.insightRow}>
                <Text style={styles.insightBullet}>→</Text>
                <Text style={styles.insightText}>{insight}</Text>
              </View>
            ))}
          </Card>
        </Animated.View>

        {/* Actions */}
        <Animated.View style={[styles.actions, insightsAnim]}>
          <Button label="Share Summary" onPress={onShare} />
          <Button
            label="View Detailed Moments"
            onPress={onViewDetailedMoments}
            variant="secondary"
          />
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    ...Typography.body,
    color: Colors.secondaryText,
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
    gap: 4,
  },
  title: {
    ...Typography.largeTitle,
  },
  dateText: {
    ...Typography.caption,
    fontWeight: '500',
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
  summaryText: {
    ...Typography.body,
    lineHeight: 26,
  },
  section: {
    gap: Spacing.md,
  },
  sectionTitle: {
    ...Typography.headline,
    fontSize: 18,
  },
  momentList: {
    gap: Spacing.sm,
  },
  momentCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    flexDirection: 'row',
    gap: Spacing.md,
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  momentIndex: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
    minWidth: 20,
    marginTop: 2,
  },
  momentText: {
    ...Typography.body,
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
  },
  insightsCard: {
    gap: Spacing.md,
  },
  insightRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    alignItems: 'flex-start',
  },
  insightBullet: {
    color: Colors.primary,
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 22,
  },
  insightText: {
    ...Typography.body,
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    color: Colors.text,
  },
  actions: {
    gap: Spacing.sm,
  },
});

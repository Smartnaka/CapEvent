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
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { buildDailySummary, loadMoments } from '../storage/localDb';
import { DailySummary } from '../types/moment';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Colors, Gradients, Radius, Shadow, Spacing, Typography } from '../design/tokens';

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
        <View style={styles.loadingDot} />
        <Text style={styles.loadingText}>Generating summary…</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Ambient glow */}
      <View style={styles.ambientGlow} pointerEvents="none" />
      <View style={styles.ambientGlow2} pointerEvents="none" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View style={[styles.header, headerAnim]}>
          <Text style={styles.eyebrow}>✦  AI Powered</Text>
          <Text style={styles.title}>Daily Summary</Text>
          <Text style={styles.dateText}>{summary.date}</Text>
        </Animated.View>

        {/* Hero Summary Card */}
        <Animated.View style={heroAnim}>
          <LinearGradient
            colors={['rgba(99,102,241,0.2)', 'rgba(139,92,246,0.1)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.heroCard, Shadow.medium]}
          >
            <View style={styles.heroMeta}>
              <View style={styles.heroTag}>
                <Text style={styles.heroTagDot}>✦</Text>
                <Text style={styles.heroTagText}>AI Generated</Text>
              </View>
            </View>
            <Text style={styles.summaryText}>{summary.summaryText}</Text>
          </LinearGradient>
        </Animated.View>

        {/* Key Moments */}
        {summary.keyMoments.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Key Moments</Text>
            <View style={styles.momentList}>
              {summary.keyMoments.map((moment, i) => (
                <StaggerItem key={`moment-${i}`} index={i}>
                  <View style={[styles.momentCard, Shadow.soft]}>
                    <LinearGradient
                      colors={Gradients.primary}
                      style={styles.momentIndexBadge}
                    >
                      <Text style={styles.momentIndex}>{i + 1}</Text>
                    </LinearGradient>
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
                <View style={styles.insightBulletWrap}>
                  <Text style={styles.insightBullet}>→</Text>
                </View>
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
  ambientGlow: {
    position: 'absolute',
    top: -80,
    right: -60,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: Colors.primaryGlow,
    opacity: 0.2,
  },
  ambientGlow2: {
    position: 'absolute',
    bottom: 100,
    left: -80,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: Colors.accentGlow,
    opacity: 0.15,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.accent,
  },
  loadingText: {
    ...Typography.body,
    color: Colors.secondaryText,
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
    gap: 5,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.accent,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  title: {
    ...Typography.largeTitle,
  },
  dateText: {
    ...Typography.caption,
    fontWeight: '500',
    color: Colors.mutedText,
    letterSpacing: 0.3,
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
  summaryText: {
    ...Typography.body,
    lineHeight: 26,
    color: Colors.text,
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
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Radius.xl,
    padding: Spacing.md,
    flexDirection: 'row',
    gap: Spacing.md,
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  momentIndexBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  momentIndex: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.text,
  },
  momentText: {
    ...Typography.body,
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    color: Colors.text,
  },
  insightsCard: {
    gap: Spacing.md,
  },
  insightRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    alignItems: 'flex-start',
  },
  insightBulletWrap: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  insightBullet: {
    color: Colors.accent,
    fontWeight: '700',
    fontSize: 12,
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
